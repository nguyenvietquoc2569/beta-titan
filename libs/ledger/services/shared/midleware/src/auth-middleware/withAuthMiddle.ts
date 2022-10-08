import { IStaffLoginSession } from "@beta-titan/shared/data-types";
import { AuthUrlConfig } from "./url-auth-config";

export function withAuthMiddle(handler: (...args: any) => any) {
  return async (...args: any) => {
    const handlerType = args[0] && args[1] ? "api" : "ssr";
    const req = handlerType === "api" ? args[0] : args[0].req;
    const res = handlerType === "api" ? args[1] : args[0].res;
    const query = handlerType === "api" ? args[2] : args[0].query;
    let resolvedUrl = (handlerType === "api" ? args[0].originalUrl : args[0].resolvedUrl) || args[0].url || null;
    const locales = handlerType === "api" ? args[3] : args[0].locales;
    const locale = handlerType === "api" ? args[4] : args[0].locale;
    const defaultLocale = handlerType === "api" ? args[5] : args[0].defaultLocale;

    resolvedUrl = resolvedUrl && resolvedUrl.split("?")[0] || null
    let auth = AuthUrlConfig[resolvedUrl.toLowerCase()]

    if (!auth) {
      for(const _auth of Object.values(AuthUrlConfig)) {
        if (_auth.pattern && (_auth.pattern.test(resolvedUrl))) {
          auth = _auth
          break
        }
      }
    }
    if (!auth) {
      res.setHeader("location", "/404");
      res.statusCode = 302;
      return { props: {} };
    }
    
    const loginSession: IStaffLoginSession = req.loginSession ? req.loginSession : null;
    if (auth.requiredLoginSession) {
      if (!loginSession) {
        res.setHeader("location", "/login");
        res.statusCode = 302;
        return { props: {} };
      }
    }

    if ((auth.permissions)) {
      if (!loginSession || 
        (loginSession && !auth.permissions(loginSession.workingPermision))) {
          res.setHeader("location", "/home");
          res.statusCode = 302;
          return { props: {} };
        }
    }

    if (auth.role) {
      if (!loginSession || (loginSession && !auth.role?.includes(loginSession.role))) {
        res.setHeader("location", "/home");
        res.statusCode = 302;
        return { props: {} };
      }
    }
    return handler(...args)
  }
}
export function withParamCheck(handler: (...args: any) => any, params: Array<string>) {
  return async function withUserParseHandler(...args: any) {
    const handlerType = args[0] && args[1] ? "api" : "ssr";
    const req = handlerType === "api" ? args[0] : args[0].req;
    const res = handlerType === "api" ? args[1] : args[0].res;

    const missing = []
    for (const key of params) {
      if (req.body[key] === undefined || req.body[key]===null) {
        missing.push(key)
      }
    }

    if (missing.length === 0) {
      return handler(...args)
    } else {
      res.status(400).json({
        error: 'bad request',
        missing
      })
    }
  }
}
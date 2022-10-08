import React, { useContext } from "react";

export const EnvConfigContext = React.createContext<any>(null);
export function useContextConfig() {
  let envConfig = useContext(EnvConfigContext)
  return {envConfig}
}

import * as dotenv from 'dotenv'
const result = dotenv.config()

export function getEnvConfig (variable: string | number | undefined = undefined) {

  if (result.error) {
    return variable ? (process.env[variable] || '') : ''
  } else if (!variable) {
    return (result && result.parsed) ? result.parsed : {}
  } else {
    return (result && result.parsed) ? result.parsed[variable] : ''
  }
}
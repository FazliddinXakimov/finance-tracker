export interface AppConfig {
  readonly apiPrefix: string
  readonly appName: string
  readonly version: string
}

const appConfig: Readonly<AppConfig> = Object.freeze({
  apiPrefix: import.meta.env.VITE_API_PREFIX || '/api',
  appName: 'Finance Tracker',
  version: '1.0.0',
})

export default appConfig

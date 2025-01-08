export interface Session {
  accessToken?: string
  refreshToken?: string
  codeVerifier?: string
  state?: string
}

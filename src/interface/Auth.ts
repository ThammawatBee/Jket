export interface LoginPayload {
  username: string
  password: string
}

export interface Profile {
  id: string,
  username: string,
  role: string,
  requirePasswordReset: boolean
}
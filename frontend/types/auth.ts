export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  date_joined: string
  is_active: boolean
  is_staff: boolean
  profile?: Record<string, any>
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password1: string
  password2: string
  first_name: string
  last_name: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  new_password1: string
  new_password2: string
  uid: string
  token: string
}

export interface PasswordChangeRequest {
  old_password: string
  new_password1: string
  new_password2: string
}

export interface VerifyEmailRequest {
  key: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface SocialLoginRequest {
  access_token?: string
  code?: string
  id_token?: string
}

export interface ProfileData {
  id: number
  bio: string
  updated_at: string
}

export interface ProfileUpdateRequest {
  bio: string
}

export interface TokenRefreshRequest {
  refresh: string
}

export interface TokenVerifyRequest {
  token: string
}

export interface UserUpdateRequest {
  first_name?: string
  last_name?: string
}

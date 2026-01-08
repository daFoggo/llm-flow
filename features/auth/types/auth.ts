export interface User {
  id: number;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterInput {
  email: string;
  password?: string;
}

export interface RegisterResponse {
  access_token: string;
  refresh_token: string;
  token_interface: string;
}

export interface LoginInput {
  email: string;
  password?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

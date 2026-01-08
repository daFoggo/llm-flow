export type RegisterInput = {
  email: string;
  password?: string;
};

export type RegisterResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type LoginInput = {
  email: string;
  password?: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type User = {
  id: number;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
};

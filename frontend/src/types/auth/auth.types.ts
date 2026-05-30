export interface AuthRequest {
  username: string;
  password?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
}

export interface ValidationError {
  detail: Array<{
    loc: Array<string | number>;
    msg: string;
    type: string;
    input: string;
    ctx?: Record<string, any>;
  }>;
}
import { apiRequest } from '@/lib/api';
import type {
  AuthResponse,
  LoginPayload,
  MeResponse,
  RegisterPayload,
} from '@/types/auth.types';

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function getMe(token: string): Promise<MeResponse> {
  return apiRequest<MeResponse>('/auth/me', { token });
}

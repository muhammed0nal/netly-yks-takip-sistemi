import { API_BASE_URL } from '@/constants/Api';
import type { ApiErrorResponse } from '@/types/auth.types';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    if (__DEV__) {
      console.error('[Netly] API isteği başarısız:', `${API_BASE_URL}${path}`);
    }
    throw new ApiError(
      `Sunucuya bağlanılamadı (${API_BASE_URL}). Backend çalışıyor mu? Fiziksel cihazda EXPO_PUBLIC_API_URL ayarlayın.`,
      0,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json()) as T | ApiErrorResponse;

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'error' in data
        ? (data as ApiErrorResponse).error
        : 'Bir hata oluştu';
    throw new ApiError(message, response.status);
  }

  return data as T;
}

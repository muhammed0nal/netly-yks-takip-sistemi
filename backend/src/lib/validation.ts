import { HttpError } from "./errors.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: unknown): string {
  if (typeof email !== "string" || !email.trim()) {
    throw new HttpError(400, "E-posta zorunludur");
  }

  const normalized = email.trim().toLowerCase();

  if (normalized.length > 255 || !EMAIL_REGEX.test(normalized)) {
    throw new HttpError(400, "Geçerli bir e-posta adresi girin");
  }

  return normalized;
}

export function validatePassword(password: unknown): string {
  if (typeof password !== "string" || !password) {
    throw new HttpError(400, "Şifre zorunludur");
  }

  if (password.length < 8) {
    throw new HttpError(400, "Şifre en az 8 karakter olmalıdır");
  }

  if (password.length > 128) {
    throw new HttpError(400, "Şifre en fazla 128 karakter olabilir");
  }

  return password;
}

export function validateName(name: unknown): string {
  if (typeof name !== "string" || !name.trim()) {
    throw new HttpError(400, "Ad soyad zorunludur");
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    throw new HttpError(400, "Ad soyad en az 2 karakter olmalıdır");
  }

  if (trimmed.length > 100) {
    throw new HttpError(400, "Ad soyad en fazla 100 karakter olabilir");
  }

  return trimmed;
}

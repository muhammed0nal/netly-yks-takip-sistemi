import { HttpError } from "../lib/errors.js";
import { signAccessToken } from "../lib/jwt.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { prisma } from "../lib/prisma.js";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../lib/validation.js";
import type {
  AuthResponse,
  AuthUser,
  LoginInput,
  RegisterInput,
} from "../types/auth.types.js";

function toAuthUser(user: {
  id: string;
  email: string;
  name: string;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

function createAuthResponse(user: AuthUser): AuthResponse {
  const token = signAccessToken({ sub: user.id, email: user.email });
  return { token, user };
}

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  const email = validateEmail(input.email);
  const password = validatePassword(input.password);
  const name = validateName(input.name);

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new HttpError(409, "Bu e-posta adresi zaten kayıtlı");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, name, passwordHash },
    select: { id: true, email: true, name: true },
  });

  return createAuthResponse(toAuthUser(user));
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const email = validateEmail(input.email);
  const password = validatePassword(input.password);

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new HttpError(401, "E-posta veya şifre hatalı");
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);

  if (!passwordValid) {
    throw new HttpError(401, "E-posta veya şifre hatalı");
  }

  return createAuthResponse(
    toAuthUser({
      id: user.id,
      email: user.email,
      name: user.name,
    }),
  );
}

export async function getUserById(userId: string): Promise<AuthUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    throw new HttpError(404, "Kullanıcı bulunamadı");
  }

  return toAuthUser(user);
}

import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "7d";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set and at least 32 characters long");
  }
  return secret;
}

export function assertJwtSecretConfigured(): void {
  getJwtSecret();
}

type TokenPayload = {
  sub: string;
  email: string;
};

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAccessToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token payload");
  }

  const { sub, email } = decoded as Partial<TokenPayload>;

  if (!sub || !email) {
    throw new Error("Invalid token payload");
  }

  return { sub, email };
}

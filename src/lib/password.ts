import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LEN = 64;

/** Hash a password for storage (salt:hex + scrypt digest). */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LEN).toString("hex");
  return `${salt}:${hash}`;
}

/** Verify a plaintext password against a stored hash. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  try {
    const expected = Buffer.from(hash, "hex");
    const actual = scryptSync(password, salt, KEY_LEN);
    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  } catch {
    return false;
  }
}

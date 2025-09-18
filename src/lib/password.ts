import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function saltAndHashPassword(password: string): Promise<string> {
  const saltRounds = SALT_ROUNDS;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

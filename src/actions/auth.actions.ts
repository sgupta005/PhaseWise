'use server';

import { saltAndHashPassword } from '@/lib/password';
import {
  loginSchema,
  LoginSchema,
  SignupSchema,
  signupSchema,
} from '@/schemas/auth.schema';
import { createUser as createUserDb } from '@/db/auth.db';
import { signIn } from '@/auth';

export async function login(data: LoginSchema) {
  try {
    // Validate input
    const validatedFields = loginSchema.safeParse(data);
    if (!validatedFields.success) {
      console.error('Validation error:', validatedFields.error);
      return {
        error: 'Invalid Fields.',
      };
    }

    const { email, password } = validatedFields.data;

    await signIn('credentials', { email, password, redirect: false });

    return { success: 'Logged in successfully.' };
  } catch (error) {
    console.error('Create account error:', error);
    return {
      error: 'Something went wrong.',
    };
  }
}

export async function createAccount(data: SignupSchema) {
  try {
    // Validate input
    const validatedFields = signupSchema.safeParse(data);
    if (!validatedFields.success) {
      console.error('Validation error:', validatedFields.error);
      return {
        error: 'Invalid Fields.',
      };
    }

    const { fullName, email, password } = validatedFields.data;

    const hashedPassword = await saltAndHashPassword(password);

    await createUserDb({
      name: fullName,
      email,
      password: hashedPassword,
      role: 'student',
    });

    return { success: 'Email sent successfully. Please check your inbox.' };
  } catch (error) {
    console.error('Create account error:', error);
    return {
      error: 'Something went wrong.',
    };
  }
}

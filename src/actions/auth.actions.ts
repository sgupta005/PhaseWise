'use server';

import { saltAndHashPassword } from '@/lib/password';
import {
  loginSchema,
  LoginSchema,
  SignupSchema,
  signupSchema,
} from '@/schemas/auth.schema';
import { createUser as createUserDb, getUserByEmail } from '@/db/auth.db';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

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

    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.password || !existingUser.email) {
      return {
        error: 'Invalid email or password.',
      };
    }

    // if (!existingUser.emailVerified) {
    //   const verificationToken = await createVerificationToken(
    //     existingUser.email
    //   );
    //   sendVerificationEmail(verificationToken.email, verificationToken.token);
    //   return {
    //     success: 'Verification Email Sent. Please check your inbox.',
    //   };
    // }

    await signIn('credentials', { email, password, redirect: false });

    return { success: 'Logged in successfully.' };
  } catch (error) {
    console.error('Login error:', error);

    // Handle specific AuthJS errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Wrong email or password.',
          };
        default:
          return {
            error: 'Authentication failed. Please try again.',
          };
      }
    }

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

    const { name, email, password, role } = validatedFields.data;

    const hashedPassword = await saltAndHashPassword(password);

    await createUserDb({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // const verificationToken = await createVerificationToken(email);
    // sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: 'Account Created Successfully.' };
  } catch (error) {
    console.error('Create account error:', error);
    return {
      error: 'Something went wrong.',
    };
  }
}

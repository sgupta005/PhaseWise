import z from 'zod';

export const roleSchema = z.enum(['student', 'faculty'], {
  message: 'Please select a role',
});

export type Role = z.infer<typeof roleSchema>;

export const loginSchema = z.object({
  email: z
    .string('Email is required')
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string('Password is required')
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});

export const signupSchema = z.object({
  name: z
    .string('Name is required')
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string('Email is required')
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string('Password is required')
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  role: z.enum(['student', 'faculty'], {
    message: 'Please select a role',
  }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;

import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    phoneNo?: number | null;
    password?: string | null;
    role: 'student' | 'faculty' | 'admin';
  }
}

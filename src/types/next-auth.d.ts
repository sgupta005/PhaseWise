import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    phoneNo?: number | null;
    password?: string | null;
    role: 'student' | 'faculty' | 'admin';
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'student' | 'faculty' | 'admin';
      phoneNo?: number | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

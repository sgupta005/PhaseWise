import NextAuth from 'next-auth';
import MicrosoftEntraID, {
  MicrosoftEntraIDProfile,
} from 'next-auth/providers/microsoft-entra-id';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import client from '@/lib/mongodb';
import { loginSchema } from './schemas/auth.schema';
import { getUserByEmail } from './db/auth.db';
import { verifyPassword } from './lib/password';
import { isStudentEmail } from './lib/utils';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client, {
    databaseName: process.env.DB_NAME,
  }),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider !== 'credentials') return true;
      // For now, allow credentials login without email verification
      // when email verification is implemented, return false if not verified
      return true;
    },
    async jwt({ token, user }) {
      // Add user id and role to token when user is available (on sign in)
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      // Add user id and role from token to session
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'student' | 'faculty' | 'admin';
      }
      return session;
    },
  },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = loginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const isPasswordValid = await verifyPassword(password, user.password);
          if (isPasswordValid) {
            // Convert MongoDB _id to id string for Auth.js
            return {
              id: user._id?.toString() || '',
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: user.emailVerified,
              role: user.role,
              phoneNo: user.phoneNo,
            };
          }
        }
        return null;
      },
    }),
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      profile(profile: MicrosoftEntraIDProfile) {
        const isStudentId = isStudentEmail(profile.email);

        // This sets 'student' when it looks like a student ID, otherwise 'faculty'.
        // Consider defaulting to 'student' for safety, and elevate via Entra later.
        const role = isStudentId ? 'student' : 'faculty';
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: null,
          emailVerified: null,
          role,
          phoneNo: null,
          password: null,
        };
      },
    }),
  ],
});

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

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client, {
    databaseName: process.env.DB_NAME,
  }),
  session: {
    strategy: 'jwt',
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
          if (isPasswordValid) return user;
        }
        return null;
      },
    }),
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      profile(profile: MicrosoftEntraIDProfile) {
        return {
          id: profile.sub,
          FullName: profile.name,
          email: profile.email,
          image: null,
          emailVerified: null,
          role: 'student',
          phoneNo: null,
          password: null,
        };
      },
    }),
  ],
});

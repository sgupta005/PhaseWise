import NextAuth from 'next-auth';
import MicrosoftEntraID, {
  MicrosoftEntraIDProfile,
} from 'next-auth/providers/microsoft-entra-id';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import client from '@/lib/mongodb';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client, {
    databaseName: process.env.DB_NAME,
  }),
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      profile(profile: MicrosoftEntraIDProfile) {
        return {
          id: profile.sub,
          name: profile.name,
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

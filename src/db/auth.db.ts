import client from '@/lib/mongodb';
import { type User, type UserResponse } from '@/types/auth.types';
import { v4 as uuidv4 } from 'uuid';

export async function getUserByEmail(email: string) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const users = db.collection<User>('users');

    const user = await users.findOne({ email: email.toLowerCase() });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'faculty' | 'admin';
}): Promise<UserResponse | null> {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const users = db.collection<User>('users');

    // Check if user already exists
    const existingUser = await users.findOne({
      email: userData.email.toLowerCase(),
    });
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    const now = new Date();
    const newUser: User = {
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password, // Should be hashed before calling this function
      role: userData.role || 'student',
      phoneNo: null,
      emailVerified: null,
      image: null,
      createdAt: now,
      updatedAt: now,
    };

    const result = await users.insertOne(newUser);

    if (!result.insertedId) {
      throw new Error('Failed to create user.');
    }

    // Return user without password
    return {
      id: result.insertedId.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phoneNo: newUser.phoneNo,
      emailVerified: newUser.emailVerified,
      image: newUser.image,
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
}

export async function getVerificationTokenByEmail(email: string) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const tokens = db.collection('verificationTokens');

    const token = await tokens.findOne({
      email: email.toLowerCase(),
    });

    if (!token) {
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error getting verification token:', error);
    return null;
  }
}

export async function createVerificationToken(email: string) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const tokens = db.collection('verificationTokens');

    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
      await tokens.deleteOne({ _id: existingToken._id });
    }

    const newToken = {
      email: email.toLowerCase(),
      token,
      expires,
    };

    const result = await tokens.insertOne(newToken);

    if (!result.insertedId) {
      throw new Error('Failed to create verification token.');
    }

    return newToken;
  } catch (error) {
    console.error('Error creating verification token:', error);
    throw new Error('Error creating verification token');
  }
}

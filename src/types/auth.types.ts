import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'admin';
  phoneNo?: number | null;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  phoneNo?: number | null;
  emailVerified?: Date | null;
  image?: string | null;
}

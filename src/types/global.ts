export enum UserRole {
  Patient = 'patient',
  Doctor = 'doctor',
}

export interface BaseUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  image?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;

  // Doctor-specific fields
  specialization?: string;
  description?: string;
  experience?: number;
}

// API types
export type CreateUserInput = BaseUser;

export type UserResponse = Omit<BaseUser, 'password'> & { id: string }; 
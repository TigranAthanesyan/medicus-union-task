import { Gender } from './common';
import { BriefSpecialization } from './specialization';

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
  country?: string;
  gender?: Gender;
  
  // Doctor-specific fields
  specializations?: string[];
  description?: string;
  experience?: number;
}

export type CreateUserInput = BaseUser;

export interface UserResponse extends Omit<BaseUser, 'password'> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDTO extends Omit<BaseUser, 'password'> {
  id: string;
  specializationsDisplayData?: BriefSpecialization[];
}

export interface UserSummary {
  id: string;
  name: string;
  image?: string;
  role: UserRole;
}

export interface DoctorCardDTO {
  id: string;
  name: string;
  image?: string;
  country?: string;
  specializations: string[];
  specializationsDisplayData?: BriefSpecialization[];
}

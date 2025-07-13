export enum UserRole {
  Patient = 'patient',
  Doctor = 'doctor',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
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
  specialization?: string;
  description?: string;
  experience?: number;
}

export interface BaseSpecialization {
  name: string;
  description: string;
}

export enum DataFetchStatus {
  Initial,
  InProgress,
  Success,
  Error,
}

export type Country = {
  value: string;
  label: string;
}

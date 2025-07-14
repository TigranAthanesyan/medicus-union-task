import { BaseSpecialization, BaseUser } from "./global";

export type CreateUserInput = BaseUser;

export type UserDTO = Omit<BaseUser, 'password'> & { id: string };

export type CreateSpecializationInput = BaseSpecialization;

export type SpecializationDTO = BaseSpecialization; 

export interface DoctorsApiResponse {
  success: boolean;
  data?: UserDTO[];
  error?: string;
}

export interface SpecializationsApiResponse {
  success: boolean;
  data?: SpecializationDTO[];
  error?: string;
}
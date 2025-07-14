import { BaseSpecialization, BaseUser } from "./global";

export type CreateUserInput = BaseUser;

export type BriefSpecialization = {
  key: string;
  name: string;
}

export type UserDTO = Omit<BaseUser, 'password'> & {
  id: string;
  specializationsDisplayData?: BriefSpecialization[];
};

export type DoctorCardDTO = {
  id: string;
  name: string;
  image?: string;
  country?: string;
  specializations: string[];
  specializationsDisplayData?: BriefSpecialization[];
};

export type CreateSpecializationInput = BaseSpecialization;

export type SpecializationDTO = BaseSpecialization; 

export interface DoctorsApiResponse {
  success: boolean;
  data?: DoctorCardDTO[];
  error?: string;
}

export interface DoctorByIdApiResponse {
  success: boolean;
  data?: UserDTO;
  error?: string;
}

export interface SpecializationsApiResponse {
  success: boolean;
  data?: SpecializationDTO[];
  error?: string;
}
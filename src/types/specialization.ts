export interface BaseSpecialization {
  key: string;
  name: string;
  description: string;
}

export type CreateSpecializationInput = BaseSpecialization;

export interface BriefSpecialization {
  key: string;
  name: string;
}

export interface SpecializationDTO extends BaseSpecialization {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

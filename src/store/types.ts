import { UserDTO, SpecializationDTO } from '../types/api';

export interface State {
  doctors: UserDTO[];
  specializations: SpecializationDTO[];
  
  setDoctors: (doctors: UserDTO[]) => void;
  setSpecializations: (specializations: SpecializationDTO[]) => void;
} 
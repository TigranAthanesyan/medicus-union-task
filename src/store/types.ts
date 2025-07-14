import { DoctorCardDTO, SpecializationDTO, UserDTO } from '../types/api';

export interface State {
  doctors: DoctorCardDTO[];
  doctorMapById: Record<string, UserDTO>;
  specializations: SpecializationDTO[];
  
  setDoctors: (doctors: DoctorCardDTO[]) => void;
  setDoctor: (doctor: UserDTO) => void;
  setSpecializations: (specializations: SpecializationDTO[]) => void;
} 
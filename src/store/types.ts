import { DoctorCardDTO, SpecializationDTO, UserDTO } from "../types";

export interface State {
  doctors: DoctorCardDTO[];
  doctorMapById: Record<string, UserDTO>;
  specializations: SpecializationDTO[];

  // We are not saving conversations, conversation, messages and consultations here
  // because we fetch them each time for fresh data.
  // Later when socket connection is implemented we will add all of them here as well

  setDoctors: (doctors: DoctorCardDTO[]) => void;
  setDoctor: (doctor: UserDTO) => void;
  setSpecializations: (specializations: SpecializationDTO[]) => void;
}

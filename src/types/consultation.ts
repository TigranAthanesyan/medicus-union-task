import { UserSummary } from "./user";
import { BaseApiResponse } from "./common";
import { IUser } from "../models/User";
import { IConsultation } from "../models/Consultation";

export enum ConsultationStatus {
  Pending = "pending",
  Confirmed = "confirmed", 
  Declined = "declined",
  Completed = "completed",
  Cancelled = "cancelled",
}

export enum ConsultationType {
  Video = "video",
  Audio = "audio", 
  Chat = "chat",
}

export interface BaseConsultation {
  doctorId: string;
  patientId: string;
  dateTime: Date;
  duration: number; // minutes
  status: ConsultationStatus;
  type: ConsultationType;
  notes?: string; // doctor's private notes
  conversationId?: string;
}

export type CreateConsultationInput = Omit<BaseConsultation, 'status'>;

export interface ConsultationDTO extends BaseConsultation {
  id: string;
  doctor: UserSummary;
  patient: UserSummary;
  price: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PopulatedConsultation = Omit<IConsultation, 'doctorId' | 'patientId'> & {
  doctorId: IUser;
  patientId: IUser;
};

export interface CreateConsultationRequest {
  doctorId: string;
  dateTime: string; // ISO string
  type: ConsultationType;
}

export interface UpdateConsultationRequest {
  status?: ConsultationStatus;
  notes?: string;
}

export interface TimeSlot {
  time: string; // "09:00", "10:30"
  available: boolean;
  consultationId?: string;
}

export interface DayAvailability {
  date: string; // "2024-12-15"
  dayName: string; // "Monday"
  slots: TimeSlot[];
}

export type ConsultationsApiResponse = BaseApiResponse<ConsultationDTO[]>;
export type ConsultationApiResponse = BaseApiResponse<ConsultationDTO>;
export type CreateConsultationApiResponse = BaseApiResponse<ConsultationDTO>;
export type AvailabilityApiResponse = BaseApiResponse<DayAvailability[]>;

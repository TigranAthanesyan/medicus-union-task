import { ConversationDTO, UserDTO, UserSummary, MessageDTO, ConversationSummary, BriefSpecialization, ConsultationDTO, PopulatedConsultation } from "../types";
import { PopulatedConversation } from "../models/Conversation";
import { IUser } from "../models/User";
import { IMessage } from "../models/Message";
import { ISpecialization } from "../models/Specialization";
import { IConsultation } from "../models/Consultation";

export const userToUserDTO = (user: IUser, specializationsData?: ISpecialization[]): UserDTO => ({
  id: user._id?.toString() || "",
  email: user.email,
  name: user.name,
  role: user.role,
  image: user.image,
  dateOfBirth: user.dateOfBirth,
  phoneNumber: user.phoneNumber,
  country: user.country,
  gender: user.gender,
  specializations: user.specializations,
  specializationsDisplayData: specializationsData?.map((spec): BriefSpecialization => ({
    key: spec.key,
    name: spec.name
  })),
  specializationDisplay: specializationsData?.map(({ name }) => name).join(', '),
  description: user.description,
  experience: user.experience,
  consultationDuration: user.consultationDuration,
  consultationPrice: user.consultationPrice,
  consultationCurrency: user.consultationCurrency,
});

export const userToUserSummary = (user: IUser): UserSummary => ({
  id: user._id?.toString() || user.id || "",
  name: user.name,
  image: user.image,
  role: user.role,
});

export const messageToMessageDTO = (msg: IMessage, sender: IUser): MessageDTO => ({
  id: msg._id.toString(),
  conversationId: msg.conversationId.toString(),
  senderId: msg.senderId.toString(),
  sender: userToUserSummary(sender),
  content: msg.content,
  type: msg.type,
  status: msg.status,
  attachments: msg.attachments,
  createdAt: msg.createdAt,
  updatedAt: msg.updatedAt,
});

export const conversationToConversationDTO = (
  conversation: PopulatedConversation,
  doctorSpecializations?: ISpecialization[]
): ConversationDTO => ({
  id: conversation._id.toString(),
  participants: {
    patient: userToUserDTO(conversation.participants.patient as unknown as IUser),
    doctor: userToUserDTO(conversation.participants.doctor as unknown as IUser, doctorSpecializations),
  },
  lastMessage: conversation.lastMessage?.id
    ? {
        id: conversation.lastMessage.id.toString(),
        content: conversation.lastMessage.content,
        timestamp: conversation.lastMessage.timestamp,
        sender: userToUserSummary(conversation.lastMessage.sender as unknown as IUser),
      }
    : undefined,
  status: conversation.status,
  consultationId: conversation.consultationId?.toString(),
  unreadCount: conversation.unreadCount,
  createdAt: conversation.createdAt,
  updatedAt: conversation.updatedAt,
});

export const conversationDTOToConversationSummary = (
  conversationDTO: ConversationDTO,
  currentUserId: string
): ConversationSummary => ({
  id: conversationDTO.id,
  participants: {
    patient: userToUserSummary(conversationDTO.participants.patient as unknown as IUser),
    doctor: userToUserSummary(conversationDTO.participants.doctor as unknown as IUser),
  },
  lastMessage: conversationDTO.lastMessage
    ? {
        content: conversationDTO.lastMessage.content,
        timestamp: conversationDTO.lastMessage.timestamp,
        sender: conversationDTO.lastMessage.sender,
      }
    : undefined,
  unreadCount:
    currentUserId === conversationDTO.participants.patient.id
      ? conversationDTO.unreadCount.patient
      : conversationDTO.unreadCount.doctor,
  updatedAt: conversationDTO.updatedAt,
});

export const conversationToConversationSummary = (
  conversation: PopulatedConversation,
  currentUserId: string
): ConversationSummary => {
  const dto = conversationToConversationDTO(conversation);
  return conversationDTOToConversationSummary(dto, currentUserId);
};

export const consultationToConsultationDTO = (consultation: PopulatedConsultation): ConsultationDTO => ({
  id: consultation._id.toString(),
  doctorId: consultation.doctorId._id.toString(),
  patientId: consultation.patientId._id.toString(),
  doctor: userToUserSummary(consultation.doctorId),
  patient: userToUserSummary(consultation.patientId),
  dateTime: consultation.dateTime,
  duration: consultation.duration,
  status: consultation.status,
  type: consultation.type,
  price: consultation.price,
  currency: consultation.currency,
  notes: consultation.notes,
  conversationId: consultation.conversationId?.toString(),
  createdAt: consultation.createdAt,
  updatedAt: consultation.updatedAt,
});

export const consultationToConsultationDTOWithUsers = (
  consultation: IConsultation,
  doctor: IUser,
  patient: IUser,
  showNotes: boolean = false
): ConsultationDTO => ({
  id: consultation._id.toString(),
  doctorId: consultation.doctorId.toString(),
  patientId: consultation.patientId.toString(),
  doctor: userToUserSummary(doctor),
  patient: userToUserSummary(patient),
  dateTime: consultation.dateTime,
  duration: consultation.duration,
  status: consultation.status,
  type: consultation.type,
  price: consultation.price,
  currency: consultation.currency,
  notes: showNotes ? consultation.notes : undefined,
  conversationId: consultation.conversationId?.toString(),
  createdAt: consultation.createdAt,
  updatedAt: consultation.updatedAt,
});

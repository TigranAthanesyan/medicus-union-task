import mongoose from "mongoose";
import { BaseApiResponse, PaginatedResponse, PaginationParams } from "./common";
import { UserDTO, DoctorCardDTO, CreateUserInput } from "./user";
import { SpecializationDTO, CreateSpecializationInput } from "./specialization";
import {
  ConversationDTO,
  MessageDTO,
  CreateConversationInput,
  CreateMessageInput,
  ConversationSummary,
  ConversationStatus,
} from "./chat";

export type DoctorsApiResponse = BaseApiResponse<DoctorCardDTO[]>;

export type DoctorByIdApiResponse = BaseApiResponse<UserDTO>;

export type UserByIdApiResponse = BaseApiResponse<UserDTO>;

export type CreateUserApiResponse = BaseApiResponse<UserDTO>;

export type SpecializationsApiResponse = BaseApiResponse<SpecializationDTO[]>;

export type CreateSpecializationApiResponse = BaseApiResponse<SpecializationDTO>;

export type ConversationsApiResponse = BaseApiResponse<ConversationSummary[]>;

export type ConversationByIdApiResponse = BaseApiResponse<{
  conversation: ConversationDTO;
  messages: PaginatedResponse<MessageDTO>;
}>;

export type CreateConversationApiResponse = BaseApiResponse<ConversationDTO>;

export type SendMessageApiResponse = BaseApiResponse<MessageDTO>;

export type CreateUserRequest = CreateUserInput;

export type UpdateUserRequest = Partial<Omit<CreateUserInput, "email" | "password">>;

export type CreateSpecializationRequest = CreateSpecializationInput;

export type UpdateSpecializationRequest = Partial<CreateSpecializationInput>;

export type CreateConversationRequest = CreateConversationInput;

export type SendMessageRequest = CreateMessageInput;

export interface GetConversationsRequest extends PaginationParams {
  status?: ConversationStatus;
}

export interface GetMessagesRequest extends PaginationParams {
  conversationId: string;
}

export enum FileUploadContext {
  Avatar = "avatar",
  Chat = "chat",
  Document = "document",
}

export interface FileUploadRequest {
  file: File;
  context: FileUploadContext;
}

export interface FileUploadResponse {
  success: boolean;
  data?: {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
    publicId?: string;
  };
  error?: string;
}

export interface ConversationQuery {
  $or: Array<{
    "participants.patient"?: string;
    "participants.doctor"?: string;
  }>;
  status?: ConversationStatus;
}

export interface ConversationUpdateData {
  lastMessage: {
    id: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
    sender: mongoose.Types.ObjectId;
  };
  updatedAt: Date;
  "unreadCount.doctor"?: number;
  "unreadCount.patient"?: number;
}

import { UserDTO, UserSummary } from "./user";

// This is not used yet
export enum MessageStatus {
  Sent = "sent",
  Delivered = "delivered",
  Read = "read",
}

export enum ConversationStatus {
  Active = "active",
  Archived = "archived",
  Blocked = "blocked",
}

export interface BaseConversation {
  participants: {
    patient: string;
    doctor: string;
  };
  status: ConversationStatus;
  consultationId?: string;
}

export interface BaseMessage {
  conversationId: string;
  senderId: string;
  content: string;
}

export type CreateConversationInput = BaseConversation;

export type CreateMessageInput = BaseMessage;

export interface ConversationDTO {
  id: string;
  participants: {
    patient: UserDTO;
    doctor: UserDTO;
  };
  lastMessage?: {
    id: string;
    content: string;
    timestamp: Date;
    sender: UserSummary;
  };
  status: ConversationStatus;
  consultationId?: string;
  unreadCount: {
    patient: number;
    doctor: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageDTO extends BaseMessage {
  id: string;
  sender: UserSummary;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationSummary {
  id: string;
  participants: {
    patient: UserSummary;
    doctor: UserSummary;
  };
  lastMessage?: {
    content: string;
    timestamp: Date;
    sender: UserSummary;
  };
  unreadCount: number;
  updatedAt: Date;
}

import { ConversationDTO, UserDTO, UserSummary, MessageDTO } from '../types';
import { PopulatedConversation } from '../models/Conversation';
import { IUser } from '../models/User';
import { IMessage } from '../models/Message';

export const userToUserDTO = (user: IUser): UserDTO => ({
  id: user._id?.toString() || '',
  email: user.email,
  name: user.name,
  role: user.role,
  image: user.image,
  dateOfBirth: user.dateOfBirth,
  phoneNumber: user.phoneNumber,
  country: user.country,
  gender: user.gender,
  specializations: user.specializations,
  description: user.description,
  experience: user.experience
});

export const userToUserSummary = (user: IUser): UserSummary => ({
  id: user._id?.toString() || '',
  name: user.name,
  image: user.image,
  role: user.role
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
  updatedAt: msg.updatedAt
});

export const conversationToConversationDTO = (conversation: PopulatedConversation): ConversationDTO => ({
  id: conversation._id.toString(),
  participants: {
    patient: userToUserDTO(conversation.participants.patient as unknown as IUser),
    doctor: userToUserDTO(conversation.participants.doctor as unknown as IUser)
  },
  lastMessage: conversation.lastMessage ? {
    id: conversation.lastMessage.id.toString(),
    content: conversation.lastMessage.content,
    timestamp: conversation.lastMessage.timestamp,
    sender: userToUserSummary(conversation.lastMessage.sender as unknown as IUser)
  } : undefined,
  status: conversation.status,
  consultationId: conversation.consultationId?.toString(),
  unreadCount: conversation.unreadCount,
  createdAt: conversation.createdAt,
  updatedAt: conversation.updatedAt
});



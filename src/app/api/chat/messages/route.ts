import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import {
  errorResponse,
  getSessionUserId,
  noAccessResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../../helpers/api";
import { messageToMessageDTO } from "../../../../utils/converters";
import Message, { IMessage } from "../../../../models/Message";
import Conversation, { IConversation } from "../../../../models/Conversation";
import User, { IUser } from "../../../../models/User";
import {
  ConversationUpdateData,
  MessageStatus,
  MessageType,
  SendMessageApiResponse,
  SendMessageRequest,
} from "../../../../types";

export async function POST(request: Request): Promise<NextResponse<SendMessageApiResponse>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    const body: SendMessageRequest = await request.json();
    const {
      conversationId,
      content,
      type = MessageType.Text,
      attachments,
    } = body;

    await connectDB();

    const conversation: IConversation | null = await Conversation.findById(conversationId);
    if (!conversation) {
      return notFoundResponse("Conversation");
    }

    const isParticipant =
      conversation.participants.patient.toString() === userId ||
      conversation.participants.doctor.toString() === userId;

    if (!isParticipant) {
      return noAccessResponse();
    }

    const message: IMessage = new Message({
      conversationId,
      senderId: userId,
      content,
      type,
      status: MessageStatus.Sent,
      attachments,
    });

    await message.save();

    const isPatient = conversation.participants.patient.toString() === userId;

    const updateData: ConversationUpdateData = {
      lastMessage: {
        id: message._id,
        content: message.content,
        timestamp: message.createdAt,
        sender: message.senderId,
      },
      updatedAt: new Date(),
    };

    if (isPatient) {
      updateData["unreadCount.doctor"] = conversation.unreadCount.doctor + 1;
    } else {
      updateData["unreadCount.patient"] = conversation.unreadCount.patient + 1;
    }

    await Conversation.findByIdAndUpdate(conversationId, updateData);

    const createdMessage: IMessage | null = await Message.findById(message._id);

    if (!createdMessage) {
      return errorResponse(500, "Failed to create message");
    }

    const sender: IUser | null = await User.findById(createdMessage.senderId).select("name image role");

    if (!sender) {
      return errorResponse(500, "Sender not found");
    }

    const messageDTO = messageToMessageDTO(createdMessage, sender);

    return NextResponse.json({
      success: true,
      data: messageDTO,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return errorResponse(500, "Failed to send message");
  }
}

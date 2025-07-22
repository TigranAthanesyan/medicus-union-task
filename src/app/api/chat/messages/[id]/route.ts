import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import {
  errorResponse,
  getSessionUserId,
  noAccessResponse,
  notFoundResponse,
  unauthorizedResponse,
  USER_BRIEF_FIELDS_SELECTOR,
} from "../../../../../helpers/api";
import { messageToMessageDTO } from "../../../../../utils/converters";
import Conversation from "../../../../../models/Conversation";
import Message, { IMessage } from "../../../../../models/Message";
import { IUser } from "../../../../../models/User";
import { MessageDTO, MessagesApiResponse } from "../../../../../types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<MessagesApiResponse>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    const { id: conversationId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    await connectDB();

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return notFoundResponse("Conversation");
    }

    const isParticipant =
      conversation.participants.patient.toString() === userId ||
      conversation.participants.doctor.toString() === userId;

    if (!isParticipant) {
      return noAccessResponse();
    }

    const skip = (page - 1) * limit;
    const messages: IMessage[] = await Message.find({ conversationId })
      .populate("senderId", USER_BRIEF_FIELDS_SELECTOR)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments({ conversationId });

    const messagesData: MessageDTO[] = messages.reverse().map((msg) => {
      return messageToMessageDTO(msg, msg.senderId as unknown as IUser);
    });

    return NextResponse.json({
      success: true,
      data: {
        items: messagesData,
        totalCount: totalMessages,
        page,
        limit,
        totalPages: Math.ceil(totalMessages / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return errorResponse(500, "Failed to fetch messages");
  }
}

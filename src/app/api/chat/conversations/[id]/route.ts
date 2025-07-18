import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import {
  errorResponse,
  getSessionUserId,
  noAccessResponse,
  notFoundResponse,
  unauthorizedResponse,
  USER_BRIEF_FIELDS_SELECTOR,
  USER_FULL_FIELDS_SELECTOR,
} from "../../../../../helpers/api";
import { conversationToConversationDTO, messageToMessageDTO } from "../../../../../utils/converters";
import Conversation, { PopulatedConversation } from "../../../../../models/Conversation";
import Message, { IMessage } from "../../../../../models/Message";
import { IUser } from "../../../../../models/User";
import Specialization, { ISpecialization } from "../../../../../models/Specialization";
import { MessageDTO, ConversationByIdApiResponse } from "../../../../../types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ConversationByIdApiResponse>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    await connectDB();

    const conversation: PopulatedConversation | null = await Conversation.findById(id)
      .populate("participants.patient", USER_FULL_FIELDS_SELECTOR)
      .populate("participants.doctor", USER_FULL_FIELDS_SELECTOR);

    if (!conversation) {
      return notFoundResponse("Conversation");
    }

    const isParticipant =
      conversation.participants.patient._id.toString() === userId ||
      conversation.participants.doctor._id.toString() === userId;

    if (!isParticipant) {
      return noAccessResponse();
    }

    const skip = (page - 1) * limit;
    const messages: IMessage[] = await Message.find({ conversationId: id })
      .populate("senderId", USER_BRIEF_FIELDS_SELECTOR)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments({ conversationId: id });

    const doctor = conversation.participants.doctor as IUser;
    let doctorSpecializationsData: ISpecialization[] = [];
    if (doctor.specializations && doctor.specializations.length > 0) {
      doctorSpecializationsData = await Specialization.find({
        key: { $in: doctor.specializations },
      }).select("key name");
    }

    const conversationData = conversationToConversationDTO(conversation, doctorSpecializationsData);

    const messagesData: MessageDTO[] = messages.reverse().map((msg) => {
      return messageToMessageDTO(msg, msg.senderId as unknown as IUser);
    });

    return NextResponse.json({
      success: true,
      data: {
        conversation: conversationData,
        messages: {
          items: messagesData,
          totalCount: totalMessages,
          page,
          limit,
          totalPages: Math.ceil(totalMessages / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return errorResponse(500, "Failed to fetch conversation");
  }
}

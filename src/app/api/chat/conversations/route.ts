import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import {
  errorResponse,
  getSessionUserId,
  unauthorizedResponse,
  USER_BRIEF_FIELDS_SELECTOR,
  USER_FULL_FIELDS_SELECTOR,
} from "../../../../helpers/api";
import { conversationToConversationDTO, conversationToConversationSummary } from "../../../../utils/converters";
import Conversation, { IConversation, PopulatedConversation } from "../../../../models/Conversation";
import User from "../../../../models/User";
import {
  ConversationsApiResponse,
  CreateConversationApiResponse,
  CreateConversationRequest,
  ConversationSummary,
  ConversationStatus,
  ConversationQuery,
  ConversationDTO,
} from "../../../../types";

export async function GET(request: Request): Promise<NextResponse<ConversationsApiResponse>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    await connectDB();

    const query: ConversationQuery = {
      $or: [
        { 'participants.patient': userId },
        { 'participants.doctor': userId }
      ]
    };

    if (status) {
      query.status = status as ConversationStatus;
    }

    const conversations: PopulatedConversation[] = await Conversation.find(query)
      .populate("participants.patient", USER_BRIEF_FIELDS_SELECTOR)
      .populate("participants.doctor", USER_BRIEF_FIELDS_SELECTOR)
      .populate("lastMessage.sender", USER_BRIEF_FIELDS_SELECTOR)
      .sort({ updatedAt: -1 });

    const conversationSummaries: ConversationSummary[] = conversations.map((conv) =>
      conversationToConversationSummary(conv, userId)
    );

    return NextResponse.json({
      success: true,
      data: conversationSummaries,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return errorResponse(500, "Failed to fetch conversations");
  }
}

export async function POST(request: Request): Promise<NextResponse<CreateConversationApiResponse>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    const body: CreateConversationRequest = await request.json();
    const { participants, consultationId } = body;

    await connectDB();

    const patient = await User.findById(participants.patient);
    const doctor = await User.findById(participants.doctor);

    if (!patient || !doctor) {
      return errorResponse(400, "Invalid participants");
    }

    const existingConversation = await Conversation.findOne({
      "participants.patient": participants.patient,
      "participants.doctor": participants.doctor,
    });

    if (existingConversation) {
      const populatedExistingConversation: PopulatedConversation | null = await Conversation.findById(
        existingConversation._id
      )
        .populate("participants.patient", USER_FULL_FIELDS_SELECTOR)
        .populate("participants.doctor", USER_FULL_FIELDS_SELECTOR)
        .populate("lastMessage.sender", USER_FULL_FIELDS_SELECTOR);

      if (!populatedExistingConversation) {
        return errorResponse(500, "Failed to retrieve existing conversation");
      }

      const existingConversationDTO: ConversationDTO = conversationToConversationDTO(populatedExistingConversation);

      const response = {
        success: true,
        data: existingConversationDTO,
        existing: true,
      };

      return NextResponse.json(response);
    }

    const conversation: IConversation = new Conversation({
      participants: {
        patient: participants.patient,
        doctor: participants.doctor,
      },
      consultationId,
      status: ConversationStatus.Active,
    });

    await conversation.save();

    const populatedConversation: PopulatedConversation | null = await Conversation.findById(conversation._id)
      .populate("participants.patient", USER_FULL_FIELDS_SELECTOR)
      .populate("participants.doctor", USER_FULL_FIELDS_SELECTOR);

    if (!populatedConversation) {
      return errorResponse(500, "Failed to create conversation");
    }

    const conversationDTO: ConversationDTO = conversationToConversationDTO(populatedConversation);

    return NextResponse.json({
      success: true,
      data: conversationDTO,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return errorResponse(500, "Failed to create conversation");
  }
}

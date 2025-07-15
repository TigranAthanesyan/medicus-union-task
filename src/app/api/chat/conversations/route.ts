import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import { errorResponse, getSessionUserId, unauthorizedResponse } from '../../../../helpers/api';
import { conversationToConversationDTO } from '../../../../utils/converters';
import Conversation, { IConversation, PopulatedConversation } from '../../../../models/Conversation';
import User, { IUser } from '../../../../models/User';
import { 
  ConversationsApiResponse, 
  CreateConversationApiResponse,
  CreateConversationRequest,
  ConversationSummary,
  ConversationStatus,
  ConversationQuery,
  ConversationDTO,
} from '../../../../types';

export async function GET(request: Request): Promise<NextResponse<ConversationsApiResponse>> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

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

    const conversations: IConversation[] = await Conversation.find(query)
      .populate('participants.patient', 'name image role')
      .populate('participants.doctor', 'name image role')
      .populate('lastMessage.sender', 'name image role')
      .sort({ updatedAt: -1 });

    const conversationSummaries: ConversationSummary[] = conversations.map(conv => {
      const patient = conv.participants.patient as unknown as IUser;
      const doctor = conv.participants.doctor as unknown as IUser;
      const sender = conv.lastMessage?.sender as unknown as IUser;

      return {
        id: conv._id.toString(),
        participants: {
          patient: {
            id: patient._id.toString(),
            name: patient.name,
            image: patient.image,
            role: patient.role
          },
          doctor: {
            id: doctor._id.toString(),
            name: doctor.name,
            image: doctor.image,
            role: doctor.role
          }
        },
        lastMessage: conv.lastMessage ? {
          content: conv.lastMessage.content,
          timestamp: conv.lastMessage.timestamp,
          sender: {
            id: sender._id.toString(),
            name: sender.name,
            image: sender.image,
            role: sender.role
          }
        } : undefined,
        unreadCount: userId === patient._id.toString() 
          ? conv.unreadCount.patient 
          : conv.unreadCount.doctor,
        updatedAt: conv.updatedAt
      };
    });

    return NextResponse.json({
      success: true,
      data: conversationSummaries
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return errorResponse(500, 'Failed to fetch conversations');
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
      return errorResponse(400, 'Invalid participants');
    }

    const existingConversation = await Conversation.findOne({
      'participants.patient': participants.patient,
      'participants.doctor': participants.doctor
    });

    if (existingConversation) {
      return errorResponse(409, 'Conversation already exists');
    }

    const conversation: IConversation = new Conversation({
      participants: {
        patient: participants.patient,
        doctor: participants.doctor
      },
      consultationId,
      status: ConversationStatus.Active
    });

    await conversation.save();

    const populatedConversation: PopulatedConversation | null = await Conversation.findById(conversation._id)
      .populate('participants.patient', 'name image role email dateOfBirth phoneNumber country gender specializations description experience')
      .populate('participants.doctor', 'name image role email dateOfBirth phoneNumber country gender specializations description experience');

    if (!populatedConversation) {
      return errorResponse(500, 'Failed to create conversation');
    }

    const conversationDTO: ConversationDTO = conversationToConversationDTO(populatedConversation);

    return NextResponse.json({
      success: true,
      data: conversationDTO
    });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return errorResponse(500, 'Failed to create conversation');
  }
}

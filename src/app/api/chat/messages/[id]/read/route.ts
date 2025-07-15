import { NextResponse } from 'next/server';
import connectDB from '../../../../../../lib/mongodb';
import { errorResponse, getSessionUserId, notFoundResponse, unauthorizedResponse } from '../../../../../../helpers/api';
import Message, { IMessage } from '../../../../../../models/Message';
import Conversation, { IConversation } from '../../../../../../models/Conversation';
import { MessageStatus } from '../../../../../../types';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    await connectDB();

    const message: IMessage | null = await Message.findById(id);
    if (!message) {
      return notFoundResponse('Message');
    }

    const conversation: IConversation | null = await Conversation.findById(message.conversationId);
    if (!conversation) {
      return notFoundResponse('Conversation');
    }

    const isParticipant = 
      conversation.participants.patient.toString() === userId ||
      conversation.participants.doctor.toString() === userId;

    if (!isParticipant) {
      return noAccessResponse();
    }

    if (message.senderId.toString() === userId) {
      return errorResponse(400, 'Cannot mark own message as read');
    }

    await Message.findByIdAndUpdate(id, { status: MessageStatus.Read });

    const isPatient = conversation.participants.patient.toString() === userId;
    const updateData = isPatient 
      ? { 'unreadCount.patient': 0 }
      : { 'unreadCount.doctor': 0 };

    await Conversation.findByIdAndUpdate(message.conversationId, updateData);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error marking message as read:', error);
    return errorResponse(500, 'Failed to mark message as read');
  }
}

'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useStore } from '../store';
import { conversationDTOToConversationSummary } from '../utils/converters';
import { CreateConversationApiResponse, ConversationSummary } from '../types';

interface UseConversationsReturn {
  conversations: ConversationSummary[];
  loading: boolean;
  creating: boolean; // TODO: unused
  error: string | null; // TODO: unused
  refetch: () => Promise<void>; // TODO: unused
  createConversation: (targetUserId: string, consultationId?: string) => Promise<string | null>;
  clearError: () => void; // TODO: unused
}

export const useConversations = (): UseConversationsReturn => {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const createConversationRef = useRef<Promise<string | null> | null>(null);
  
  const {
    doctorMapById,
    doctors,
    conversations,
    conversationsLoading,
    setConversations,
    setConversationsLoading,
    addConversation,
  } = useStore();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getTargetUser = useCallback(async(targetUserId: string) => {
    const targetDoctor = doctorMapById[targetUserId] || doctors.find(d => d.id === targetUserId);
    if (targetDoctor) return targetDoctor;

    try {
      const response = await fetch(`/api/users/${targetUserId}`);
      if (!response.ok) {
        setError('Failed to fetch target user');
        return null;
      }

      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching target user:', error);
      return null;
    }
  }, [doctorMapById, doctors]);

  const fetchConversations = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setConversationsLoading(true);
      setError(null);
      
      const response = await fetch('/api/chat/conversations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch conversations:', { 
          status: response.status, 
          statusText: response.statusText, 
          errorText 
        });
        throw new Error(`Failed to fetch conversations: ${response.status} ${response.statusText}`);
      }
      
      const { data } = await response.json();
      setConversations(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch conversations';
      console.error('Error fetching conversations:', error);
      setError(errorMessage);
      setConversations([]);
    } finally {
      setConversationsLoading(false);
    }
  }, [session?.user?.id, setConversations, setConversationsLoading]);

  const createConversation = useCallback(async (
    targetUserId: string,
    consultationId?: string
  ): Promise<string | null> => {
    if (!session?.user?.id) {
      setError('User not authenticated');
      return null;
    }

    if (!session?.user?.role) {
      setError('User role not found');
      return null;
    }

    if (session.user.id === targetUserId) {
      setError('Cannot create conversation with yourself');
      return null;
    }

    const targetUser = await getTargetUser(targetUserId);
    if (!targetUser) {
      setError('Target user not found');
      return null;
    }
    
    if (targetUser.role === session.user.role) {
      setError(`You both are ${session.user.role}s`);
      return null;
    }

    if (createConversationRef.current) {
      return createConversationRef.current;
    }

    const existingConversation = conversations.find(conv => 
      conv.participants[session.user.role as keyof typeof conv.participants]?.id === session.user.id && 
      conv.participants[targetUser.role as keyof typeof conv.participants]?.id === targetUserId
    );
    if (existingConversation) {
      return existingConversation.id;
    }

    const createPromise = (async (): Promise<string | null> => {
      try {
        setCreating(true);
        setError(null);

        const requestBody = {
          participants: {
            [session.user.role]: session.user.id,
            [targetUser.role]: targetUserId,
          },
          consultationId,
        };
        
        const response = await fetch('/api/chat/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        const data: CreateConversationApiResponse = await response.json();

        if (!data.success) {
          console.error('Create conversation failed:', data.error);
          throw new Error(`Failed to create conversation: ${data.error}`);
        }

        const conversation = await data.data;
        if (conversation) {
          addConversation(conversationDTOToConversationSummary(conversation, session.user.id));
        }
        return conversation?.id || null;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create conversation';
        console.error('Error creating conversation:', error);
        setError(errorMessage);
        return null;
      } finally {
        setCreating(false);
        createConversationRef.current = null;
      }
    })();

    createConversationRef.current = createPromise;
    return createPromise;
  }, [session?.user, conversations, getTargetUser, addConversation]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchConversations();
    }
  }, [session?.user?.id, fetchConversations]);

  useEffect(() => {
    setError(null);
  }, [session?.user?.id]);

  return {
    conversations,
    loading: conversationsLoading,
    creating,
    error,
    refetch: fetchConversations,
    createConversation,
    clearError,
  };
}; 
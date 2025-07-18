"use client";

import { useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "../store";
import {
  ConversationByIdApiResponse,
  SendMessageApiResponse,
  UserDTO,
  MessageDTO,
  ConversationDTO,
  MessageType,
} from "../types";

interface UseConversationReturn {
  conversation: ConversationDTO | null;
  messages: MessageDTO[];
  participant: UserDTO | null;
  loading: boolean;
  error: string | null; // TODO: unused
  sendMessage: (content: string, type?: MessageType) => Promise<boolean>;
  markAsRead: (messageId: string) => Promise<void>; // TODO: unused
  refetch: () => Promise<void>; // TODO: unused
}

export const useConversationById = (conversationId: string | null): UseConversationReturn => {
  const { data: session } = useSession();

  // const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    activeConversation,
    messages,
    messagesLoading,
    setActiveConversation,
    setMessages,
    setMessagesLoading,
    addMessage,
    updateMessageStatus,
    setNewMessageContent,
    updateConversationUnread,
  } = useStore();

  const participant = useMemo(() => {
    if (!activeConversation) return null;

    return session?.user?.id === activeConversation.participants.patient.id
      ? activeConversation.participants.doctor
      : activeConversation.participants.patient;
  }, [activeConversation, session?.user?.id]);

  const fetchConversationWithMessages = useCallback(async () => {
    if (!conversationId || !session?.user?.id) return;

    try {
      setMessagesLoading(true);

      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch conversation");
      }

      const { data }: ConversationByIdApiResponse = await response.json();
      if (!data) {
        throw new Error("Failed to fetch conversation");
      }

      setActiveConversation(conversationId, data.conversation);
      setMessages(data.messages.items || []);
      updateConversationUnread(conversationId, 0);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, [
    conversationId,
    session?.user?.id,
    setActiveConversation,
    setMessages,
    setMessagesLoading,
    updateConversationUnread,
  ]);

  const sendMessage = useCallback(
    async (content: string, type: MessageType = MessageType.Text): Promise<boolean> => {
      if (!conversationId || !session?.user?.id || !content.trim()) return false;

      try {
        const response = await fetch("/api/chat/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId,
            content: content.trim(),
            type,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const { data }: SendMessageApiResponse = await response.json();

        if (data) {
          addMessage(data);
          setNewMessageContent("");
        }

        return true;
      } catch (error) {
        console.error("Error sending message:", error);
        return false;
      }
    },
    [conversationId, session?.user?.id, addMessage, setNewMessageContent]
  );

  const markAsRead = useCallback(
    async (messageId: string) => {
      try {
        const response = await fetch(`/api/chat/messages/${messageId}/read`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          updateMessageStatus(messageId, "read");
        }
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    },
    [updateMessageStatus]
  );

  // const startPolling = useCallback(() => {
  //   if (pollingIntervalRef.current) {
  //     clearInterval(pollingIntervalRef.current);
  //   }

  //   pollingIntervalRef.current = setInterval(() => {
  //     if (conversationId && session?.user?.id) {
  //       console.log('Polling for new messages');
  //       fetchConversationWithMessages();
  //     }
  //   }, 3000);
  // }, [conversationId, session?.user?.id, fetchConversationWithMessages]);

  // const stopPolling = useCallback(() => {
  //   if (pollingIntervalRef.current) {
  //     clearInterval(pollingIntervalRef.current);
  //     pollingIntervalRef.current = null;
  //   }
  // }, []);

  useEffect(() => {
    if (conversationId && session?.user?.id) {
      fetchConversationWithMessages();
      // startPolling();
    } else {
      setActiveConversation(null);
      setMessages([]);
      // stopPolling();
    }

    return () => {
      // stopPolling();
    };
  }, [conversationId, session?.user?.id, fetchConversationWithMessages, setActiveConversation, setMessages]);

  // useEffect(() => {
  //   return () => {
  //     stopPolling();
  //   };
  // }, [stopPolling]);

  return {
    conversation: activeConversation,
    messages,
    participant,
    loading: messagesLoading,
    error: null, // TODO: Add proper error state management
    sendMessage,
    markAsRead,
    refetch: fetchConversationWithMessages,
  };
};

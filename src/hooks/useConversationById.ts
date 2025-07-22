"use client";

import { useEffect, useCallback, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "../store";
import { ConversationByIdApiResponse, SendMessageApiResponse, DataFetchStatus } from "../types";

export const useConversationById = (conversationId: string | null) => {
  const { data: session } = useSession();

  const {
    activeConversation,
    messages,
    setActiveConversation,
    setMessages,
    addMessage,
    setNewMessageContent,
    updateConversationUnread,
  } = useStore();

  const [status, setStatus] = useState<DataFetchStatus>(DataFetchStatus.Initial);

  const participant = useMemo(() => {
    if (!activeConversation) return null;

    return session?.user?.id === activeConversation.participants.patient.id
      ? activeConversation.participants.doctor
      : activeConversation.participants.patient;
  }, [activeConversation, session?.user?.id]);

  const fetchConversationWithMessages = useCallback(async () => {
    if (!conversationId || !session?.user?.id) return;

    try {
      setStatus(DataFetchStatus.InProgress);

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
      setStatus(DataFetchStatus.Success);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      setMessages([]);
      setStatus(DataFetchStatus.Error);
    }
  }, [
    conversationId,
    session?.user?.id,
    setActiveConversation,
    setMessages,
    updateConversationUnread,
  ]);

  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
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

  useEffect(() => {
    if (conversationId && session?.user?.id) {
      fetchConversationWithMessages();
    } else {
      setActiveConversation(null);
      setMessages([]);
    }
  }, [conversationId, session?.user?.id, fetchConversationWithMessages, setActiveConversation, setMessages]);

  return {
    conversation: activeConversation,
    messages,
    participant,
    status,
    sendMessage,
  };
};

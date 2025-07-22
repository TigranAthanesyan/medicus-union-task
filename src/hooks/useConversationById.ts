"use client";

import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { ConversationByIdApiResponse, SendMessageApiResponse, DataFetchStatus, ConversationDTO, MessageDTO, MessagesApiResponse } from "../types";
import { MESSAGES_POLLING_INTERVAL } from "@/constants/global";

export const useConversationById = (conversationId: string | null, enablePolling: boolean = false) => {
  const { data: session } = useSession();

  const [conversation, setConversation] = useState<ConversationDTO | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [status, setStatus] = useState<DataFetchStatus>(DataFetchStatus.Initial);
  const [newMessageContent, setNewMessageContent] = useState<string>("");
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef<boolean>(false);

  const participant = useMemo(() => {
    if (!conversation) return null;

    return session?.user?.id === conversation.participants.patient.id
      ? conversation.participants.doctor
      : conversation.participants.patient;
  }, [conversation, session?.user?.id]);

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

      setConversation(data.conversation);
      setMessages(data.messages.items || []);
      setStatus(DataFetchStatus.Success);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      setMessages([]);
      setStatus(DataFetchStatus.Error);
    }
  }, [conversationId, session?.user?.id, setConversation, setMessages]);

  const pollForNewMessages = useCallback(async () => {
    if (!conversationId || !session?.user?.id || isPollingRef.current) return;

    try {
      isPollingRef.current = true;

      const response = await fetch(`/api/chat/messages/${conversationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to poll for messages");
      }

      const { data }: MessagesApiResponse = await response.json();
      if (data?.items && data.items.length > messages.length) {
        setMessages(data.items);
      }
    } catch (error) {
      console.error("Error polling for new messages:", error);
    } finally {
      isPollingRef.current = false;
    }
  }, [conversationId, session?.user?.id, messages, setMessages]);

  const sendMessage = useCallback(async (): Promise<boolean> => {
    const content = newMessageContent.trim();
    if (!conversationId || !session?.user?.id || !content) return false;

    try {
      setIsSendingMessage(true);
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const { data }: SendMessageApiResponse = await response.json();

      if (data) {
        setMessages([...messages, data]);
        setNewMessageContent("");
      }

      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    } finally {
      setIsSendingMessage(false);
    }
  }, [conversationId, messages, newMessageContent, session?.user?.id]);

  useEffect(() => {
    if (conversationId && session?.user?.id && !conversation) {
      fetchConversationWithMessages();
    }
  }, [conversationId, session?.user?.id, conversation, fetchConversationWithMessages]);

  useEffect(() => {
    if (enablePolling && conversationId && session?.user?.id && status === DataFetchStatus.Success) {
      pollingIntervalRef.current = setInterval(() => {
        pollForNewMessages();
      }, MESSAGES_POLLING_INTERVAL);
    } else {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [enablePolling, conversationId, session?.user?.id, status, pollForNewMessages]);

  return {
    conversation,
    status,
    messages,
    participant,
    isSendingMessage,
    newMessageContent,
    setNewMessageContent,
    sendMessage,
  };
};

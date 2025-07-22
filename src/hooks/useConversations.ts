"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "../store";
import { conversationDTOToConversationSummary } from "../utils/converters";
import { ConversationsApiResponse, ConversationSummary, CreateConversationApiResponse, DataFetchStatus } from "../types";

export const useConversations = () => {
  const { data: session } = useSession();

  const { doctorMapById, doctors} = useStore();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [status, setStatus] = useState<DataFetchStatus>(DataFetchStatus.Initial);
  const createConversationRef = useRef<Promise<string | null> | null>(null);

  const getTargetUser = useCallback(
    async (targetUserId: string) => {
      const targetDoctor = doctorMapById[targetUserId] || doctors.find((d) => d.id === targetUserId);
      if (targetDoctor) return targetDoctor;

      try {
        const response = await fetch(`/api/users/${targetUserId}`);
        if (!response.ok) {
          return null;
        }

        const { data } = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching target user:", error);
        return null;
      }
    },
    [doctorMapById, doctors]
  );

  const fetchConversations = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setStatus(DataFetchStatus.InProgress);

      const response = await fetch("/api/chat/conversations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch conversations:", {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        throw new Error(`Failed to fetch conversations: ${response.status} ${response.statusText}`);
      }

      const { data }: ConversationsApiResponse = await response.json();
      setConversations(data || []);
      setStatus(DataFetchStatus.Success);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
      setStatus(DataFetchStatus.Error);
    }
  }, [session?.user?.id, setConversations]);

  const createConversation = useCallback(
    async (targetUserId: string, consultationId?: string): Promise<string | null> => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      if (!session?.user?.role) {
        throw new Error("User role not found");
      }

      if (session.user.id === targetUserId) {
        throw new Error("Cannot create conversation with yourself");
      }

      const targetUser = await getTargetUser(targetUserId);
      if (!targetUser) {
        throw new Error("Target user not found");
      }

      if (targetUser.role === session.user.role) {
        throw new Error(`You both are ${session.user.role}s`);
      }

      if (createConversationRef.current) {
        return createConversationRef.current;
      }

      const existingConversation = conversations.find(
        (conv) =>
          conv.participants[session.user.role as keyof typeof conv.participants]?.id === session.user.id &&
          conv.participants[targetUser.role as keyof typeof conv.participants]?.id === targetUserId
      );
      if (existingConversation) {
        return existingConversation.id;
      }

      const createPromise = (async (): Promise<string | null> => {
        try {
          setCreatingConversation(true);

          const requestBody = {
            participants: {
              [session.user.role]: session.user.id,
              [targetUser.role]: targetUserId,
            },
            consultationId,
          };

          const response = await fetch("/api/chat/conversations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });
          const data: CreateConversationApiResponse = await response.json();

          if (!data.success) {
            console.error("Create conversation failed:", data.error);
            throw new Error(`Failed to create conversation: ${data.error}`);
          }

          const conversation = await data.data;
          if (conversation) {
            setConversations([...conversations, conversationDTOToConversationSummary(conversation, session.user.id)]);
          }
          return conversation?.id || null;
        } catch (error) {
          console.error("Error creating conversation:", error);
          return null;
        } finally {
          setCreatingConversation(false);
          createConversationRef.current = null;
        }
      })();

      createConversationRef.current = createPromise;
      return createPromise;
    },
    [session?.user, conversations, getTargetUser, setConversations]
  );

  useEffect(() => {
    if (session?.user?.id) {
      fetchConversations();
    }
  }, [session?.user?.id, fetchConversations]);

  return {
    conversations,
    status,
    creatingConversation,
    createConversation,
  };
};

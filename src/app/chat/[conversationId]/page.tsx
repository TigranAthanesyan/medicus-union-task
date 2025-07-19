"use client";

import React from "react";
import { useParams } from "next/navigation";
import useLoggedIn from "@/hooks/useLoggedIn";
import { MessageInput } from "@/components/Chat/MessageInput";
import { Conversation } from "@/components/Chat/Conversation";
import styles from "./styles.module.css";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;

  useLoggedIn(`/chat/${conversationId}`);

  return (
    <div className={styles.container}>
      <Conversation />
      <MessageInput />
    </div>
  );
}

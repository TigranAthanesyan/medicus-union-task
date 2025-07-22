"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useConversations } from "@/hooks/useConversations";
import Loading from "../../../components/Loading";
import { ConversationItem } from "../ConversationItem";
import styles from "./styles.module.css";

export const ChatList = () => {
  const router = useRouter();

  const { conversations, loading } = useConversations();

  const onConversationSelect = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  const onFindDoctorsClick = () => {
    router.push("/doctors");
  };

  if (loading) {
    return <Loading size="large" message="Loading conversations..." />;
  }

  if (conversations.length === 0) {
    return (
      <div className={styles.centralizedContainer}>
        <div className={styles.emptyIcon}>💬</div>
        <h3 className={styles.emptyTitle}>No conversations yet</h3>
        <p className={styles.emptyDescription}>Start a conversation with a doctor to begin messaging</p>
        <button className={styles.findDoctorsButton} onClick={onFindDoctorsClick}>Find your doctor</button>
      </div>
    );
  }

  return conversations.map((conversation) => (
    <ConversationItem
      key={conversation.id}
      conversation={conversation}
      onClick={() => onConversationSelect(conversation.id)}
    />
  ))
};

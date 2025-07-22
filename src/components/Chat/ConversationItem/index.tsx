"use client";

import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { formatTimestamp, truncateMessage } from "@/utils/formatting";
import { ConversationSummary, UserRole } from "@/types";
import styles from "./styles.module.css";

interface ConversationItemProps {
  conversation: ConversationSummary;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, onClick }) => {
  const { data: session } = useSession();

  const currentUserId = session?.user?.id;
  const otherParticipant =
    currentUserId === conversation.participants.patient.id
      ? conversation.participants.doctor
      : conversation.participants.patient;

  return (
    <button className={styles.conversationItem} onClick={onClick}>
      <div className={styles.avatar}>
        {otherParticipant.image ? (
          <Image
            src={otherParticipant.image}
            alt={otherParticipant.name}
            width={48}
            height={48}
            className={styles.avatarImage}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>{otherParticipant.role === UserRole.Doctor ? "👨‍⚕️" : "👤"}</div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.name}>{otherParticipant.name}</span>
          {conversation.lastMessage && (
            <span className={styles.timestamp}>{formatTimestamp(conversation.lastMessage.timestamp)}</span>
          )}
        </div>

        <div className={styles.lastMessage}>
          {conversation.lastMessage ? (
            <span className={styles.messageText}>
              {conversation.lastMessage.sender.id === currentUserId && <span className={styles.youPrefix}>You: </span>}
              {truncateMessage(conversation.lastMessage.content)}
            </span>
          ) : (
            <span className={styles.noMessages}>No messages yet</span>
          )}

          {/* TODO: Add unread count */}
          {/* {conversation.unreadCount > 0 && (
            <span className={styles.unreadBadge}>
              {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
            </span>
          )} */}
        </div>
      </div>
    </button>
  );
};

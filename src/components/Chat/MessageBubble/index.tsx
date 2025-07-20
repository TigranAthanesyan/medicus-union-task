"use client";

import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { MessageDTO, MessageStatus } from "../../../types/chat";
import styles from "./styles.module.css";

const messageStatusIconMap: Record<MessageStatus, string> = {
  [MessageStatus.Sent]: "✓",
  [MessageStatus.Delivered]: "✓✓",
  [MessageStatus.Read]: "✓✓",
};

interface MessageBubbleProps {
  message: MessageDTO;
  isCurrentUser: boolean;
  firstMessageInARow: boolean;
  nextMessageIsSameMinute?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  firstMessageInARow,
  nextMessageIsSameMinute,
}) => {
  const formatTimestamp = (timestamp: Date) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return messageDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className={clsx(styles.messageWrapper, { [styles.currentUser]: isCurrentUser })}>
      {firstMessageInARow && (
        <div className={styles.avatar}>
          {message.sender.image ? (
            <Image
              src={message.sender.image}
              alt={message.sender.name}
              width={32}
              height={32}
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>{message.sender.role === "doctor" ? "👨‍⚕️" : "👤"}</div>
          )}
        </div>
      )}

      <div className={clsx(styles.messageContainer, { [styles.withoutAvatar]: !firstMessageInARow })}>
        {!isCurrentUser && firstMessageInARow && (
          <div className={styles.senderName}>
            {message.sender.name}
          </div>
        )}

        <div className={clsx(styles.messageBubble, isCurrentUser ? styles.sent : styles.received)}>
          <div className={styles.messageContent}>{message.content}</div>
        </div>

        {!nextMessageIsSameMinute && <div className={clsx(styles.messageInfo, { [styles.sentInfo]: isCurrentUser })}>
          <span className={styles.timestamp}>{formatTimestamp(message.createdAt)}</span>
          {isCurrentUser && (
            <span className={clsx(styles.status, { [styles.read]: message.status === MessageStatus.Read })}>
              {messageStatusIconMap[message.status]}
            </span>
          )}
        </div>}
      </div>
    </div>
  );
};

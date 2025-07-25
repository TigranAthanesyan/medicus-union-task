"use client";

import React, { useRef, useEffect } from "react";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useConversationById } from "@/hooks/useConversationById";
import SendMessageIcon from "@/components/icons/SendMessageIcon";
import styles from "./styles.module.css";

type MessageInputProps = {
  conversationId: string;
}

export const MessageInput = ({ conversationId }: MessageInputProps) => {
  const { data: session } = useSession();

  const { conversation, sendMessage, newMessageContent, setNewMessageContent, isSendingMessage } = useConversationById(conversationId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentUserId = session?.user?.id;

  const otherParticipant = conversation ? (
    currentUserId === conversation.participants.patient.id
      ? conversation.participants.doctor
      : conversation.participants.patient
  ) : null;

  const placeholder = otherParticipant ? `Message ${otherParticipant.name}...` : "Message...";

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessageContent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessageContent(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const canSend = newMessageContent.trim().length > 0 && !isSendingMessage;

  return (
    <div className={styles.inputWrapper}>
      <div className={styles.textareaContainer}>
        <textarea
          ref={textareaRef}
          value={newMessageContent}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isSendingMessage}
          rows={1}
          maxLength={1000}
          className={clsx(styles.textarea, { [styles.disabled]: isSendingMessage })}
        />
      </div>

      <div className={styles.sendButtonWrapper}>
        <button
          className={clsx(styles.sendButton, {
            [styles.canSend]: canSend,
            [styles.sending]: isSendingMessage,
          })}
          onClick={sendMessage}
          disabled={!canSend}
          aria-label="Send message"
        >
          <SendMessageIcon />
        </button>
      </div>
    </div>
  );
};

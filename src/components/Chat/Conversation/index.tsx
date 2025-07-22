import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useConversationById } from "@/hooks/useConversationById";
import { DataFetchStatus, MessageDTO } from "@/types";
import Loading from "../../Loading";
import { MessageBubble } from "../MessageBubble";
import styles from "./styles.module.css";

type ConversationProps = {
  conversationId: string;
}

export const Conversation = ({ conversationId }: ConversationProps) => {
  const { conversation, messages, status } = useConversationById(conversationId, true);

  const { data: session } = useSession();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isCurrentUser = (userId: string) => {
    return userId === session?.user?.id;
  };

  const isFirstMessageInARow = (message: MessageDTO, messageIndex: number) => {
    const previousMessage = messageIndex > 0 ? messages[messageIndex - 1] : null;
    return !previousMessage
      || previousMessage.senderId !== message.senderId
      || new Date(message.createdAt).getTime() - new Date(previousMessage.createdAt).getTime() > 300000;
  }

  const isNextMessageIsSameMinute = (message: MessageDTO, messageIndex: number) => {
    const nextMessage = messageIndex < messages.length - 1 ? messages[messageIndex + 1] : null;
    return !!nextMessage && new Date(nextMessage.createdAt).getTime() - new Date(message.createdAt).getTime() < 60000;
  }

  const renderConversation = () => {
    if (status === DataFetchStatus.Initial || status === DataFetchStatus.InProgress) {
      return <Loading size="large" message="Loading conversation..." />;
    }

    if (!conversation) {
      return (
        <div className={styles.centralizedContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Conversation not found</h3>
          <p className={styles.errorDescription}>
            This conversation may have been deleted or you don&apos;t have access to it.
          </p>
        </div>
      );
    }

    if (!messages || messages.length === 0) {
      return (
        <div className={styles.centralizedContainer}>
          <div className={styles.noMessagesIcon}>👋</div>
          <p className={styles.noMessagesText}>No messages yet. Start the conversation!</p>
        </div>
      );
    }

    return (
      <>
        {messages.map((message, index) => {
          return (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={isCurrentUser(message.sender.id)}
              firstMessageInARow={isFirstMessageInARow(message, index)}
              nextMessageIsSameMinute={isNextMessageIsSameMinute(message, index)}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </>
    );
  };

  return <div className={styles.conversationContainer}>{renderConversation()}</div>;
};

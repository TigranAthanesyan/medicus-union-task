"use client";

import React from "react";
import { ChatList } from "../../components/Chat/ChatList";
import useLoggedIn from "../../hooks/useLoggedIn";
import styles from "./styles.module.css";

export default function ChatPage() {
  useLoggedIn("/chat");

  return (
    <div className={styles.container}>
      <ChatList />
    </div>
  );
}

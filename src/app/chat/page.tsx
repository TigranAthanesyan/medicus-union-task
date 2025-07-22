"use client";

import React from "react";
import { ChatList } from "../../components/Chat/ChatList";
import useLoggedIn from "../../hooks/useLoggedIn";

export default function ChatPage() {
  useLoggedIn("/chat");

  return <ChatList />;
}

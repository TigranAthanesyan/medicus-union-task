'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MainHeaderContent } from '../MainHeaderContent';
import { ChatsHeaderContent } from '../ChatsHeaderContent';
import { ChatHeaderContent } from '../ChatHeaderContent';

type HeaderType = 'main' | 'chats' | 'chat';

const headersMap: Record<HeaderType, React.FC> = {
  main: MainHeaderContent,
  chats: ChatsHeaderContent,
  chat: ChatHeaderContent,
}

const getHeaderType = (pathname: string): HeaderType => {
  if (pathname.startsWith('/chat/')) return 'chat';
  if (pathname === '/chat') return 'chats';
  return 'main';
};

export const HeaderRouter: React.FC = () => {
  const pathname = usePathname();
  const headerType = getHeaderType(pathname);

  const HeaderContent = headersMap[headerType];
  return <HeaderContent />;
};

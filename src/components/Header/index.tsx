"use client";

import React, { useState } from "react";
import { useHeaderData } from "@/hooks/useHeaderData";
import ActionIcon from "../ActionIcon";
import { ChatParticipant } from "../ChatParticipant";
import { RightSidebar } from "../RightSidebar";
import styles from "./styles.module.css";

export const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  
  const { leftAction, mainContent, rightAction, actionItems } = useHeaderData(toggleSidebar);

  const actionItemsWithClose = actionItems.map(item => ({
    ...item,
    onClick: () => {
      item.onClick();
      closeSidebar();
    },
  }));

  return (
    <>
      <div className={styles.header}>
        <div className={styles.actionIconContainer}>
          {leftAction && <ActionIcon {...leftAction} />}
        </div>
        <div className={styles.mainContainer}>
          {mainContent.title && <div className={styles.title}>{mainContent.title}</div>}
          {mainContent.contentType === "participant" && <ChatParticipant />}
        </div>
        <div className={styles.actionIconContainer}>{rightAction && <ActionIcon {...rightAction} />}</div>
      </div>
      <RightSidebar isOpen={isSidebarOpen} onClose={closeSidebar} actionItems={actionItemsWithClose} />
    </>
  );
};

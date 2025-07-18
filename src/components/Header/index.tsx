"use client";

import React from "react";
import { useHeaderData } from "@/hooks/useHeaderData";
import ActionIcon from "../ActionIcon";
import { ChatParticipant } from "../ChatParticipant";
import styles from "./styles.module.css";

export const Header: React.FC = () => {
  const { leftAction, mainContent, rightAction } = useHeaderData();

  return (
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
  );
};

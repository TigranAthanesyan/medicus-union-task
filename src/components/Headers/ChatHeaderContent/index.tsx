'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BackIcon from '../../icons/BackIcon';
import ActionIcon from '../../icons/ActionIcon';
import { ChatParticipant } from '../../ChatParticipant';
import styles from './styles.module.css';

export const ChatHeaderContent: React.FC = () => {
  const router = useRouter();
 
  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBack}>
        <BackIcon />
      </button>
      
      <ChatParticipant />

      <div className={styles.actions}>
        <button className={styles.actionButton}>
          <ActionIcon />
        </button>
      </div>
    </div>
  );
};

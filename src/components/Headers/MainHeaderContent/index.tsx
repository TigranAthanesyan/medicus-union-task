'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import HomeIcon from '../../icons/HomeIcon';
import { APP_NAME } from '../../../constants/global';
import styles from './styles.module.css';

export const MainHeaderContent: React.FC = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.homeButton}
        onClick={handleHomeClick}
        aria-label="Go to home page"
      >
        <HomeIcon />
      </button>
      <h1 className={styles.title}>{APP_NAME}</h1>
      <div style={{ width: '40px' }}></div>
    </div>
  );
}; 
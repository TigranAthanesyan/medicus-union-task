'use client';

import React, { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '../../constants/global';
import styles from './styles.module.css';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button
          className={styles.homeButton}
          onClick={handleHomeClick}
          aria-label="Go to home page"
        >
          <svg 
            className={styles.homeIcon}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
            />
          </svg>
        </button>
        <h1 className={styles.title}>{APP_NAME}</h1>
        <div style={{ width: '40px' }}></div>
      </header>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 
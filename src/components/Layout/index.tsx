'use client';

import React, { PropsWithChildren } from 'react';
import { Header } from '../Header';
import styles from './styles.module.css';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Header />
      </header>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 
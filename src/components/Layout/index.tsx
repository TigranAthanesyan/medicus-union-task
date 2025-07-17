'use client';

import React, { PropsWithChildren } from 'react';
import { HeaderRouter } from '../Headers/HeaderRouter';
import styles from './styles.module.css';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <HeaderRouter />
      </header>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 
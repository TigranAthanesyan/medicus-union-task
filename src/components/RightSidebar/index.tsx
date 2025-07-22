import React, { useEffect, useRef } from 'react';
import { ActionItemData } from '@/types';
import styles from './styles.module.css';

type RightSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  actionItems: ActionItemData[];
};

export const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose, actionItems }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div ref={sidebarRef} className={styles.sidebar}>
        {actionItems.map((item, index) => (
          <div key={index} className={styles.actionItem} onClick={item.onClick}>
            <div className={styles.actionItemIcon}>
              <item.icon />
            </div>
            <div className={styles.actionItemLabel}>
              <span className={styles.actionLabel}>{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

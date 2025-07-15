import React from 'react';
import clsx from 'clsx';
import { UserRole } from '../../types';
import { ROLES } from '../../constants/signup';
import styles from './styles.module.css';

interface RoleSelectorProps {
  value: UserRole;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const roles = [
    {
      value: UserRole.Patient,
      label: ROLES.PATIENT,
      icon: '👤',
      description: 'Book appointments and consult with doctors',
    },
    {
      value: UserRole.Doctor,
      label: ROLES.DOCTOR,
      icon: '👨‍⚕️',
      description: 'Provide medical consultations',
    },
  ];

  return (
    <div className={clsx(styles.roleSection, className)}>
      <label className={styles.roleLabel}>
        I am a:
      </label>
      
      <div className={styles.roleOptions}>
        {roles.map((role) => (
          <label
            key={role.value}
            className={clsx(styles.roleOption, {
              [styles.selected]: value === role.value,
              [styles.disabled]: disabled,
            })}
            title={role.description}
          >
            <input
              type="radio"
              name="role"
              value={role.value}
              checked={value === role.value}
              onChange={onChange}
              disabled={disabled}
              className={styles.roleRadio}
            />
            <span className={styles.roleIcon}>{role.icon}</span>
            <span className={styles.roleText}>{role.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector; 
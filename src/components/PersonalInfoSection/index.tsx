import React from 'react';
import clsx from 'clsx';
import { SignUpFormData, FormInputEvent } from '../../app/auth/signup/types';
import { FORM_LABELS, PLACEHOLDERS, SECTION_TITLES } from '../../constants/signup';
import InputField from '../InputField';
import styles from './styles.module.css';

interface PersonalInfoSectionProps {
  formData: SignUpFormData;
  onChange: (e: FormInputEvent) => void;
  disabled?: boolean;
  className?: string;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={clsx(styles.section, className)}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>ℹ️</span>
        {SECTION_TITLES.PERSONAL_INFORMATION}
      </h3>
      
      <p className={styles.sectionDescription}>
        This information helps us provide better service and is completely optional.
      </p>

      <InputField
        label={FORM_LABELS.DATE_OF_BIRTH}
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={onChange}
        disabled={disabled}
      />

      <InputField
        label={FORM_LABELS.PHONE}
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={onChange}
        placeholder={PLACEHOLDERS.PHONE}
        disabled={disabled}
      />
    </div>
  );
};

export default PersonalInfoSection; 
import React from 'react';
import clsx from 'clsx';
import { SignUpFormData, FormInputEvent } from '../../app/auth/signup/types';
import { FORM_LABELS, PLACEHOLDERS, SECTION_TITLES } from '../../constants/signup';
import InputField from '../InputField';
import styles from './styles.module.css';

interface DoctorInfoSectionProps {
  formData: SignUpFormData;
  onChange: (e: FormInputEvent) => void;
  disabled?: boolean;
  className?: string;
}

export const DoctorInfoSection: React.FC<DoctorInfoSectionProps> = ({
  formData,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={clsx(styles.section, className)}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>👨‍⚕️</span>
        {SECTION_TITLES.DOCTOR_INFORMATION}
      </h3>
      
      <p className={styles.sectionDescription}>
        Please provide your professional information to help patients find and connect with you.
      </p>

      <InputField
        label={FORM_LABELS.SPECIALIZATION}
        type="text"
        name="specialization"
        value={formData.specialization}
        onChange={onChange}
        placeholder={PLACEHOLDERS.SPECIALIZATION}
        required
        disabled={disabled}
      />

      <InputField
        label={FORM_LABELS.DESCRIPTION}
        type="textarea"
        name="description"
        value={formData.description}
        onChange={onChange}
        placeholder={PLACEHOLDERS.DESCRIPTION}
        required
        disabled={disabled}
        rows={4}
      />

      <InputField
        label={FORM_LABELS.EXPERIENCE}
        type="number"
        name="experience"
        value={formData.experience}
        onChange={onChange}
        placeholder={PLACEHOLDERS.EXPERIENCE}
        min={0}
        max={50}
        disabled={disabled}
      />
    </div>
  );
};

export default DoctorInfoSection; 
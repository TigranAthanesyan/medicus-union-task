import React from 'react';
import clsx from 'clsx';
import InputField from '../InputField';
import { SignUpFormData, FormInputEvent } from '../../app/auth/signup/types';
import { FORM_LABELS, PLACEHOLDERS, SECTION_TITLES } from '../../constants/signup';
import { COUNTRIES } from '../../constants/countries';
import { GENDER_OPTIONS } from '../../constants/gender';
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

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>
          {FORM_LABELS.COUNTRY}
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={onChange}
          disabled={disabled}
          className={styles.select}
        >
          <option value="">{PLACEHOLDERS.COUNTRY}</option>
          {COUNTRIES.map(country => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>
          {FORM_LABELS.GENDER}
        </label>
        <div className={styles.radioGroup}>
          {GENDER_OPTIONS.map(option => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                type="radio"
                name="gender"
                value={option.value}
                checked={formData.gender === option.value}
                onChange={onChange}
                disabled={disabled}
                className={styles.radioInput}
              />
              <span className={styles.radioText}>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection; 
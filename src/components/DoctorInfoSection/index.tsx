import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import InputField from '../InputField';
import { SignUpFormData, FormInputEvent } from '../../app/auth/signup/types';
import { SpecializationDTO } from '../../types';
import { FORM_LABELS, PLACEHOLDERS, SECTION_TITLES } from '../../constants/signup';
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
  const [specializations, setSpecializations] = useState<SpecializationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const handleSpecializationsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    onChange({
      target: {
        name: 'specializations',
        value: selectedValues
      }
    });
  };

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/specializations');
        const data = await response.json();
        
        if (data.success) {
          setSpecializations(data.data);
        } else {
          setError(data.error || 'Failed to fetch specializations');
        }
      } catch (err) {
        setError('Failed to fetch specializations');
        console.error('Error fetching specializations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecializations();
  }, []);

  return (
    <div className={clsx(styles.section, className)}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>👨‍⚕️</span>
        {SECTION_TITLES.DOCTOR_INFORMATION}
      </h3>
      
      <p className={styles.sectionDescription}>
        Please provide your professional information to help patients find and connect with you.
      </p>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>
          {FORM_LABELS.SPECIALIZATION} <span className={styles.required}>*</span>
        </label>
        {loading ? (
          <div className={styles.loadingText}>Loading specializations...</div>
        ) : error ? (
          <div className={styles.errorText}>{error}</div>
        ) : (
          <>
            <select
              name="specializations"
              value={formData.specializations}
              onChange={handleSpecializationsChange}
              disabled={disabled}
              className={styles.multiSelect}
              multiple
              required
            >
              {specializations.map(spec => (
                <option key={spec.key} value={spec.key}>
                  {spec.name}
                </option>
              ))}
            </select>
            <p className={styles.helperText}>
              Hold Ctrl/Cmd to select multiple specializations
            </p>
          </>
        )}
      </div>

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
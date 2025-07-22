import React from "react";
import clsx from "clsx";
import InputField from "../InputField";
import { SignUpFormData, FormInputEvent, FieldErrors } from "../../types";
import { FORM_LABELS, PLACEHOLDERS, SECTION_TITLES } from "../../constants/signup";
import { COUNTRIES } from "../../constants/countries";
import { GENDER_OPTIONS } from "../../constants/gender";
import styles from "./styles.module.css";

interface PersonalInfoSectionProps {
  formData: SignUpFormData;
  onChange: (e: FormInputEvent) => void;
  disabled?: boolean;
  className?: string;
  fieldErrors?: FieldErrors;
  phoneNumberRef?: React.RefObject<HTMLDivElement | null>;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  onChange,
  disabled = false,
  className = "",
  fieldErrors = {},
  phoneNumberRef,
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
        ref={phoneNumberRef}
        label={FORM_LABELS.PHONE}
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={onChange}
        placeholder={PLACEHOLDERS.PHONE}
        disabled={disabled}
        error={fieldErrors.phoneNumber}
      />

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>{FORM_LABELS.COUNTRY}</label>
        <select
          name="country"
          value={formData.country}
          onChange={onChange}
          disabled={disabled}
          className={styles.select}
        >
          <option value="">{PLACEHOLDERS.COUNTRY}</option>
          {COUNTRIES.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>{FORM_LABELS.GENDER}</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={onChange}
          disabled={disabled}
          className={styles.select}
        >
          <option value="">Select gender (optional)</option>
          {GENDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PersonalInfoSection;

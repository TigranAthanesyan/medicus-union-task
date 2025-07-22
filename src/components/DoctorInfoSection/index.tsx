import React, { forwardRef } from "react";
import clsx from "clsx";
import useSpecializationsData from "@/hooks/useSpecializationsData";
import InputField from "../InputField";
import { SignUpFormData, FormInputEvent, DataFetchStatus, FieldErrors } from "../../types";
import { FORM_LABELS, PLACEHOLDERS, SECTION_TITLES, CURRENCIES } from "../../constants/signup";
import styles from "./styles.module.css";

interface DoctorInfoSectionProps {
  formData: SignUpFormData;
  onChange: (e: FormInputEvent) => void;
  disabled?: boolean;
  className?: string;
  fieldErrors?: FieldErrors;
}

export const DoctorInfoSection = forwardRef<HTMLDivElement, DoctorInfoSectionProps>(({
  formData,
  onChange,
  disabled = false,
  className = "",
  fieldErrors = {},
}, ref) => {
  const { specializations, status } = useSpecializationsData();

  const handleSpecializationsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    onChange({
      target: {
        name: "specializations",
        value: selectedValues,
      },
    });
  };

  return (
    <div ref={ref} className={clsx(styles.section, className)}>
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
        {status === DataFetchStatus.InProgress ? (
          <div className={styles.loadingText}>Loading specializations...</div>
        ) : status === DataFetchStatus.Error ? (
          <div className={styles.errorText}>Failed to fetch specializations</div>
        ) : (
          <>
            <select
              name="specializations"
              value={formData.specializations}
              onChange={handleSpecializationsChange}
              disabled={disabled}
              className={clsx(styles.multiSelect, { [styles.error]: fieldErrors.specializations })}
              multiple
              required
            >
              {specializations.map((spec) => (
                <option key={spec.key} value={spec.key}>
                  {spec.name}
                </option>
              ))}
            </select>
            <p className={styles.helperText}>Hold Ctrl/Cmd to select multiple specializations</p>
            {fieldErrors.specializations && (
              <div className={styles.fieldError}>{fieldErrors.specializations}</div>
            )}
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
        error={fieldErrors.description}
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
        error={fieldErrors.experience}
      />

      <div className={styles.consultationPricing}>
        <InputField
          label={FORM_LABELS.CONSULTATION_PRICE}
          type="number"
          name="consultationPrice"
          value={formData.consultationPrice}
          onChange={onChange}
          placeholder={PLACEHOLDERS.CONSULTATION_PRICE}
          min={0}
          max={10000}
          required
          disabled={disabled}
          error={fieldErrors.consultationPrice}
        />

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            {FORM_LABELS.CONSULTATION_CURRENCY} <span className={styles.required}>*</span>
          </label>
          <select
            name="consultationCurrency"
            value={formData.consultationCurrency}
            onChange={onChange}
            disabled={disabled}
            className={clsx(styles.select, { [styles.error]: fieldErrors.consultationCurrency })}
            required
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
          {fieldErrors.consultationCurrency && (
            <div className={styles.fieldError}>{fieldErrors.consultationCurrency}</div>
          )}
        </div>
      </div>
    </div>
  );
});

DoctorInfoSection.displayName = "DoctorInfoSection";

export default DoctorInfoSection;

import React, { forwardRef } from "react";
import clsx from "clsx";
import InputLabel from "../InputLabel";
import styles from "./styles.module.css";

interface InputFieldProps {
  label: string;
  type: "text" | "textarea" | "email" | "password" | "number" | "date" | "tel" | "file";
  name: string;
  value: string | number;
  placeholder?: string;
  min?: number;
  max?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  error?: string;
}

const InputField = forwardRef<HTMLDivElement, InputFieldProps>(
  ({
    label,
    type,
    name,
    value,
    placeholder,
    min,
    max,
    onChange,
    required,
    disabled,
    rows,
    error,
  }, ref) => {
    const hasError = Boolean(error);

    return (
      <div ref={ref} className={styles.fieldContainer}>
        <InputLabel required={required}>{label}</InputLabel>
        {type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            className={clsx(styles.textarea, { [styles.error]: hasError })}
            rows={rows}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={clsx(styles.input, { [styles.error]: hasError })}
            min={min}
            max={max}
          />
        )}
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;

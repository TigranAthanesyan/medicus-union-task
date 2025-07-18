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
}

export default function InputField({
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
}: InputFieldProps) {
  return (
    <div className={styles.fieldContainer}>
      <InputLabel required={required}>{label}</InputLabel>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          className={styles.textarea}
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
          className={styles.input}
          min={min}
          max={max}
        />
      )}
    </div>
  );
}

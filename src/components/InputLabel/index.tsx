import { PropsWithChildren } from "react";
import styles from "./styles.module.css";

interface InputLabelProps {
  required?: boolean;
}

export default function InputLabel({ children, required }: PropsWithChildren<InputLabelProps>) {
  return (
    <label className={styles.label}>
      {children}
      {required && <span className={styles.required}>*</span>}
    </label>
  );
}

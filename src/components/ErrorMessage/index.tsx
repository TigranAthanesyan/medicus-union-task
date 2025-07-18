import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss, className = "" }) => {
  if (!message) return null;

  return (
    <div className={clsx(styles.errorMessage, className)} role="alert">
      <span className={styles.message}>{message}</span>
      {onDismiss && (
        <button
          type="button"
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label="Dismiss error message"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

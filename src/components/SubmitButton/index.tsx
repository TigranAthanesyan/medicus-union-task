import React from "react";
import clsx from "clsx";
import LoadingSpinner from "../LoadingSpinner";
import styles from "./styles.module.css";

interface SubmitButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading = false,
  disabled = false,
  children,
  loadingText = "Loading...",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        {
          [styles.fullWidth]: fullWidth,
        },
        className
      )}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      <span className={clsx(styles.content, { [styles.hidden]: loading })}>{children}</span>

      {loading && (
        <div className={styles.loadingOverlay}>
          <LoadingSpinner size="small" color="currentColor" />
          <span className={styles.loadingText}>{loadingText}</span>
        </div>
      )}
    </button>
  );
};

export default SubmitButton;

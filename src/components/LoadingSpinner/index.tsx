import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "white" | "currentColor";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "primary",
  className = "",
}) => {
  return (
    <div className={clsx(styles.spinner, styles[size], className)}>
      <div className={clsx(styles.spinnerIcon, styles[color])} />
    </div>
  );
};

export default LoadingSpinner;

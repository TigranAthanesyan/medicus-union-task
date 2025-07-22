import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

export interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "white" | "currentColor";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "primary",
}) => {
  return (
    <div className={clsx(styles.spinner, styles[size])}>
      <div className={clsx(styles.spinnerIcon, styles[color])} />
    </div>
  );
};

export default LoadingSpinner;

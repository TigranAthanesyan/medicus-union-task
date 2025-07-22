
import  { LoadingSpinner, LoadingSpinnerProps } from "../LoadingSpinner";
import styles from "./styles.module.css";

interface LoadingProps extends LoadingSpinnerProps {
  message?: string;
}

export default function Loading({ message = "Loading...", ...props }: LoadingProps) {
  return (
    <div className={styles.loadingContainer}>
      <LoadingSpinner {...props} />
      <p>{message}</p>
    </div>
  );
}

import { ActionIconData } from "@/types";
import styles from "./styles.module.css";

export default function ActionIcon({ icon, onClick, isDisabled }: ActionIconData) {
  const Icon = icon;
  return (
    <button className={styles.actionButton} onClick={onClick} disabled={isDisabled}>
      <Icon />
    </button>
  );
}

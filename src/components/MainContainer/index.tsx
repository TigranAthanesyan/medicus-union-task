import { PropsWithChildren } from "react";
import styles from "./styles.module.css";

export default function MainContainer({ children }: PropsWithChildren) {
  return <div className={styles.container}>{children}</div>;
}

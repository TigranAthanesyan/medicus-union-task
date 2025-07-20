import { PropsWithChildren } from "react";
import styles from "./styles.module.css";

export default function SectionWrapper({ children }: PropsWithChildren) {
  return <div className={styles.sectionWrapper}>{children}</div>;
}

import Image from "next/image";
import { getCountryFlagUrl, getCountryName } from "@/utils/countries";
import { getCurrencySymbol } from "@/utils/formatting";
import { UserDTO } from "@/types";
import SectionWrapper from "@/components/SectionWrapper";
import styles from "./styles.module.css";

interface DoctorSummaryProps {
  doctor: UserDTO;
}

export const DoctorSummary: React.FC<DoctorSummaryProps> = ({ doctor }) => {
  return (
    <SectionWrapper>
      <div className={styles.doctorInfo}>
        <div className={styles.doctorAvatar}>
          {doctor.image ? (
            <Image
              src={doctor.image}
              alt={doctor.name}
              width={80}
              height={80}
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>👨‍⚕️</div>
          )}
        </div>

        <div className={styles.doctorDetails}>
          <h1 className={styles.doctorName}>Dr. {doctor.name}</h1>
          {doctor.specializationsDisplayData && doctor.specializationsDisplayData.length > 0 && (
            <p className={styles.specializations}>
              {doctor.specializationsDisplayData.map(spec => spec.name).join(", ")}
            </p>
          )}
          {doctor.country && (
            <p className={styles.location}>
              <Image
                width={16}
                height={12}
                src={getCountryFlagUrl(doctor.country)}
                alt={doctor.country}
                className={styles.countryFlag}
              />
              {getCountryName(doctor.country)}
            </p>
          )}
        </div>
      </div>

        <div className={styles.consultationInfo}>
          {doctor.consultationDuration && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Duration:</span>
              <span className={styles.infoValue}>{doctor.consultationDuration} minutes</span>
            </div>
          )}

          {doctor.consultationPrice && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Price:</span>
              <span className={styles.infoValue}>
                {getCurrencySymbol(doctor.consultationCurrency || 'USD')} {doctor.consultationPrice}
              </span>
            </div>
          )}
        </div>
      </SectionWrapper>
  );
};
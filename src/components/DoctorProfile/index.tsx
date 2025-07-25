
import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import MainContainer from "../MainContainer";
import Loading from "../Loading";
import useDoctorDataById from "../../hooks/useDoctorDataById";
import { useConversations } from "../../hooks/useConversations";
import { getCountryName, getCountryFlagUrl } from "../../utils/countries";
import { getCurrencySymbol } from "../../utils/formatting";
import { DataFetchStatus, UserRole } from "../../types";
import styles from "./styles.module.css";

type DoctorProfileProps = {
  doctorId: string;
}

export default function DoctorProfile({ doctorId }: DoctorProfileProps) {
  const router = useRouter();
  
  const { data: session } = useSession();
  
  const { doctor, status } = useDoctorDataById(doctorId);

  const { createConversation, creatingConversation } = useConversations();

  const handleBookNow = () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/doctors/${doctorId}/book`);
      return;
    }
    router.push(`/doctors/${doctorId}/book`);
  };

  const handleStartChat = async () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/doctors/${doctorId}`);
      return;
    }

    if (session.user.role !== UserRole.Patient) {
      console.warn("Only patients can start chats with doctors via this interface");
      return;
    }

    if (creatingConversation) return;

    try {
      const conversationId = await createConversation(doctorId);
      if (conversationId) {
        router.push(`/chat/${conversationId}`);
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  const handleSpecializationClick = (specializationKey: string) => {
    router.push(`/specializations/${specializationKey}`);
  };

  const renderContent = (): React.ReactNode => {
    if (status === DataFetchStatus.Initial || status === DataFetchStatus.InProgress) {
      return <Loading message="Loading doctor profile..." />;
    }

    if (status === DataFetchStatus.Error || !doctor) {
      return (
        <div className={styles.errorContainer}>
          <h2>Doctor Not Found</h2>
          <p>The doctor you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/doctors" className={styles.backButton}>
            Browse All Doctors
          </Link>
        </div>
      );
    }

    return (
      <div className={styles.profileContainer}>
        <div className={styles.doctorHeader}>
          <div className={styles.doctorAvatar}>
            {doctor.image ? (
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={120}
                height={120}
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>👨‍⚕️</div>
            )}
          </div>

          <div className={styles.doctorBasicInfo}>
            <h1 className={styles.doctorName}>{doctor.name}</h1>

            {doctor.specializationsDisplayData && doctor.specializationsDisplayData.length > 0 && (
              <div className={styles.specializationsContainer}>
                {doctor.specializationsDisplayData.map(({ key, name }) => (
                  <button
                    key={key}
                    className={styles.specialization}
                    onClick={() => handleSpecializationClick(key)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}

            {doctor.country && (
              <p className={styles.country}>
                <Image
                  width={24}
                  height={18}
                  src={getCountryFlagUrl(doctor.country)}
                  alt={`${doctor.country} flag`}
                  className={styles.countryFlag}
                />
                {getCountryName(doctor.country)}
              </p>
            )}

            {(doctor.consultationPrice || doctor.consultationDuration) && (
              <div className={styles.consultationInfo}>
                {doctor.consultationDuration && (
                  <span className={styles.consultationDetail}>
                    <b>⏱️ {doctor.consultationDuration} min</b>
                  </span>
                )}
                {doctor.consultationPrice && (
                  <span className={styles.consultationDetail}>
                    <b> 💰 {getCurrencySymbol(doctor.consultationCurrency || 'USD')} {doctor.consultationPrice}</b>
                  </span>
                )}
              </div>
            )}

            <div className={styles.headerActions}>
              <button className={styles.bookButton} onClick={handleBookNow}>
                Book Consultation
              </button>
              {session?.user?.role === UserRole.Patient && (
                <button className={styles.chatButton} onClick={handleStartChat} disabled={creatingConversation}>
                  {creatingConversation ? "Starting Chat..." : "Start Chat"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.profileContent}>
          {doctor.description && (
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>About</h3>
              <p className={styles.description}>{doctor.description}</p>
            </div>
          )}

          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Professional Information</h3>
            <div className={styles.infoGrid}>
              {doctor.experience && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Experience:</span>
                  <span className={styles.infoValue}>{doctor.experience} years</span>
                </div>
              )}
              {doctor.specializations && doctor.specializations.length > 0 && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Specializations:</span>
                  <span className={styles.infoValue}>
                    {doctor.specializationsDisplayData?.map(({ name }) => name).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{doctor.email}</span>
              </div>
              {doctor.phoneNumber && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Phone:</span>
                  <span className={styles.infoValue}>{doctor.phoneNumber}</span>
                </div>
              )}
              {doctor.country && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Location:</span>
                  <span className={styles.infoValue}>{getCountryName(doctor.country)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainContainer>
      {renderContent()}
    </MainContainer>
  );
}

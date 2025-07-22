import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import useConsultationData from "@/hooks/useConsultationData";
import { useConversations } from "@/hooks/useConversations";
import { getCurrencySymbol, getDateTimeLongTexts } from "@/utils/formatting";
import { DataFetchStatus, ConsultationStatus, UserRole, ConsultationType } from "@/types";
import { STATUS_COLOR_MAP, STATUS_ICON_MAP, TYPE_ICON_MAP } from "@/constants/consultation";
import Loading from "../Loading";
import MainContainer from "../MainContainer";
import SectionWrapper from "../SectionWrapper";
import styles from "./styles.module.css";

type ConsultationProps = {
  consultationId: string;
  isJustBooked?: boolean;
}

export default function Consultation({ consultationId, isJustBooked }: ConsultationProps) {
  const router = useRouter();
  
  const { data: session } = useSession();

  const { consultation, status, updateStatus, updateConsultation, saveNotesEnabled, setNotes, notes } = useConsultationData(consultationId);

  const { createConversation, creatingConversation } = useConversations();

  const canApproveOrDecline = (): boolean => {
    return !!(
      session?.user.role === UserRole.Doctor && 
      consultation?.doctor.id === session.user.id &&
      consultation?.status === ConsultationStatus.Pending
    );
  };

  const canCancel = (): boolean => {
    return !!(
      session?.user.role === UserRole.Patient && 
      consultation?.patient.id === session.user.id &&
      consultation?.status === ConsultationStatus.Pending
    );
  };

  const canStartConsultation = (): boolean => {
    if (!consultation || consultation.status !== ConsultationStatus.Confirmed) {
      return false;
    }
    
    const consultationTime = new Date(consultation.dateTime);
    const now = new Date();
    const timeDiff = consultationTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Can start 10 minutes before scheduled time
    return minutesDiff <= 10 && minutesDiff >= -30;
  };

  const handleStartChat = async () => {
    if (creatingConversation || !consultation) return;

    try {
      const conversationId = await createConversation(
        session?.user.role === UserRole.Doctor ? consultation.patient.id : consultation.doctor.id,
        consultation.id
      );
      if (conversationId) {
        router.push(`/chat/${conversationId}`);
      }
    } catch (error: unknown) {
      console.error("Failed to start chat:", error instanceof Error ? error.message : error);
    }
  };

  const handleSaveNotes = async () => {
    if (!saveNotesEnabled || !consultation) return;

    try {
      await updateConsultation({ notes });
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  };

  const renderParticipant = (role: UserRole, name: string, avatarUrl?: string, ) => {
    return (
      <div className={styles.participantCard}>
        <div className={styles.participantAvatar}>
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={60}
              height={60}
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>{role === UserRole.Doctor ? "👨‍⚕️" : "👤"}</div>
          )}
        </div>
        <div className={styles.participantInfo}>
          <h3 className={styles.participantName}>{name}</h3>
          <p className={styles.participantRole}>{role}</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (status === DataFetchStatus.Initial || status === DataFetchStatus.InProgress || !session) {
      return <Loading message="Loading consultation details..." />;
    }

    if (status === DataFetchStatus.Error || !consultation) {
      return (
        <div className={styles.errorContainer}>
          <h2>Consultation Not Found</h2>
          <p>The consultation you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
          <Link href="/chat" className={styles.backButton}>
            Back to Consultations
          </Link>
        </div>
      );
    }

    const { date, time } = getDateTimeLongTexts(consultation.dateTime as unknown as string);
    const isDoctor = session.user.role === UserRole.Doctor;
    const isPatient = session.user.role === UserRole.Patient;

    return (
      <>
        {isJustBooked && (
          <div className={styles.successBanner}>
            <div className={styles.successIcon}>🎉</div>
            <div className={styles.successContent}>
              <h2>Consultation Booked Successfully!</h2>
              <p>Your consultation has been booked and is pending doctor approval.</p>
            </div>
          </div>
        )}

        <div className={styles.consultationHeader}>
          <div className={styles.statusBadge} style={{ backgroundColor: STATUS_COLOR_MAP[consultation.status] }}>
            {STATUS_ICON_MAP[consultation.status]} {consultation.status}
          </div>
          <h1 className={styles.consultationTitle}>Consultation Details</h1>
        </div>

        <SectionWrapper>
          <h2 className={styles.sectionTitle}>Participants</h2>
          
          <div className={styles.participantsList}>
            {renderParticipant(UserRole.Doctor, consultation.doctor.name, consultation.doctor.image)}
            {renderParticipant(UserRole.Patient, consultation.patient.name, consultation.patient.image)}
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <h2 className={styles.sectionTitle}>Consultation Information</h2>
          
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>📅 Date</span>
              <span className={styles.detailValue}>{date}</span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>🕐 Time</span>
              <span className={styles.detailValue}>{time}</span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>⏱️ Duration</span>
              <span className={styles.detailValue}>{consultation.duration || 30} minutes</span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>{TYPE_ICON_MAP[consultation.type]} Type</span>
              <span className={styles.detailValue}>{consultation.type}</span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>💰 Price</span>
              <span className={styles.detailValue}>
                {getCurrencySymbol(consultation.currency || 'USD')} {consultation.price || 0}
              </span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>📝 Status</span>
              <span className={styles.detailValue} style={{ color: STATUS_COLOR_MAP[consultation.status] }}>
                {STATUS_ICON_MAP[consultation.status]} {consultation.status}
              </span>
            </div>
          </div>
        </SectionWrapper>

        
        {(isDoctor) && (
          <SectionWrapper>
            <h2 className={styles.sectionTitle}>Doctor Notes</h2>

            <textarea
              className={styles.notesTextarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this consultation..."
              rows={4}
            />

            <button
              className={styles.saveNotesButton}
              onClick={handleSaveNotes}
              disabled={!saveNotesEnabled || !notes}
            >
              {updateStatus === DataFetchStatus.InProgress ? "💾 Saving..." : "💾 Save"}
            </button>
          </SectionWrapper>
        )}
        
        {updateStatus == DataFetchStatus.Error && (
          <div className={styles.errorMessage}>Failed to update consultation. Please try again.</div>
        )}

        <SectionWrapper>
          {canApproveOrDecline() && (
            <> 
              <button
                className={styles.approveButton}
                onClick={() => updateConsultation({ status: ConsultationStatus.Confirmed })}
                disabled={updateStatus === DataFetchStatus.InProgress}
              >
                {updateStatus === DataFetchStatus.InProgress ? "Updating..." : "✅ Approve Consultation"}
              </button>

              <button
                className={styles.declineButton}
                onClick={() => updateConsultation({ status: ConsultationStatus.Declined })}
                disabled={updateStatus === DataFetchStatus.InProgress}
              >
                {updateStatus === DataFetchStatus.InProgress ? "Updating..." : "❌ Decline Consultation"}
              </button>
            </>
          )}

          {canCancel() && (
            <button
              className={styles.cancelButton}
              onClick={() => updateConsultation({ status: ConsultationStatus.Cancelled })}
              disabled={updateStatus === DataFetchStatus.InProgress}
            >
              {updateStatus === DataFetchStatus.InProgress ? "Cancelling..." : "🚫 Cancel Consultation"}
            </button>
          )}

          {canStartConsultation() && (
            <div className={styles.startConsultation}>
              <h3 className={styles.actionsTitle}>Ready to Start?</h3>
              <button
                className={styles.startButton}
                onClick={() => updateConsultation({ status: ConsultationStatus.Completed })}
                disabled={updateStatus === DataFetchStatus.InProgress}
              >
                🚀 Start Consultation
              </button>
            </div>
          )}

          {consultation.status === ConsultationStatus.Confirmed && !canStartConsultation() && (
            <div className={styles.waitingMessage}>
              <p>✨ Consultation confirmed! You can start the session 10 minutes before the scheduled time.</p>
            </div>
          )}
            
          {isPatient && (
            <Link href={`/doctors/${consultation.doctor.id}`} className={styles.viewDoctorButton}>
              👨‍⚕️ View Doctor Profile
            </Link>
          )}

          <button className={styles.chatButton} onClick={handleStartChat} disabled={creatingConversation}>
            {TYPE_ICON_MAP[ConsultationType.Chat] }{creatingConversation ? " Starting Chat..." : " Start Chat"}
          </button>
        </SectionWrapper>
      </>
    )
  }

  return (
    <MainContainer>
      {renderContent()}
    </MainContainer>
  );
}
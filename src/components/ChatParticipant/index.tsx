import React from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useConversationById } from '../../hooks/useConversationById';
import { UserRole } from '../../types';
import styles from './styles.module.css';

export const ChatParticipant: React.FC = () => {
  const params = useParams();
  const conversationId = params.conversationId as string;

  const { data: session } = useSession();
  const participantIsDoctor = !session?.user || session?.user?.role === UserRole.Patient;

  const { participant } = useConversationById(conversationId);

  return (
    <div className={styles.participantInfo}>
      {participant ? (
        <>
          <div className={styles.avatar}>
            {participant.image ? (
              <Image
                src={participant.image}
                alt={participant.name}
                width={40}
                height={40}
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {participant.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className={styles.participantDetails}>
            <h1 className={styles.participantName}>{participant.name}</h1>
            {participantIsDoctor && <p className={styles.participantSpecialization}>{participant.specializationDisplay}</p>}
          </div>
        </>
      ) : (
        <div className={styles.loadingInfo}>
          <div className={styles.avatarSkeleton}></div>
          <div className={styles.textSkeleton}>
            <div className={styles.nameSkeleton}></div>
            {participantIsDoctor && <div className={styles.specializationSkeleton}></div>}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';
import { UserDTO } from '../../types/api';

interface DoctorCardProps {
  doctor: UserDTO;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleBookAppointment = () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/doctors');
      return;
    }
    // TODO: Implement booking functionality
    console.log('Book appointment with Dr.', doctor.name);
  };

  const handleChatNow = () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/doctors');
      return;
    }
    // TODO: Implement chat functionality
    console.log('Start chat with Dr.', doctor.name);
  };

  return (
    <div className={styles.doctorCard}>
      <div className={styles.doctorAvatar}>
        {doctor.image ? (
          <Image
            src={doctor.image}
            alt={`Dr. ${doctor.name}'s avatar`}
            width={80}
            height={80}
            className={styles.avatarImage}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            👨‍⚕️
          </div>
        )}
      </div>
      
      <div className={styles.doctorInfo}>
        <h3 className={styles.doctorName}>Dr. {doctor.name}</h3>
        
        {doctor.specialization && (
          <p className={styles.specialization}>{doctor.specialization}</p>
        )}
        
        {doctor.experience && (
          <p className={styles.experience}>{doctor.experience} years of experience</p>
        )}
        
        {doctor.description && (
          <p className={styles.description}>{doctor.description}</p>
        )}
        
        <div className={styles.cardActions}>
          <button className={styles.bookButton} onClick={handleBookAppointment}>
            Book Appointment
          </button>
          <button className={styles.chatButton} onClick={handleChatNow}>
            Chat Now
          </button>
        </div>
      </div>
    </div>
  );
}; 
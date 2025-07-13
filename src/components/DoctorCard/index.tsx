import React from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getCountryName, getCountryFlagUrl } from '../../utils/countries';
import { createSlug } from '../../utils/validation';
import { UserDTO } from '../../types/api';
import styles from './styles.module.css';

interface DoctorCardProps {
  doctor: UserDTO;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGoToProfile = () => {
    // TODO: Go to profile
    console.log('Go To profile of Dr.', doctor.name);
  };

  const handleBookNow = () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/doctors');
      return;
    }
    // TODO: Implement booking functionality
    console.log('Book Dr.', doctor.name);
  };

  const handleSpecializationClick = () => {
    if (doctor.specialization) {
      const slug = createSlug(doctor.specialization);
      router.push(`/specializations/${slug}`);
    }
  };

  return (
    <div className={styles.doctorCard}>
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
          <div className={styles.avatarPlaceholder}>
            👨‍⚕️
          </div>
        )}
      </div>
      
      <div className={styles.doctorInfo}>
        <h3 className={styles.doctorName}>{doctor.name}</h3>
        
        {doctor.specialization && (
          <button 
            className={styles.specialization}
            onClick={handleSpecializationClick}
          >
            {doctor.specialization}
          </button>
        )}
        
        {doctor.country && (
          <p className={styles.country}>
            <Image
              width={20}
              height={15}
              src={getCountryFlagUrl(doctor.country)}
              alt={`${doctor.country} flag`}
              className={styles.countryFlag}
            />
            {getCountryName(doctor.country)}
          </p>
        )}
        
        <div className={styles.cardActions}>
          <button className={styles.secondaryButton} onClick={handleGoToProfile}>
            Go to profile
          </button>
          <button className={styles.primaryButton} onClick={handleBookNow}>
            Book now
          </button>
        </div>
      </div>
    </div>
  );
}; 
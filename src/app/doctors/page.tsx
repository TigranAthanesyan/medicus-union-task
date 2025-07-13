'use client';

import React from 'react';
import { DoctorCard } from '../../components/DoctorCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import styles from './styles.module.css';
import useDoctorsData from '../../hooks/useDoctorsData';
import { DataFetchStatus } from '../../types/global';

export default function DoctorsPage() {
  const { doctors, status } = useDoctorsData();

  const renderContent = () => {
    switch (status) {
      case DataFetchStatus.Initial:
      case DataFetchStatus.InProgress:
        return (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
            <p>Loading doctors...</p>
          </div>
        );
      case DataFetchStatus.Error:
        return (
          <div className={styles.errorContainer}>
            <h2>Error Loading Doctors</h2>
            <button 
              onClick={() => window.location.reload()}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        )
      case DataFetchStatus.Success:
        return doctors.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No Doctors Available</h2>
            <p>There are currently no doctors registered in the system.</p>
          </div>
        ) : (
          <div className={styles.doctorsGrid}>
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )
      default:
        return null;
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Find Your Doctor</h1>
        <p className={styles.subtitle}>
          Connect with qualified healthcare professionals
        </p>
      </header>
      {renderContent()}
    </div>
  );
}
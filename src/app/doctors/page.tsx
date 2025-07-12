'use client';

import React, { useState, useEffect } from 'react';
import { DoctorCard } from '../../components/DoctorCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import styles from './styles.module.css';
import { DoctorsApiResponse, UserDTO } from '../../types/api';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors');
        const data: DoctorsApiResponse = await response.json();
        
        if (data.success && data.data) {
          setDoctors(data.data);
        } else {
          setError(data.error || 'Failed to fetch doctors');
        }
      } catch (err) {
        setError('Network error occurred');
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Find Your Doctor</h1>
        <p className={styles.subtitle}>
          Connect with qualified healthcare professionals
        </p>
      </header>

      {loading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Loading doctors...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <h2>Error Loading Doctors</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      ) : doctors.length === 0 ? (
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
      )}
    </div>
  );
} 
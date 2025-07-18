"use client";

import React, { useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DoctorCard } from "../../../components/DoctorCard";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import useDoctorsData from "../../../hooks/useDoctorsData";
import useSpecializationsData from "../../../hooks/useSpecializationsData";
import { DataFetchStatus } from "../../../types";
import styles from "./styles.module.css";

export default function SpecializationPage() {
  const params = useParams();
  const key = params.key as string;

  const { doctors, status: doctorsStatus } = useDoctorsData();
  const { specializations, status: specializationsStatus } = useSpecializationsData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const specialization = useMemo(() => {
    if (specializationsStatus !== DataFetchStatus.Success) return null;

    return specializations.find((spec) => spec.key === key);
  }, [key, specializations, specializationsStatus]);

  const filteredDoctors = useMemo(() => {
    if (!specialization) return [];

    return doctors.filter((doctor) => doctor.specializations && doctor.specializations.includes(specialization.key));
  }, [doctors, specialization]);

  const renderContent = () => {
    if (doctorsStatus === DataFetchStatus.InProgress || specializationsStatus === DataFetchStatus.InProgress) {
      return (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Loading specialization details...</p>
        </div>
      );
    }

    if (
      doctorsStatus === DataFetchStatus.Error ||
      specializationsStatus === DataFetchStatus.Error
    ) {
      return (
        <div className={styles.errorContainer}>
          <h2>Error Loading Data</h2>
          <p>Unable to load specialization details. Please try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      )
    }

    if (!specialization) {
      return (
        <div className={styles.notFoundContainer}>
          <h2>Specialization Not Found</h2>
          <p>The specialization you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/doctors" className={styles.backLink}>
            Browse All Doctors
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className={styles.specializationHeader}>
          <h1 className={styles.specializationTitle}>{specialization.name}</h1>
          <p className={styles.specializationDescription}>{specialization.description}</p>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No Doctors Found</h2>
            <p>{`No doctors are currently available for ${specialization.name}.`}</p>
          </div>
        ) : (
          <div className={styles.doctorsGrid}>
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/doctors" className={styles.breadcrumbLink}>
          ← Back to All Doctors
        </Link>
      </div>

      {renderContent()}
    </div>
  );
}

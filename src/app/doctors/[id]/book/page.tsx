"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import MainContainer from "@/components/MainContainer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { DoctorSummary } from "@/components/DoctorSummary";
import { BookingForm } from "@/components/BookingForm";
import useLoggedIn from "@/hooks/useLoggedIn";
import useDoctorDataById from "@/hooks/useDoctorDataById";
import { DataFetchStatus } from "@/types";
import styles from "./styles.module.css";

export default function BookConsultationPage() {
  const { data: session } = useSession();

  const params = useParams();
  const doctorId = params.id as string;

  useLoggedIn(`/doctors/${doctorId}/book`);
  
  const { doctor, status } = useDoctorDataById(doctorId);

  if (status === DataFetchStatus.InProgress || status === DataFetchStatus.Initial || !session) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading...</p>
      </div>
    );
  }

  if (status === DataFetchStatus.Error || !doctor) {
    return (
      <div className={styles.errorContainer}>
        <h2>Doctor Not Found</h2>
        <p>The doctor you&apos;re trying to book with doesn&apos;t exist.</p>
        <Link href="/doctors" className={styles.backButton}>Browse All Doctors</Link>
      </div>
    );
  }

  return (
    <MainContainer>
      <DoctorSummary doctor={doctor} />
      <BookingForm doctor={doctor} />
    </MainContainer>
  );
}

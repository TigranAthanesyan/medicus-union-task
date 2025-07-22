import useDoctorDataById from "@/hooks/useDoctorDataById";
import { DataFetchStatus } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import MainContainer from "../MainContainer";
import { DoctorSummary } from "../DoctorSummary";
import { BookingForm } from "../BookingForm";
import Loading from "../Loading";
import styles from "./styles.module.css";

type BookConsultationProps = {
  doctorId: string;
}

export default function BookConsultation({ doctorId }: BookConsultationProps) {
  const { data: session } = useSession();
  
  const { doctor, status } = useDoctorDataById(doctorId);

  const renderContent = () => {
    if (status === DataFetchStatus.InProgress || status === DataFetchStatus.Initial || !session) {
      return <Loading />;
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
      <>
        <DoctorSummary doctor={doctor} />
        <BookingForm doctor={doctor} />
      </>
    );
  }

  return (
    <MainContainer>
      {renderContent()}
    </MainContainer>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import MainContainer from "../MainContainer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import useConsultationsData from "@/hooks/useConsultationsData";
import { getCurrencySymbol, getDateTimeShortTexts } from "@/utils/formatting";
import { ConsultationDTO, ConsultationStatus, DataFetchStatus, UserRole } from "@/types";
import { STATUS_COLOR_MAP, STATUS_ICON_MAP, TYPE_ICON_MAP } from "@/constants/consultation";
import styles from "./styles.module.css";

type StatusFilter = 'all' | ConsultationStatus;

export default function Consultations() {
  const router = useRouter();
  const { data: session } = useSession();

  const { consultations, status, fetchConsultations } = useConsultationsData();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filterConsultations = (): ConsultationDTO[] => {
    let filtered = consultations;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(consultation => consultation.status === statusFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.dateTime).getTime();
        const dateB = new Date(b.dateTime).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const statusOrder = [
          ConsultationStatus.Pending,
          ConsultationStatus.Confirmed,
          ConsultationStatus.Completed,
          ConsultationStatus.Declined,
          ConsultationStatus.Cancelled
        ];
        const indexA = statusOrder.indexOf(a.status);
        const indexB = statusOrder.indexOf(b.status);
        return sortOrder === 'asc' ? indexA - indexB : indexB - indexA;
      }
    });

    return filtered;
  };

  const getStatusCounts = () => {
    const counts = {
      all: consultations.length,
      [ConsultationStatus.Pending]: 0,
      [ConsultationStatus.Confirmed]: 0,
      [ConsultationStatus.Declined]: 0,
      [ConsultationStatus.Completed]: 0,
      [ConsultationStatus.Cancelled]: 0,
    };

    consultations.forEach(consultation => {
      counts[consultation.status]++;
    });

    return counts;
  };

  const handleViewConsultationDetails = (consultationId: string) => {
    router.push(`/consultations/${consultationId}`);
  };

  const filteredConsultations = filterConsultations();
  const statusCounts = getStatusCounts();
  const isDoctor = session?.user.role === UserRole.Doctor;
  const isPatient = session?.user.role === UserRole.Patient;

  const renderContent = () => {
    if (status === DataFetchStatus.Initial || status === DataFetchStatus.InProgress || !session) {
      return (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Loading consultations...</p>
        </div>
      );
    }

    if (status === DataFetchStatus.Error) {
      return (
        <div className={styles.errorContainer}>
          <h2>Failed to Load Consultations</h2>
          <button onClick={fetchConsultations} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      );
    }

    return (
      <>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>
              {isDoctor ? "My Consultations" : "Your Consultations"}
            </h1>
            <p className={styles.pageSubtitle}>
              {isDoctor 
                ? "Manage and review your patient consultations" 
                : "View and manage your upcoming and past consultations"
              }
            </p>
          </div>

          {isPatient && (
            <div className={styles.headerActions}>
              <Link href="/doctors" className={styles.bookNewButton}>
                📅 Book New Consultation
              </Link>
            </div>
          )}
        </div>

        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{statusCounts.all}</div>
              <div className={styles.statLabel}>Total</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber} style={{ color: STATUS_COLOR_MAP[ConsultationStatus.Pending] }}>
                {statusCounts[ConsultationStatus.Pending]}
              </div>
              <div className={styles.statLabel}>Pending</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber} style={{ color: STATUS_COLOR_MAP[ConsultationStatus.Confirmed] }}>
                {statusCounts[ConsultationStatus.Confirmed]}
              </div>
              <div className={styles.statLabel}>Confirmed</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber} style={{ color: STATUS_COLOR_MAP[ConsultationStatus.Completed] }}>
                {statusCounts[ConsultationStatus.Completed]}
              </div>
              <div className={styles.statLabel}>Completed</div>
            </div>
          </div>
        </div>

        <div className={styles.filtersSection}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status:</label>
            <select 
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="all">All Statuses ({statusCounts.all})</option>
              <option value={ConsultationStatus.Pending}>
                Pending ({statusCounts[ConsultationStatus.Pending]})
              </option>
              <option value={ConsultationStatus.Confirmed}>
                Confirmed ({statusCounts[ConsultationStatus.Confirmed]})
              </option>
              <option value={ConsultationStatus.Completed}>
                Completed ({statusCounts[ConsultationStatus.Completed]})
              </option>
              <option value={ConsultationStatus.Declined}>
                Declined ({statusCounts[ConsultationStatus.Declined]})
              </option>
              <option value={ConsultationStatus.Cancelled}>
                Cancelled ({statusCounts[ConsultationStatus.Cancelled]})
              </option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort by:</label>
            <select 
              className={styles.filterSelect}
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy as 'date' | 'status');
                setSortOrder(newSortOrder as 'asc' | 'desc');
              }}
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="status-asc">Status (Priority)</option>
            </select>
          </div>
        </div>

        {filteredConsultations.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>
            <h3 className={styles.emptyTitle}>
              {statusFilter === 'all' 
                ? "No consultations yet" 
                : `No ${statusFilter} consultations`
              }
            </h3>
            <p className={styles.emptyMessage}>
              {isPatient && statusFilter === 'all' && (
                <>Start by browsing doctors and booking your first consultation.</>
              )}
              {isDoctor && statusFilter === 'all' && (
                <>Consultations will appear here when patients book with you.</>
              )}
              {statusFilter !== 'all' && (
                <>Try selecting a different status filter.</>
              )}
            </p>
            {isPatient && statusFilter === 'all' && (
              <Link href="/doctors" className={styles.emptyAction}>
                Browse Doctors
              </Link>
            )}
          </div>
        ) : filteredConsultations.map(consultation => {
            const { date, time } = getDateTimeShortTexts(consultation.dateTime as unknown as string);
            const otherParticipant = isDoctor ? consultation.patient : consultation.doctor;

            return (
              <div key={consultation.id} className={styles.consultationCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.statusBadge} style={{ backgroundColor: STATUS_COLOR_MAP[consultation.status] }}>
                    {STATUS_ICON_MAP[consultation.status]} {consultation.status}
                  </div>
                  <div className={styles.consultationType}>
                    {TYPE_ICON_MAP[consultation.type]} {consultation.type}
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.participantInfo}>
                    <div className={styles.participantAvatar}>
                      {otherParticipant.image ? (
                        <Image
                          src={otherParticipant.image}
                          alt={otherParticipant.name}
                          width={50}
                          height={50}
                          className={styles.avatarImage}
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {isDoctor ? "👤" : "👨‍⚕️"}
                        </div>
                      )}
                    </div>
                    <div className={styles.participantDetails}>
                      <h3 className={styles.participantName}>{otherParticipant.name}</h3>
                    </div>
                  </div>

                  <div className={styles.consultationDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>📅</span>
                      <span className={styles.detailValue}>{date}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>🕐</span>
                      <span className={styles.detailValue}>{time}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>⏱️</span>
                      <span className={styles.detailValue}>{consultation.duration || 30}min</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>💰</span>
                      <span className={styles.detailValue}>
                        {getCurrencySymbol(consultation.currency || 'USD')} {consultation.price || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.viewButton} onClick={() => handleViewConsultationDetails(consultation.id)}>
                    👁️ View Details
                  </button>
                </div>
              </div>
            );
          }
        )}
      </>
    )
  }

  return (
    <MainContainer>
     {renderContent()}
    </MainContainer>
  );
}

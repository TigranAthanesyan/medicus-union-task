"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import MainContainer from "../MainContainer";
import Loading from "../Loading";
import { UserRole } from "../../types";
import styles from "./styles.module.css";
import SectionWrapper from "../SectionWrapper";
import { getSpecializationDisplayName } from "@/utils/formatting";

export default function Profile() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const renderContent = () => {
    if (status === "loading") {
      return <Loading message="Loading profile..." />;
    }
  
    if (!user) {
      return (
        <div className={styles.errorContainer}>
          <h2>Profile Not Found</h2>
          <p>Unable to load profile information.</p>
        </div>
      );
    }

    return (
      <>
        <SectionWrapper>
          <div className={styles.userAvatar}>
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={120}
                height={120}
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {user.role === UserRole.Doctor ? "👨‍⚕️" : "👤"}
              </div>
            )}
          </div>

          <div className={styles.userBasicInfo}>
            <h1 className={styles.userName}>{user.name}</h1>
            
            {user.role === UserRole.Doctor && (
              <div>
                <span className={styles.specializationTag}>
                  {user.specializations?.map((specialization) => getSpecializationDisplayName(specialization)).join(", ")}
                </span>
              </div>
            )}
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <h3 className={styles.sectionTitle}>Personal Information</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Name:</span>
              <span className={styles.infoValue}>{user.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>
            {user.phoneNumber && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phone:</span>
                <span className={styles.infoValue}>{user.phoneNumber}</span>
              </div>
            )}
            {user.dateOfBirth && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Date of Birth:</span>
                <span className={styles.infoValue}>
                  {new Date(user.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </SectionWrapper>

          {user.role === UserRole.Doctor && (
            <SectionWrapper>
              <h3 className={styles.sectionTitle}>Professional Information</h3>
              <div className={styles.infoGrid}>
                {user.experience && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Experience:</span>
                    <span className={styles.infoValue}>{user.experience} years</span>
                  </div>
                )}
                {user.specializations && user.specializations.length > 0 && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Specializations:</span>
                    <span className={styles.infoValue}>
                      {user.specializations.map((specialization) => getSpecializationDisplayName(specialization)).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </SectionWrapper>
          )}

          {user.description && (
            <SectionWrapper>
              <h3 className={styles.sectionTitle}>
                {user.role === UserRole.Doctor ? "About" : "About Me"}
              </h3>
              <p className={styles.description}>{user.description}</p>
            </SectionWrapper>
          )}
      </>
    );
  }

  return (
    <MainContainer>
      {renderContent()}
    </MainContainer>
  );
}

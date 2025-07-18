"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { UserRole, UserDTO } from "../types";
import styles from "./styles.module.css";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (session?.user) {
    const user = session.user as UserDTO;

    return (
      <div className={styles.userContainer}>
        <div className={styles.userCard}>
          <h1 className={styles.welcomeTitle}>Welcome back, {user.name}! 👋</h1>

          <div className={styles.userProfile}>
            <div className={styles.avatarContainer}>
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.name}'s avatar`}
                  width={80}
                  height={80}
                  className={styles.avatarImage}
                  onError={() => {
                    console.error("Failed to load avatar image:", user.image);
                  }}
                  onLoad={() => {
                    console.log("Avatar loaded successfully:", user.image);
                  }}
                />
              ) : null}
              <span className={styles.avatarPlaceholder} style={{ display: user.image ? "none" : "flex" }}>
                {user.role === UserRole.Doctor ? "👨‍⚕️" : "👤"}
              </span>
            </div>

            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{user.name}</h2>
              <p className={styles.userDetail}>
                <strong>Email:</strong> {user.email}
              </p>
              <p className={styles.userDetail}>
                <strong>Role:</strong> {user.role === UserRole.Doctor ? "👨‍⚕️ Doctor" : "👤 Patient"}
              </p>
              <p className={styles.userDetailLast}></p>
            </div>
          </div>

          {user.role === UserRole.Doctor && (
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Doctor Information</h3>
              {user.specializations && user.specializations.length > 0 && (
                <p className={styles.sectionDetail}>
                  <strong>Specialization:</strong> {user.specializations.join(", ")}
                </p>
              )}
              {user.description && (
                <p className={styles.sectionDetail}>
                  <strong>Description:</strong> {user.description}
                </p>
              )}
              {user.experience && (
                <p className={styles.sectionDetailLast}>
                  <strong>Experience:</strong> {user.experience} years
                </p>
              )}
            </div>
          )}

          {(user.dateOfBirth || user.phoneNumber) && (
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Personal Information</h3>
              {user.dateOfBirth && (
                <p className={styles.sectionDetail}>
                  <strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}
                </p>
              )}
              {user.phoneNumber && (
                <p className={styles.sectionDetailLast}>
                  <strong>Phone:</strong> {user.phoneNumber}
                </p>
              )}
            </div>
          )}

          <div className={styles.actionButtons}>
            <Link href="/doctors" className={styles.primaryButton}>
              View Doctors
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/" })} className={styles.dangerButton}>
              Sign Out
            </button>
          </div>
        </div>

        <div className={styles.testInfo}>
          <p>Authentication is working correctly! ✅</p>
          <p>This is a test display of your user session data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.welcomeContainer}>
      <h1 className={styles.welcomeMainTitle}>Welcome to Medicus Union</h1>
      <p className={styles.welcomeSubtitle}>
        Telemedicine platform for booking consultations and chatting with doctors
      </p>

      <div className={styles.authButtons}>
        <Link href="/doctors" className={`${styles.authButton} ${styles.authButtonPrimary}`}>
          View Doctors
        </Link>
        <Link href="/auth/signin" className={`${styles.authButton} ${styles.authButtonSecondary}`}>
          Sign In
        </Link>
        <Link href="/auth/signup" className={`${styles.authButton} ${styles.authButtonSecondary}`}>
          Sign Up
        </Link>
      </div>

      <div className={styles.welcomeFooter}>
        <p className={styles.welcomeFooterText}>
          👋 Sign up or sign in to see your user details and test the authentication system!
        </p>
      </div>
    </div>
  );
}

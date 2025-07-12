'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { theme } from '../lib/theme';
import { UserResponse, UserRole } from '../types/global';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div style={{ 
        padding: theme.spacing.xl,
        textAlign: 'center',
        color: theme.colors.text 
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (session?.user) {
    const user = session.user as UserResponse;
  
    return (
      <div style={{ 
        padding: theme.spacing.xl,
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: theme.colors.light,
          padding: theme.spacing.xl,
          borderRadius: theme.borderRadius.lg,
          marginBottom: theme.spacing.lg,
        }}>
          <h1 style={{
            color: theme.colors.text,
            marginBottom: theme.spacing.lg,
            fontSize: theme.typography.fontSize.title,
          }}>
            Welcome back, {user.name}! 👋
          </h1>
          
          <div style={{
            display: 'grid',
            gap: theme.spacing.md,
            gridTemplateColumns: 'auto 1fr',
            alignItems: 'center',
            marginBottom: theme.spacing.lg,
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: theme.colors.secondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: `2px solid ${theme.colors.border}`,
            }}>
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.name}'s avatar`}
                  width={80}
                  height={80}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                  onError={() => {
                    console.error('Failed to load avatar image:', user.image);
                  }}
                  onLoad={() => {
                    console.log('Avatar loaded successfully:', user.image);
                  }}
                />
              ) : null}
              <span style={{
                fontSize: theme.typography.fontSize.xxl,
                color: theme.colors.white,
                display: user.image ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}>
                {user.role === UserRole.Doctor ? '👨‍⚕️' : '👤'}
              </span>
            </div>

            <div>
              <h2 style={{
                margin: '0 0 ' + theme.spacing.sm + ' 0',
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.lg,
              }}>
                {user.name}
              </h2>
              <p style={{
                margin: '0 0 ' + theme.spacing.xs + ' 0',
                color: theme.colors.textLight,
                fontSize: theme.typography.fontSize.md,
              }}>
                <strong>Email:</strong> {user.email}
              </p>
              <p style={{
                margin: '0 0 ' + theme.spacing.xs + ' 0',
                color: theme.colors.textLight,
                fontSize: theme.typography.fontSize.md,
              }}>
                <strong>Role:</strong> {user.role === UserRole.Doctor ? '👨‍⚕️ Doctor' : '👤 Patient'}
              </p>
              <p style={{
                margin: '0',
                color: theme.colors.textLight,
                fontSize: theme.typography.fontSize.md,
              }}>
              </p>
            </div>
          </div>

          {user.role === UserRole.Doctor && (
            <div style={{
              backgroundColor: theme.colors.white,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.sm,
              marginBottom: theme.spacing.md,
            }}>
              <h3 style={{
                margin: '0 0 ' + theme.spacing.sm + ' 0',
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.lg,
              }}>
                Doctor Information
              </h3>
              {user.specialization && (
                <p style={{ margin: '0 0 ' + theme.spacing.xs + ' 0' }}>
                  <strong>Specialization:</strong> {user.specialization}
                </p>
              )}
              {user.description && (
                <p style={{ margin: '0 0 ' + theme.spacing.xs + ' 0' }}>
                  <strong>Description:</strong> {user.description}
                </p>
              )}
              {user.experience && (
                <p style={{ margin: '0' }}>
                  <strong>Experience:</strong> {user.experience} years
                </p>
              )}
            </div>
          )}

          {(user.dateOfBirth || user.phoneNumber) && (
            <div style={{
              backgroundColor: theme.colors.white,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.sm,
              marginBottom: theme.spacing.md,
            }}>
              <h3 style={{
                margin: '0 0 ' + theme.spacing.sm + ' 0',
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.lg,
              }}>
                Personal Information
              </h3>
              {user.dateOfBirth && (
                <p style={{ margin: '0 0 ' + theme.spacing.xs + ' 0' }}>
                  <strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}
                </p>
              )}
              {user.phoneNumber && (
                <p style={{ margin: '0' }}>
                  <strong>Phone:</strong> {user.phoneNumber}
                </p>
              )}
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              backgroundColor: theme.colors.danger,
              color: theme.colors.white,
              border: 'none',
              borderRadius: theme.borderRadius.sm,
              fontSize: theme.typography.fontSize.md,
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          color: theme.colors.textLight,
          fontSize: theme.typography.fontSize.sm,
        }}>
          <p>Authentication is working correctly! ✅</p>
          <p>This is a test display of your user session data.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: theme.spacing.xl,
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
        fontSize: theme.typography.fontSize.title,
      }}>
        Welcome to Medicus Union
      </h1>
      <p style={{
        color: theme.colors.textLight,
        marginBottom: theme.spacing.xl,
        fontSize: theme.typography.fontSize.lg,
        lineHeight: theme.typography.lineHeight.normal,
      }}>
        Telemedicine platform for booking consultations and chatting with doctors
      </p>

      <div style={{
        display: 'flex',
        gap: theme.spacing.md,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        <a
          href="/auth/signin"
          style={{
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            backgroundColor: theme.colors.primary,
            color: theme.colors.white,
            textDecoration: 'none',
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.medium,
          }}
        >
          Sign In
        </a>
        <a
          href="/auth/signup"
          style={{
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            backgroundColor: theme.colors.secondary,
            color: theme.colors.white,
            textDecoration: 'none',
            borderRadius: theme.borderRadius.sm,
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.medium,
          }}
        >
          Sign Up
        </a>
      </div>

      <div style={{
        marginTop: theme.spacing.xxl,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.light,
        borderRadius: theme.borderRadius.lg,
      }}>
        <p style={{
          color: theme.colors.textLight,
          fontSize: theme.typography.fontSize.sm,
          margin: 0,
        }}>
          👋 Sign up or sign in to see your user details and test the authentication system!
        </p>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { UserRole } from '../../../types/global';
import { useSignUpForm } from '../../../hooks/useSignUpForm';
import { FORM_LABELS, PLACEHOLDERS, SECTION_TITLES, BUTTON_LABELS } from '../../../constants/signup';
import styles from './styles.module.css';
import ErrorMessage from '../../../components/ErrorMessage';
import InputField from '../../../components/InputField';
import RoleSelector from '../../../components/RoleSelector';
import AvatarUpload from '../../../components/AvatarUpload';
import SubmitButton from '../../../components/SubmitButton';
import DoctorInfoSection from '../../../components/DoctorInfoSection';
import PersonalInfoSection from '../../../components/PersonalInfoSection';

export default function SignUp(): React.ReactElement {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  
  const {
    formData,
    loading,
    error,
    uploadedImageUrl,
    handleChange,
    handleSubmit,
    handleAvatarUpload,
    clearError,
  } = useSignUpForm();

  const handleAvatarChange = (file: File | null) => {
    setAvatar(file);
    
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview('');
    }
  };

     const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     let finalAvatarUrl: string | undefined = uploadedImageUrl || undefined;
     
     if (avatar && !uploadedImageUrl) {
       const uploadResult = await handleAvatarUpload(avatar);
       if (uploadResult) {
         finalAvatarUrl = uploadResult;
       } else if (avatar) {
         console.warn('Avatar upload failed, continuing without avatar');
       }
     }
     
     await handleSubmit(e, finalAvatarUrl);
   };

  const isFormDisabled = loading.form || loading.avatar;

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>
          {SECTION_TITLES.SIGN_UP}
        </h1>

        <ErrorMessage 
          message={error} 
          onDismiss={clearError}
        />

        <form onSubmit={handleFormSubmit}>
          <AvatarUpload
            onFileChange={handleAvatarChange}
            onUpload={handleAvatarUpload}
            preview={avatarPreview}
            loading={loading.avatar}
            disabled={isFormDisabled}
            error={error}
          />

          <InputField
            label={FORM_LABELS.NAME}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={PLACEHOLDERS.NAME}
            required
            disabled={isFormDisabled}
          />

          <InputField
            label={FORM_LABELS.EMAIL}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={PLACEHOLDERS.EMAIL}
            required
            disabled={isFormDisabled}
          />

          <InputField
            label={FORM_LABELS.PASSWORD}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={PLACEHOLDERS.PASSWORD}
            required
            disabled={isFormDisabled}
          />

          <InputField
            label={FORM_LABELS.CONFIRM_PASSWORD}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={PLACEHOLDERS.CONFIRM_PASSWORD}
            required
            disabled={isFormDisabled}
          />

          <RoleSelector
            value={formData.role}
            onChange={handleChange}
            disabled={isFormDisabled}
          />

          {formData.role === UserRole.Doctor && (
            <DoctorInfoSection
              formData={formData}
              onChange={handleChange}
              disabled={isFormDisabled}
            />
          )}

          <PersonalInfoSection
            formData={formData}
            onChange={handleChange}
            disabled={isFormDisabled}
          />

          <SubmitButton
            type="submit"
            loading={loading.form}
            disabled={isFormDisabled}
            loadingText={loading.avatar ? 'Uploading Avatar...' : 'Creating Account...'}
            fullWidth
          >
            {BUTTON_LABELS.CREATE_ACCOUNT}
          </SubmitButton>
        </form>

        <div className={styles.linkSection}>
          {BUTTON_LABELS.ALREADY_HAVE_ACCOUNT}{' '}
          <a
            href="/auth/signin"
            className={styles.link}
          >
            {BUTTON_LABELS.SIGN_IN}
          </a>
        </div>
      </div>
    </div>
  );
} 
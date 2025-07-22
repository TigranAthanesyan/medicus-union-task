import { useState, useRef, useEffect } from "react";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import MainContainer from "../MainContainer";
import ErrorMessage from "../ErrorMessage";
import InputField from "../InputField";
import RoleSelector from "../RoleSelector";
import AvatarUpload from "../AvatarUpload";
import SubmitButton from "../SubmitButton";
import DoctorInfoSection from "../DoctorInfoSection";
import PersonalInfoSection from "../PersonalInfoSection";
import { UserRole } from "@/types";
import {
  FORM_LABELS,
  PLACEHOLDERS,
  SECTION_TITLES,
  BUTTON_LABELS,
} from "@/constants/signup";
import styles from "./styles.module.css";

export default function SignUp() {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const nameRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const confirmPasswordRef = useRef<HTMLDivElement>(null);
  const doctorSectionRef = useRef<HTMLDivElement>(null);
  const phoneNumberRef = useRef<HTMLDivElement>(null);

  const {
    formData,
    loading,
    fieldErrors,
    generalError,
    uploadedImageUrl,
    handleChange,
    handleSubmit,
    handleAvatarUpload,
    clearErrors,
    getFirstFieldWithError,
  } = useSignUpForm();

  useEffect(() => {
    const firstErrorField = getFirstFieldWithError();
    if (firstErrorField) {
      const fieldRefMap = {
        name: nameRef,
        email: emailRef,
        password: passwordRef,
        confirmPassword: confirmPasswordRef,
        phoneNumber: phoneNumberRef,
      };

      if (['specializations', 'description', 'experience', 'consultationPrice', 'consultationCurrency'].includes(firstErrorField)) {
        doctorSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      } else if (fieldRefMap[firstErrorField as keyof typeof fieldRefMap]) {
        fieldRefMap[firstErrorField as keyof typeof fieldRefMap].current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [fieldErrors, getFirstFieldWithError]);

  const handleAvatarChange = (file: File | null) => {
    setAvatar(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview("");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    let finalAvatarUrl: string | undefined = uploadedImageUrl || undefined;

    if (avatar && !uploadedImageUrl) {
      const uploadResult = await handleAvatarUpload(avatar);
      if (uploadResult) {
        finalAvatarUrl = uploadResult;
      } else if (avatar) {
        console.warn("Avatar upload failed, continuing without avatar");
      }
    }

    await handleSubmit(e, finalAvatarUrl);
  };

  const isFormDisabled = loading.form || loading.avatar;

  return (
    <MainContainer>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>{SECTION_TITLES.SIGN_UP}</h1>

        {generalError && <ErrorMessage message={generalError} onDismiss={clearErrors} />}

        <form onSubmit={handleFormSubmit}>
          <AvatarUpload
            onFileChange={handleAvatarChange}
            onUpload={handleAvatarUpload}
            preview={avatarPreview}
            loading={loading.avatar}
            disabled={isFormDisabled}
            error={generalError}
          />

          <InputField
            ref={nameRef}
            label={FORM_LABELS.NAME}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={PLACEHOLDERS.NAME}
            required
            disabled={isFormDisabled}
            error={fieldErrors.name}
          />

          <InputField
            ref={emailRef}
            label={FORM_LABELS.EMAIL}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={PLACEHOLDERS.EMAIL}
            required
            disabled={isFormDisabled}
            error={fieldErrors.email}
          />

          <InputField
            ref={passwordRef}
            label={FORM_LABELS.PASSWORD}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={PLACEHOLDERS.PASSWORD}
            required
            disabled={isFormDisabled}
            error={fieldErrors.password}
          />

          <InputField
            ref={confirmPasswordRef}
            label={FORM_LABELS.CONFIRM_PASSWORD}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder={PLACEHOLDERS.CONFIRM_PASSWORD}
            required
            disabled={isFormDisabled}
            error={fieldErrors.confirmPassword}
          />

          <RoleSelector
            value={formData.role}
            onChange={handleChange}
            disabled={isFormDisabled}
          />

          {formData.role === UserRole.Doctor && (
            <DoctorInfoSection
              ref={doctorSectionRef}
              formData={formData}
              onChange={handleChange}
              disabled={isFormDisabled}
              fieldErrors={fieldErrors}
            />
          )}

          <PersonalInfoSection
            formData={formData}
            onChange={handleChange}
            disabled={isFormDisabled}
            fieldErrors={fieldErrors}
            phoneNumberRef={phoneNumberRef}
          />

          <SubmitButton
            type="submit"
            loading={loading.form}
            disabled={isFormDisabled}
            loadingText={
              loading.avatar ? "Uploading Avatar..." : "Creating Account & Signing In..."
            }
            fullWidth
          >
            {BUTTON_LABELS.CREATE_ACCOUNT}
          </SubmitButton>
        </form>

        <div className={styles.linkSection}>
          {BUTTON_LABELS.ALREADY_HAVE_ACCOUNT}{" "}
          <a href="/auth/signin" className={styles.link}>
            {BUTTON_LABELS.SIGN_IN}
          </a>
        </div>
      </div>
    </MainContainer>
  );
}

import React, { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { AVATAR_MAX_SIZE, AVATAR_MAX_SIZE_DISPLAY } from "../../constants/global";
import { SUPPORTED_IMAGE_FORMATS, SUPPORTED_IMAGE_FORMATS_DISPLAY } from "../../constants/signup";
import { validateFileSize, validateFileType } from "../../utils/validation";
import InputLabel from "../InputLabel";
import Loading from "../Loading";
import styles from "./styles.module.css";

interface AvatarUploadProps {
  onFileChange: (file: File | null) => void;
  onUpload: (file: File) => Promise<string | null>;
  preview?: string;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  onFileChange,
  onUpload,
  preview,
  loading = false,
  disabled = false,
  error,
  className = "",
}) => {
  const [localError, setLocalError] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLocalError("");

    if (!file) {
      onFileChange(null);
      return;
    }

    if (!validateFileType(file, SUPPORTED_IMAGE_FORMATS)) {
      setLocalError("Please select a valid image file");
      onFileChange(null);
      return;
    }

    if (!validateFileSize(file, AVATAR_MAX_SIZE)) {
      setLocalError(`Image size must be less than ${AVATAR_MAX_SIZE_DISPLAY}`);
      onFileChange(null);
      return;
    }

    onFileChange(file);

    if (onUpload) {
      setUploading(true);
      try {
        await onUpload(file);
      } catch {
        setLocalError("Failed to upload avatar");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemoveAvatar = () => {
    onFileChange(null);
    setLocalError("");
  };

  const displayError = error || localError;
  const isLoading = loading || uploading;

  return (
    <div className={clsx(styles.avatarSection, className)}>
      <InputLabel>Profile Picture (Optional)</InputLabel>

      <div className={styles.avatarPreview}>
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Avatar preview"
              width={100}
              height={100}
              className={styles.avatarImage}
            />
            <button
              type="button"
              className={styles.removeButton}
              onClick={handleRemoveAvatar}
              disabled={disabled || isLoading}
              aria-label="Remove avatar"
            >
              ×
            </button>
          </>
        ) : (
          <span className={styles.avatarPlaceholder}>👤</span>
        )}
      </div>

      <input
        type="file"
        accept={SUPPORTED_IMAGE_FORMATS.join(",")}
        onChange={handleFileChange}
        disabled={disabled || isLoading}
        className={styles.fileInput}
      />

      <div className={styles.fileInputHint}>
        Max file size: {AVATAR_MAX_SIZE_DISPLAY}. Supported formats: {SUPPORTED_IMAGE_FORMATS_DISPLAY}
      </div>

      {isLoading && <Loading size="small" message="Uploading avatar..." />}

      {displayError && <div className={styles.errorMessage}>{displayError}</div>}
    </div>
  );
};

export default AvatarUpload;

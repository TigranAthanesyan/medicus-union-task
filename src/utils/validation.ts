import { UserRole } from "../types";
import { SignUpFormData, FieldErrors } from "../types/signUp";
import { FORM_VALIDATION, CURRENCIES } from "../constants/signup";

export const validateSignUpForm = (formData: SignUpFormData): FieldErrors => {
  const errors: FieldErrors = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required";
  } else if (formData.name.trim().length < FORM_VALIDATION.MIN_NAME_LENGTH) {
    errors.name = `Name must be at least ${FORM_VALIDATION.MIN_NAME_LENGTH} characters`;
  } else if (formData.name.trim().length > FORM_VALIDATION.MAX_NAME_LENGTH) {
    errors.name = `Name must be less than ${FORM_VALIDATION.MAX_NAME_LENGTH} characters`;
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < FORM_VALIDATION.MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${FORM_VALIDATION.MIN_PASSWORD_LENGTH} characters`;
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (formData.role === UserRole.Doctor) {
    if (!formData.specializations || formData.specializations.length === 0) {
      errors.specializations = "At least one specialization is required for doctors";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required for doctors";
    } else if (formData.description.trim().length > FORM_VALIDATION.MAX_DESCRIPTION_LENGTH) {
      errors.description = `Description must be less than ${FORM_VALIDATION.MAX_DESCRIPTION_LENGTH} characters`;
    }

    if (
      formData.experience !== undefined &&
      (isNaN(formData.experience) ||
        formData.experience < 0 ||
        formData.experience > FORM_VALIDATION.MAX_EXPERIENCE_YEARS)
    ) {
      errors.experience = `Experience must be between 0 and ${FORM_VALIDATION.MAX_EXPERIENCE_YEARS} years`;
    }

    if (
      formData.consultationPrice === undefined ||
      isNaN(formData.consultationPrice) ||
      formData.consultationPrice < FORM_VALIDATION.MIN_CONSULTATION_PRICE ||
      formData.consultationPrice > FORM_VALIDATION.MAX_CONSULTATION_PRICE
    ) {
      errors.consultationPrice = `Consultation price must be between ${FORM_VALIDATION.MIN_CONSULTATION_PRICE} and ${FORM_VALIDATION.MAX_CONSULTATION_PRICE}`;
    }

    if (!formData.consultationCurrency || !CURRENCIES.some(c => c.value === formData.consultationCurrency)) {
      errors.consultationCurrency = "Please select a valid currency";
    }
  }

  if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
    errors.phoneNumber = "Please enter a valid phone number";
  }

  return errors;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  return phoneRegex.test(cleanPhone);
};

export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some((type) => file.type.startsWith(type));
};

export const getPasswordStrength = (password: string): "weak" | "medium" | "strong" => {
  if (password.length < 6) return "weak";
  if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
    return "strong";
  }
  return "medium";
};

import { UserRole } from '../types';
import { SignUpFormData } from '../app/auth/signup/types';
import { FORM_VALIDATION } from '../constants/signup';

export const validateSignUpForm = (formData: SignUpFormData): string | null => {
  if (!formData.name.trim()) {
    return 'Name is required';
  }

  if (!formData.email.trim()) {
    return 'Email is required';
  } 
  
  if (!isValidEmail(formData.email)) {
    return 'Please enter a valid email address';
  }

  if (!formData.password) {
    return 'Password is required';
  }
  
  if (formData.password.length < FORM_VALIDATION.MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${FORM_VALIDATION.MIN_PASSWORD_LENGTH} characters`;
  }

  if (formData.password !== formData.confirmPassword) {
    return 'Passwords do not match';
  }

  if (formData.role === UserRole.Doctor) {
    if (!formData.specializations || formData.specializations.length === 0) {
      return 'At least one specialization is required for doctors';
    }
    
    if (!formData.description.trim()) {
      return 'Description is required for doctors';
    }
    
    if (formData.experience !== undefined && (
      isNaN(formData.experience) || 
      formData.experience < 0 || 
      formData.experience > FORM_VALIDATION.MAX_EXPERIENCE_YEARS
    )) {
      return `Experience must be between 0 and ${FORM_VALIDATION.MAX_EXPERIENCE_YEARS} years`;
    }
  }

  if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
    return 'Please enter a valid phone number';
  }

  return null;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone);
};

export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.startsWith(type));
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak';
  if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
    return 'strong';
  }
  return 'medium';
}; 

export const FORM_VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_EXPERIENCE_YEARS: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_SPECIALIZATION_LENGTH: 100,
  MIN_CONSULTATION_PRICE: 0,
  MAX_CONSULTATION_PRICE: 10000,
} as const;

export const PLACEHOLDERS = {
  NAME: "Enter your full name",
  EMAIL: "Enter your email address",
  PASSWORD: "Enter your password",
  CONFIRM_PASSWORD: "Confirm your password",
  SPECIALIZATION: "e.g., Cardiology, Pediatrics, General Medicine",
  DESCRIPTION: "Brief description about your practice and expertise",
  EXPERIENCE: "e.g., 5",
  CONSULTATION_PRICE: "e.g., 150",
  PHONE: "e.g., +1 (555) 123-4567",
  DATE_OF_BIRTH: "Select your date of birth",
  COUNTRY: "Select your country",
} as const;

export const FORM_LABELS = {
  NAME: "Full Name",
  EMAIL: "Email Address",
  PASSWORD: "Password",
  CONFIRM_PASSWORD: "Confirm Password",
  ROLE: "I am a:",
  SPECIALIZATION: "Specialization",
  DESCRIPTION: "Description",
  EXPERIENCE: "Years of Experience (optional)",
  CONSULTATION_PRICE: "Consultation Price",
  CONSULTATION_CURRENCY: "Currency",
  PHONE: "Phone Number",
  DATE_OF_BIRTH: "Date of Birth",
  COUNTRY: "Country",
  GENDER: "Gender",
  AVATAR: "Profile Picture (Optional)",
} as const;

export const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/png", "image/gif", "image/webp"];
export const SUPPORTED_IMAGE_FORMATS_DISPLAY = "JPG, PNG, GIF, WebP";

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL_INVALID: "Please enter a valid email address",
  PASSWORD_TOO_SHORT: `Password must be at least ${FORM_VALIDATION.MIN_PASSWORD_LENGTH} characters`,
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  PHONE_INVALID: "Please enter a valid phone number",
  EXPERIENCE_INVALID: `Experience must be between 0 and ${FORM_VALIDATION.MAX_EXPERIENCE_YEARS} years`,
  CONSULTATION_PRICE_INVALID: `Consultation price must be between ${FORM_VALIDATION.MIN_CONSULTATION_PRICE} and ${FORM_VALIDATION.MAX_CONSULTATION_PRICE}`,
  FILE_SIZE_TOO_LARGE: "File size is too large",
  FILE_TYPE_INVALID: "Please select a valid image file",
  SPECIALIZATION_REQUIRED: "Specialization is required for doctors",
  DESCRIPTION_REQUIRED: "Description is required for doctors",
  CONSULTATION_PRICE_REQUIRED: "Consultation price is required for doctors",
} as const;

export const LOADING_MESSAGES = {
  UPLOADING_AVATAR: "Uploading avatar...",
  CREATING_ACCOUNT: "Creating account & signing in...",
  VALIDATING: "Validating...",
} as const;

export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: "Account created! Signing you in...",
  AVATAR_UPLOADED: "Avatar uploaded successfully",
} as const;

export const BUTTON_LABELS = {
  CREATE_ACCOUNT: "Create Account",
  SIGN_IN: "Sign In",
  ALREADY_HAVE_ACCOUNT: "Already have an account?",
  CANCEL: "Cancel",
  RETRY: "Retry",
} as const;

export const ROLES = {
  PATIENT: "Patient",
  DOCTOR: "Doctor",
} as const;

export const SECTION_TITLES = {
  SIGN_UP: "Sign Up",
  DOCTOR_INFORMATION: "Doctor Information",
  PERSONAL_INFORMATION: "Personal Information (Optional)",
} as const;

export const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
] as const;

export const AVATAR_MAX_SIZE = 15 * 1024 * 1024;

export const AVATAR_MAX_SIZE_DISPLAY = "15MB";

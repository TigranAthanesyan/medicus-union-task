import { UserRole } from '../../../types/global';

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  dateOfBirth: string;
  phoneNumber: string;
  specialization: string;
  description: string;
  experience: number;
}

export interface AvatarUploadResponse {
  image: string;
  error?: string;
}

export interface RegisterResponse {
  success?: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export type FormFieldName = keyof SignUpFormData;

export type LoadingState = {
  form: boolean;
  avatar: boolean;
};

export type FormInputEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;
export type FileInputEvent = React.ChangeEvent<HTMLInputElement>; 
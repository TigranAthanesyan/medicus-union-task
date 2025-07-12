import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole, CreateUserInput } from '../types/global';
import { SignUpFormData, LoadingState, FormInputEvent, FormSubmitEvent } from '../app/auth/signup/types';
import { validateSignUpForm } from '../utils/validation';
import { registerUser, uploadAvatar } from '../services/auth';

const initialFormData: SignUpFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: UserRole.Patient,
  dateOfBirth: '',
  phoneNumber: '',
  specialization: '',
  description: '',
  experience: undefined,
};

export const useSignUpForm = () => {
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData);
  const [loading, setLoading] = useState<LoadingState>({
    form: false,
    avatar: false,
  });
  const [error, setError] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  
  const router = useRouter();

  const handleChange = (e: FormInputEvent): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearError = (): void => {
    setError('');
  };

  const resetForm = (): void => {
    setFormData(initialFormData);
    setUploadedImageUrl('');
    setError('');
  };

  const handleAvatarUpload = async (file: File): Promise<string | null> => {
    setLoading(prev => ({ ...prev, avatar: true }));
    
    try {
      const data = await uploadAvatar(file);
      
      if (data.image) {
        setUploadedImageUrl(data.image);
        return data.image;
      } else {
        setError(data.error || 'Failed to upload avatar');
        return null;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(prev => ({ ...prev, avatar: false }));
    }
  };

  const handleSubmit = async (e: FormSubmitEvent, avatarUrl?: string): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(prev => ({ ...prev, form: true }));

    const validationError = validateSignUpForm(formData);
    if (validationError) {
      setError(validationError);
      setLoading(prev => ({ ...prev, form: false }));
      return;
    }

    try {
      const requestData: CreateUserInput = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (avatarUrl || uploadedImageUrl) {
        requestData.image = avatarUrl || uploadedImageUrl;
      }
      if (formData.dateOfBirth) {
        requestData.dateOfBirth = new Date(formData.dateOfBirth);
      }
      if (formData.phoneNumber) {
        requestData.phoneNumber = formData.phoneNumber;
      }

      if (formData.role === UserRole.Doctor) {
        requestData.specialization = formData.specialization;
        requestData.description = formData.description;
        if (formData.experience) {
          requestData.experience = formData.experience;
        }
      }

      const data = await registerUser(requestData);

      if (data.error) {
        setError(data.error);
      } else {
        router.push('/auth/signin?message=Registration successful. Please sign in.');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  return {
    formData,
    loading,
    error,
    uploadedImageUrl,
    handleChange,
    handleSubmit,
    handleAvatarUpload,
    clearError,
    resetForm,
  };
}; 
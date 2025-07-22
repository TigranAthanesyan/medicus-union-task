import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { validateSignUpForm } from "../utils/validation";
import { registerUser, uploadAvatar } from "../services/auth";
import { UserRole, BaseUser, SignUpFormData, LoadingState, FormInputEvent, FormSubmitEvent, FieldErrors } from "../types";

const initialFormData: SignUpFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: UserRole.Patient,
  dateOfBirth: "",
  phoneNumber: "",
  country: "",
  gender: "",
  specializations: [],
  description: "",
  experience: 0,
  consultationPrice: 0,
  consultationCurrency: "USD",
};

export const useSignUpForm = () => {
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData);
  const [loading, setLoading] = useState<LoadingState>({
    form: false,
    avatar: false,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const router = useRouter();

  const handleChange = (e: FormInputEvent | { target: { name: string; value: string[] } }): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const clearErrors = (): void => {
    setFieldErrors({});
    setGeneralError("");
  };

  const getFirstFieldWithError = (): string | null => {
    const fieldOrder = [
      "name",
      "email", 
      "password",
      "confirmPassword",
      "specializations",
      "description",
      "experience",
      "consultationPrice",
      "consultationCurrency",
      "phoneNumber"
    ];

    for (const field of fieldOrder) {
      if (fieldErrors[field]) {
        return field;
      }
    }
    return null;
  };

  const resetForm = (): void => {
    setFormData(initialFormData);
    setUploadedImageUrl("");
    clearErrors();
  };

  const handleAvatarUpload = async (file: File): Promise<string | null> => {
    setLoading((prev) => ({ ...prev, avatar: true }));

    try {
      const data = await uploadAvatar(file);

      if (data.image) {
        setUploadedImageUrl(data.image);
        return data.image;
      } else {
        setGeneralError(data.error || "Failed to upload avatar");
        return null;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload avatar";
      setGeneralError(errorMessage);
      return null;
    } finally {
      setLoading((prev) => ({ ...prev, avatar: false }));
    }
  };

  const handleSubmit = async (e: FormSubmitEvent, avatarUrl?: string): Promise<void> => {
    e.preventDefault();
    clearErrors();
    setLoading((prev) => ({ ...prev, form: true }));

    const validationErrors = validateSignUpForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setLoading((prev) => ({ ...prev, form: false }));
      return;
    }

    try {
      const requestData: BaseUser = {
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
      if (formData.country) {
        requestData.country = formData.country;
      }
      if (formData.gender) {
        requestData.gender = formData.gender;
      }

      if (formData.role === UserRole.Doctor) {
        requestData.specializations = formData.specializations;
        requestData.description = formData.description;
        if (formData.experience) {
          requestData.experience = formData.experience;
        }
        if (formData.consultationPrice) {
          requestData.consultationPrice = formData.consultationPrice;
        }
        if (formData.consultationCurrency) {
          requestData.consultationCurrency = formData.consultationCurrency;
        }
      }

      // Register the user
      const data = await registerUser(requestData);

      if (data.error) {
        setGeneralError(data.error);
      } else {
        const signInResult = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.error) {
          setGeneralError("Account created successfully, but automatic login failed. Please sign in manually.");
          router.push("/auth/signin?message=Registration successful. Please sign in.");
        } else {
          router.push("/");
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred. Please try again.";
      setGeneralError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  return {
    formData,
    loading,
    fieldErrors,
    generalError,
    uploadedImageUrl,
    handleChange,
    handleSubmit,
    handleAvatarUpload,
    clearErrors,
    resetForm,
    getFirstFieldWithError,
  };
};

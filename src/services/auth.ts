import { CreateUserInput } from '../types/global';
import { AvatarUploadResponse, RegisterResponse } from '../app/auth/signup/types';

export const registerUser = async (userData: CreateUserInput): Promise<RegisterResponse> => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Registration failed',
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const uploadAvatar = async (file: File): Promise<AvatarUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch('/api/upload/avatar', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        image: '',
        error: data.error || 'Failed to upload avatar',
      };
    }

    return {
      image: data.image,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    return {
      image: '',
      error: errorMessage,
    };
  }
};

export const signInUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Sign in failed',
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const refreshToken = async () => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Token refresh failed',
      };
    }

    return {
      success: true,
      token: data.token,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const signOutUser = async () => {
  try {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Sign out failed',
      };
    }

    return {
      success: true,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    return {
      success: false,
      error: errorMessage,
    };
  }
}; 
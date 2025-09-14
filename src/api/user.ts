import { API_ROOT, type ResponseInterface } from '@/config/api';
import Axios from '@/config/axios-config';
import type { SkillsType, User } from '@/interfaces/User';

const API_BASE = `${API_ROOT}/api/users`;

export const getUserSession = async (): Promise<User | null> => {
  try {
    const response = await Axios.get<User>(`${API_BASE}/session`);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user session:', error);
    return null;
  }
};

export interface UpdateUserParams {
  name?: string;
  role?: 'customer' | 'provider';
  email?: string;
  telNumber?: string;
  address?: string;
  avatarUrl?: string;
  providerProfile?: {
    title?: string;
    skills?: SkillsType[];
    description?: string;
  };
}

export const updateUser = async (
  userId: string,
  formData: UpdateUserParams,
): Promise<boolean> => {
  try {
    const response = await Axios.put<ResponseInterface<User>>(
      `${API_BASE}/${userId}`,
      formData,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
};

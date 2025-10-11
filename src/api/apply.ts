import { API_ROOT, type ResponseInterface } from '@/config/api';
import type { Apply, ApplyDetail } from '@/interfaces/Apply';
import axios from 'axios';

const API_BASE = `${API_ROOT}/api/applies`;

export interface ApplyFormInterface {
  date: Date | undefined;
  appliedPrice: number;
  budget: number;
  description?: string;
}

export const createApply = async (
  formData: ApplyFormInterface,
  customerId: string,
  providerId: string,
  postId: string,
): Promise<boolean> => {
  try {
    const response = await axios.post<ResponseInterface<Apply>>(
      `${API_BASE}`,
      { ...formData, postId, customerId, providerId },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data.success;
  } catch (error) {
    console.error('Error creating apply:', error);
    return false;
  }
};

export const checkApply = async (
  postId: string,
  providerId: string,
): Promise<Apply | null> => {
  try {
    console.log('Post ID:', postId, 'Provider ID:', providerId);
    const response = await axios.get<ResponseInterface<Apply>>(
      `${API_BASE}/check/${providerId}/${postId}`,
    );
    console.log('Check Apply Response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error checking apply existence:', error);
    return null;
  }
};

export const getApplyById = async (applyId: string): Promise<Apply> => {
  try {
    const response = await axios.get<ResponseInterface<Apply>>(
      `${API_BASE}/${applyId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching apply by ID:', error);
    throw error;
  }
};

export const updateApply = async (
  applyId: string,
  formData: ApplyFormInterface,
): Promise<boolean> => {
  try {
    const response = await axios.put<ResponseInterface<Apply>>(
      `${API_BASE}/${applyId}`,
      formData,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data.success;
  } catch (error) {
    console.error('Error updating apply:', error);
    return false;
  }
};

export const getDetailedAppliesByProviderId = async (
  providerId: string,
): Promise<ApplyDetail[]> => {
  try {
    const response = await axios.get<ResponseInterface<ApplyDetail[]>>(
      `${API_BASE}/provider/${providerId}/detail`,
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching applys by provider ID:', error);
    throw error;
  }
};

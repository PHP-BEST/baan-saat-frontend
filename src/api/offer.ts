import { API_ROOT, type ResponseInterface } from '@/config/api';
import type { Offer, OfferDetail, OfferedStatus } from '@/interfaces/Offer';
import axios from 'axios';
const API_BASE = `${API_ROOT}/api/offers`;

export interface OfferFormInterface {
  customerId: string;
  providerId: string;
  postId: string;
  price: number;
  title: string;
}
export const createOffer = async (
  formData: OfferFormInterface[],
): Promise<boolean> => {
  try {
    const response = await axios.post<ResponseInterface<Offer>>(
      `${API_BASE}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.success;
  } catch (e) {
    console.error('Error creating offer: ', e);
    return false;
  }
};
export const getOffersByPostId = async (postId: string): Promise<Offer[]> => {
  try {
    const response = await axios.get<ResponseInterface<OfferDetail[]>>(
      `${API_BASE}/post/${postId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching applys by post ID:', error);
    throw error;
  }
};

export const getDetailedOffersByProviderId = async (
  providerId: string,
): Promise<OfferDetail[]> => {
  try {
    const response = await axios.get<ResponseInterface<OfferDetail[]>>(
      `${API_BASE}/provider/${providerId}/detail`,
    );
    return response.data.data;
  } catch (e) {
    console.error('Error fetching offers by provider ID: ', e);
    throw e;
  }
};

export const getDetailedOfferedByPostId = async (
  postId: string,
): Promise<OfferDetail[]> => {
  try {
    const response = await axios.get<ResponseInterface<OfferDetail[]>>(
      `${API_BASE}/post/${postId}/detail`,
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching offers by post ID:', error);
    throw error;
  }
};
export const checkMyOffer = async (
  postId: string,
  providerId: string,
): Promise<Offer | null> => {
  try {
    const response = await axios.get<ResponseInterface<Offer>>(
      `${API_BASE}/check/${postId}/${providerId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error('Error checking offer existence:', error);
    return null;
  }
};
export const updateOfferStatus = async (
  offerId: string,
  status: OfferedStatus,
): Promise<boolean> => {
  try {
    const response = await axios.put<ResponseInterface<Offer>>(
      `${API_BASE}/${offerId}`,
      { status },
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

import { API_ROOT, type ResponseInterface } from '@/config/api';
import type { Offer, OfferDetail } from '@/interfaces/Offer';
import axios from 'axios';
const API_BASE = `${API_ROOT}/api/offers`;

export interface OfferFormInterface {
  customerId: string;
  providerId: string;
  postId: string;
  budget: number;
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
export const getDetailedOffersByProviderId = async (
  providerId: string,
): Promise<OfferDetail[]> => {
  try {
    const response = await axios.get<ResponseInterface<OfferDetail[]>>(
      `${API_BASE}/provider/${providerId}/`,
    );
    return response.data.data;
  } catch (e) {
    console.error('Error fetching offers by provider ID: ', e);
    throw e;
  }
};

import { API_ROOT, type ResponseInterface } from '@/config/api';
import type { Offer } from '@/interfaces/Offer';
import axios from 'axios';

const API_BASE = `${API_ROOT}/api/offers`;

export interface OfferFormInterface {
  date: Date | null;
  offeredPrice: number;
  description?: string;
}

export const createOffer = async (
  formData: OfferFormInterface,
  customerId: string,
  providerId: string,
  serviceId: string,
): Promise<boolean> => {
  try {
    console.log(formData);
    const response = await axios.post<ResponseInterface<Offer>>(
      `${API_BASE}`,
      { ...formData, serviceId, customerId, providerId },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data.success;
  } catch (error) {
    console.error('Error creating offer:', error);
    return false;
  }
};

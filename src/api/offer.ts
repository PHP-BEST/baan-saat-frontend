import { API_ROOT, type ResponseInterface } from '@/config/api';
import type { Offer, OfferDetail } from '@/interfaces/Offer';
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

export const checkOffer = async (
  serviceId: string,
  providerId: string,
): Promise<Offer | null> => {
  try {
    console.log('Service ID:', serviceId, 'Provider ID:', providerId);
    const response = await axios.get<ResponseInterface<Offer>>(
      `${API_BASE}/check/${providerId}/${serviceId}`,
    );
    console.log('Check Offer Response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error checking offer existence:', error);
    return null;
  }
};

export const getOfferById = async (offerId: string): Promise<Offer> => {
  try {
    const response = await axios.get<ResponseInterface<Offer>>(
      `${API_BASE}/${offerId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching offer by ID:', error);
    throw error;
  }
};

export const updateOffer = async (
  offerId: string,
  formData: OfferFormInterface,
): Promise<boolean> => {
  try {
    const response = await axios.put<ResponseInterface<Offer>>(
      `${API_BASE}/${offerId}`,
      formData,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data.success;
  } catch (error) {
    console.error('Error updating offer:', error);
    return false;
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
  } catch (error) {
    console.error('Error fetching offers by provider ID:', error);
    throw error;
  }
};

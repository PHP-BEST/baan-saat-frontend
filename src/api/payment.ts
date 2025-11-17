import { API_ROOT } from '@/config/api';
import Axios from '@/config/axios-config';

const API_BASE = `${API_ROOT}/api/payments`;

export const getConnectClientSecret = async () => {
  try {
    const response = await Axios.post(`${API_BASE}/account-session`);
    const { client_secret: clientSecret } = response.data;
    return clientSecret;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('An error occurred: ', errorMessage);
    return null;
  }
};

export const getPaymentIntentSecret = async (postId: string) => {
  try {
    const response = await Axios.get(`${API_BASE}/payment-intent/${postId}`);
    const { client_secret: clientSecret } = response.data;
    return clientSecret;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('An error occurred: ', errorMessage);
    return null;
  }
};

export const createIntentClientSecret = async (
  postId: string,
  providerId: string,
  amount: number,
) => {
  if (!postId || !providerId || amount == null) {
    console.error('Missing required parameters for payment intent creation');
    return null;
  }

  try {
    const response = await Axios.post(`${API_BASE}/payment-intent`, {
      postId,
      providerId,
      amount,
    });
    const { client_secret: clientSecret } = response.data;
    return clientSecret;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('An error occurred: ', errorMessage);
    return null;
  }
};

export const getPaymentStatusByPostId = async (postId: string) => {
  try {
    const response = await Axios.put(`${API_BASE}/status/${postId}`);
    const { status } = response.data;
    return status;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('An error occurred: ', errorMessage);
    return null;
  }
};

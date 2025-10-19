import { API_ROOT } from '@/config/api';
import Axios from '@/config/axios-config';

const API_BASE = `${API_ROOT}/api/payments`;

export const getConnectClientSecret = async () => {
  try {
    const response = await Axios.post(`${API_BASE}/account-session`);
    const { client_secret: clientSecret } = response.data;
    return clientSecret;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('An error occurred: ', errorMessage);
    return null;
  }
};

export const getPaymentIntentSecret = async (postId: string) => {
  try {
    const response = await Axios.get(`${API_BASE}/payment-intent/${postId}`);
    const { client_secret: clientSecret } = response.data;
    return clientSecret;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('An error occurred: ', errorMessage);
    return null;
  }
};

export const createIntentClientSecret = async (
  postId: string,
  providerId: string,
  amount: number,
) => {
  // Add validation before making the request
  if (!postId) {
    console.error('Missing required parameters for payment intent creation');
    return null;
  }
  if (!providerId) {
    console.error('Missing required parameters for payment intent creation');
    return null;
  }
  if (amount === undefined || amount === null) {
    console.error('Missing required parameters for payment intent creation');
    return null;
  }

  try {
    const response = await Axios.post(`${API_BASE}/payment-intent`, {
      postId: postId,
      providerId: providerId,
      amount: amount,
    });
    const { client_secret: clientSecret } = response.data;
    return clientSecret;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('An error occurred: ', errorMessage);
    return null;
  }
};

export const getPaymentStatusByPostId = async (postId: string) => {
  try {
    const response = await Axios.put(`${API_BASE}/status/${postId}`);
    const { status } = response.data;
    return status;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    console.error('An error occurred: ', errorMessage);
    return null;
  }
};

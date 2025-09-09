import { API_ROOT_DEV, API_ROOT_LOCAL, API_ROOT_PROD, NODE_ENV } from './env';
import axios from 'axios';
export let API_ROOT: string;

if (NODE_ENV === 'development') {
  console.log('🔧 Using DEVELOPMENT API 🔧');
  API_ROOT = API_ROOT_DEV;
} else if (NODE_ENV === 'production') {
  console.log('🚀 Using PRODUCTION API 🚀');
  API_ROOT = API_ROOT_PROD;
} else {
  console.log('🏠 Using LOCAL API 🏠');
  API_ROOT = API_ROOT_LOCAL;
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

interface Getprofile {
  success: boolean;
  data: {
    name: string;
    email: string;
    phone: string;
    description: string;
    skills: string;
    profilePicture: string;
  };
}
export async function fetchData(id: number): Promise<Getprofile['data']> {
  try {
    const response = await axios.get(`${API_ROOT}/${id}`, {
      withCredentials: false,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export async function updateData(
  id: number,
  newData: Partial<Getprofile['data']>,
): Promise<Getprofile['data']> {
  try {
    const response = await axios.put(`${API_ROOT}/${id}`, newData, {
      withCredentials: false,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}

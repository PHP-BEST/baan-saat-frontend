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
interface GetProfileData {
  data: {
    name: string;
    _id: string;
    email: string;
    telNumber: string;
    avatarUrl: string;
    role: 'customer' | 'provider';
    providerProfile?: {
      title: string;
      description: string;
      skills: string[]; // Array of strings for skills
    };
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Fetch data by ID
export async function fetchData(id: string): Promise<GetProfileData['data']> {
  try {
    const response = await axios.get(`http://localhost:3000/profile/${id}`, {
      withCredentials: false,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching data:', error.message);
    } else {
      console.error('Unknown error fetching data:', error);
    }
    throw error;
  }
}

// Update data by ID
export async function updateData(
  id: string,
  newData: GetProfileData['data'],
): Promise<GetProfileData['data']> {
  try {
    const response = await axios.put(
      `http://localhost:3000/profile/${id}`,
      newData,
      {
        withCredentials: false,
      },
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error updating data:', error.message);
    } else {
      console.error('Unknown error updating data:', error);
    }
    throw error;
  }
}
export async function getServices() {
  try{
    const response = await axios.get('http://localhost:3000/api/service')
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error updating data:', error.message);
    } else {
      console.error('Unknown error updating data:', error);
    }
    throw error;
  }
}
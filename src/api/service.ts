import { API_ROOT, type ResponseInterface } from '@/config/api';
import type { Service, ServiceTag, TagsOption } from '@/interfaces/Service';
import axios from 'axios';

const API_BASE = `${API_ROOT}/api/services`;

export const getAllServices = async (): Promise<Service[]> => {
  try {
    const response = await axios.get<ResponseInterface<Service[]>>(
      `${API_BASE}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.success) {
      const services: Service[] = response.data.data;
      return services;
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error fetching services in getAllServices:', err);
    return [];
  }
};

export const getUserServices = async (userId: string): Promise<Service[]> => {
  try {
    const allServices = await getAllServices();
    if (allServices.length === 0) {
      return [];
    }
    const userServices: Service[] = allServices.filter(
      (svc: Service) => svc.customerId === userId,
    );
    return userServices;
  } catch (err) {
    console.log('Error fetching user services in getUserServices:', err);
    return [];
  }
};

export const getServiceById = async (
  serviceId: string,
): Promise<Service | null> => {
  if (!serviceId) return null;
  try {
    const response = await axios.get<ResponseInterface<Service>>(
      `${API_BASE}/${serviceId}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.success) {
      const currentService = response.data.data;
      return currentService;
    } else {
      throw new Error('Service not found');
    }
  } catch (err) {
    console.error('Error fetching service data:', err);
    return null;
  }
};

export const getServicesByUserId = async (
  userId: string,
): Promise<Service[]> => {
  try {
    const response = await axios.get<ResponseInterface<Service[]>>(
      `${API_BASE}/user/${userId}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.success) {
      const services: Service[] = response.data.data;
      return services;
    } else {
      return [];
    }
  } catch (err) {
    console.log(
      'Error fetching services by user ID in getServicesByUserId:',
      err,
    );
    return [];
  }
};

export const searchServices = async (query: string): Promise<Service[]> => {
  try {
    const response = await axios.get<ResponseInterface<Service[]>>(
      `${API_BASE}/search?query=${query}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.success) {
      const services: Service[] = response.data.data;
      return services;
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error searching services in searchServices:', err);
    return [];
  }
};

export interface FilterServiceParams {
  userId?: string;
  title?: string;
  tags?: TagsOption[];
  minBudget?: number;
  maxBudget?: number;
  startDate?: string;
  endDate?: string;
}

export const filterServices = async (
  params: FilterServiceParams,
): Promise<Service[]> => {
  try {
    const response = await axios.get<ResponseInterface<Service[]>>(
      `${API_BASE}/filter`,
      {
        headers: { 'Content-Type': 'application/json' },
        params: {
          ...params,
          ...(params.tags
            ? { tags: params.tags.map((tag) => tag.value).join(',') }
            : {}),
        },
      },
    );

    if (response.data.success) {
      console.log('Filtered services:', response.data.data);
      return response.data.data;
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error filtering services in filterServices:', err);
    return [];
  }
};

export interface ServiceFormInterface {
  title: string;
  description: string;
  tags: ServiceTag[];
  telNumber: string;
  budget: number;
  location: string;
  coverPhotoUrl?: string;
  date: Date | null;
}

export const createService = async (
  userId: string,
  formData: ServiceFormInterface,
): Promise<boolean> => {
  try {
    const response = await axios.post<ResponseInterface<Service>>(
      `${API_BASE}`,
      { ...formData, customerId: userId },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.success) {
      return true;
    } else {
      throw new Error('Failed to create service');
    }
  } catch (err) {
    console.error('Error creating service:', err);
    return false;
  }
};

export const updateService = async (
  serviceId: string,
  formData: ServiceFormInterface,
): Promise<boolean> => {
  try {
    const response = await axios.put<ResponseInterface<Service>>(
      `${API_BASE}/${serviceId}`,
      formData,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.success) {
      return true;
    } else {
      throw new Error('Failed to update service');
    }
  } catch (err) {
    console.error('Error updating service:', err);
    return false;
  }
};

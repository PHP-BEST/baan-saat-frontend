import { API_ROOT, type ResponseInterface } from '@/config/api';
import type { Service } from '@/interfaces/Service';
import { servicesCache } from '@/utils/cache';
import axios from 'axios';

const API_BASE = `${API_ROOT}/services`;

export const getAllServices = async (): Promise<Service[]> => {
  const cacheKey = 'all-services';
  if (servicesCache.has(cacheKey)) {
    return servicesCache.get(cacheKey)!;
  }

  try {
    const response = await axios.get<ResponseInterface<Service[]>>(
      `${API_BASE}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.success) {
      const services: Service[] = response.data.data;
      servicesCache.set(cacheKey, services);
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
  const cacheKey = `user-${userId}-services`;
  if (servicesCache.has(cacheKey)) {
    return servicesCache.get(cacheKey)!;
  }

  try {
    const allServices = await getAllServices();
    if (allServices.length === 0) {
      return [];
    }
    const userServices: Service[] = allServices.filter(
      (svc: Service) => svc.customerId === userId,
    );
    servicesCache.set(cacheKey, userServices);
    return userServices;
  } catch (err) {
    console.log('Error fetching user services in getUserServices:', err);
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

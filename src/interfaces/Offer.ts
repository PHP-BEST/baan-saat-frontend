import type { Service } from './Service';
import type { User } from './User';

export interface Offer {
  _id: string;
  serviceId: string;
  customerId: string;
  providerId: string;
  date: Date;
  offeredPrice: number;
  status: OfferStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OfferDetail {
  _id: string;
  service: Service;
  serviceId: string;
  customer: User;
  customerId: string;
  provider: User;
  providerId: string;
  date: Date;
  offeredPrice: number;
  status: OfferStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OfferStatus = 'Pending' | 'Accepted' | 'Rejected';

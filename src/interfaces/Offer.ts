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

export type OfferStatus = 'Pending' | 'Accepted' | 'Rejected';

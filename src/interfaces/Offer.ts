import type { Post } from './Post';
import type { User } from './User';

export interface Offer {
  _id: string;
  postId: string;
  customerId: string;
  providerId: string;
  date: Date;
  status: OfferedStatus;
  offeredPrice: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OfferDetail {
  _id: string;
  post: Post;
  postId: string;
  customer: User;
  customerId: string;
  provider: User;
  providerId: string;
  date: Date;
  offeredPrice: number;
  status: OfferedStatus;
  createdAt: Date;
  updatedAt: Date;
}
export type OfferedStatus = 'Pending' | 'Accepted' | 'Rejected';

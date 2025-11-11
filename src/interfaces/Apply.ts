import type { Post } from './Post';
import type { User } from './User';

export interface Apply {
  _id: string;
  postId: string;
  customerId: string;
  providerId: string;
  date: Date;
  appliedPrice: number;
  status: ApplyStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplyDetail {
  _id: string;
  post: Post;
  postId: string;
  customer: User;
  customerId: string;
  provider: User;
  providerId: string;
  date: Date;
  appliedPrice: number;
  status: ApplyStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ApplyStatus = 'Pending' | 'Accepted' | 'Rejected';

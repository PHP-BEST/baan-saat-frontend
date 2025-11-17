export interface Review {
  _id: string;
  postId: string;
  providerId: string;
  customerId: string;
  description?: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

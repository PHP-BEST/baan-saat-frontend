import axios from '../config/axios-config';
import type { Review } from '../interfaces/Review';
import type { ResponseInterface } from '../config/api';

export const createReview = (body: {
  postId: string;
  providerId: string;
  customerId: string;
  description?: string;
  rating: number;
}) => axios.post<ResponseInterface<Review>>('/api/reviews', body);

export const getProviderReviews = (providerId: string) =>
  axios.get<ResponseInterface<Review[]>>(`/api/reviews/provider/${providerId}`);

export const getReview = (id: string) =>
  axios.get<ResponseInterface<Review>>(`/api/reviews/${id}`);

export const getAllReviews = () =>
  axios.get<ResponseInterface<Review[]>>('/api/reviews');

export const deleteReview = (id: string) =>
  axios.delete<ResponseInterface<{ message: string }>>(`/api/reviews/${id}`);

import axios from '../config/axios-config';
import type { Review } from '../interfaces/Review';

type ApiResult<T> = {
  success: boolean;
  data: T;
};

export const createReview = (body: {
  postId: string;
  providerId: string;
  customerId: string;
  description?: string;
  rating: number;
}) => axios.post<ApiResult<Review>>('/api/reviews', body);

export const getProviderReviews = (providerId: string) =>
  axios.get<ApiResult<Review[]>>(`/api/reviews/provider/${providerId}`);

export const getReview = (id: string) =>
  axios.get<ApiResult<Review>>(`/api/reviews/${id}`);

export const getAllReviews = () =>
  axios.get<ApiResult<Review[]>>('/api/reviews');

export const deleteReview = (id: string) =>
  axios.delete<ApiResult<{ message: string }>>(`/api/reviews/${id}`);

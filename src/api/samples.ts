import { API_ROOT } from '@/config/api';
import axios from 'axios';

export interface Sample {
  _id: string;
  __v: number;
  name: string;
  description: string;
}

// GET /samples
export async function getSamples(): Promise<Sample[]> {
  const result = await axios.get(`${API_ROOT}/samples`);
  if (result.data.success) return result.data.data;
  return [];
}

// GET /samples/{id}
export async function getSampleById(id: number): Promise<Sample | null> {
  const result = await axios.get(`${API_ROOT}/samples/${id}`);
  if (result.data.success) return result.data.data;
  return null;
}

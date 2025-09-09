import { API_ROOT, apiFetch } from '@/config/api';

export interface Sample {
  _id: string;
  __v: number;
  name: string;
  description: string;
}

interface GetSamplesResponse {
  success: boolean;
  data: Sample[];
}

// GET /samples
export async function getSamples(): Promise<Sample[]> {
  const result = await apiFetch<GetSamplesResponse>(`${API_ROOT}/samples`);
  if (result.success) return result.data;
  return [];
}

interface GetSampleResponse {
  success: boolean;
  data: Sample;
}

// GET /samples/{id}
export async function getSampleById(id: number): Promise<Sample | null> {
  const result = await apiFetch<GetSampleResponse>(`${API_ROOT}/samples/${id}`);
  if (result.success) return result.data;
  return null;
}

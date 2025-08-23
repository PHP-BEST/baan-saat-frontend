import { API_ROOT, apiFetch } from '@/config/api';

interface GetTestResponse {
  success: boolean;
  data: string;
}

// GET /
export async function testConnection(): Promise<string> {
  const result = await apiFetch<GetTestResponse>(`${API_ROOT}/`);
  if (result.success) return result.data;
  return 'Fail to connect';
}

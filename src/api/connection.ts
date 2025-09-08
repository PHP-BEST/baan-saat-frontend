import { API_ROOT } from '@/config/api';
import axios from 'axios';

interface GetTestResponse {
  success: boolean;
  data: string;
}

// GET /
export async function testConnection(): Promise<string> {
  const result = await axios.get<GetTestResponse>(`${API_ROOT}/`);
  if (result.data.success) return result.data.data;
  return 'There is an error!';
}

import axios from 'axios';
import { API_ROOT, type ResponseInterface } from '@/config/api';

const UPLOAD_API = `${API_ROOT}/api/uploads`; // noun path, POST to create uploads

export async function uploadImages(files: File[]): Promise<string[]> {
  const fd = new FormData();
  // adjust the field name to what your backend expects: 'file' vs 'files'
  files.forEach((f) => fd.append('files', f));

  const res = await axios.post<ResponseInterface<{ urls: string[] }>>(
    UPLOAD_API,
    fd,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return res.data?.success ? res.data.data.urls : [];
}

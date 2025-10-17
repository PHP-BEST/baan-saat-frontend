import axios from 'axios';
import { API_ROOT } from '@/config/api';

const UPLOAD_API = `${API_ROOT}/api/upload`;

type UploadResponse = {
  fileUrlList?: string[];
};

export async function uploadImages(files: File[]): Promise<string[]> {
  const fd = new FormData();
  files.forEach((f) => fd.append('files', f));

  const res = await axios.post<UploadResponse>(UPLOAD_API, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data?.fileUrlList ?? [];
}

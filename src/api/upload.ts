import axios from 'axios';
import { API_ROOT } from '@/config/api';

const UPLOAD_API = `${API_ROOT}/api/storage`;
const ASSET_BASE = 'https://baan-saat.s3.ap-southeast-1.amazonaws.com';

type UploadResponse = {
  fileKeyList: string[];
};

function toPublicUrl(key: string): string {
  return `${ASSET_BASE}/${encodeURI(key)}`;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const fd = new FormData();
  files.forEach((f) => fd.append('file', f));

  const res = await axios.post<UploadResponse>(UPLOAD_API, fd);
  const body = res.data;
  if (isStringArray(body.fileKeyList)) {
    body.fileKeyList.forEach((e) => console.log(toPublicUrl(e)));
    return body.fileKeyList.map(toPublicUrl);
  }

  return [];
}

import type { ServiceTag } from '@/interfaces/Service';

export function convertTagsToLabels(tags: ServiceTag[]): string[] {
  const tagLabelMap: Record<string, string> = {
    houseCleaning: 'การทำความสะอาด',
    houseRepair: 'การซ่อมแซม',
    plumbing: 'ประปา',
    electrical: 'ไฟฟ้า',
    hvac: 'เครื่องปรับอากาศ',
    painting: 'การทาสี',
    landscaping: 'การจัดสวน',
    others: 'อื่นๆ',
  };

  return tags.map((tag) => tagLabelMap[tag] || tag);
}

export const getCompressedImageUrl = (
  file: File,
  maxWidth: number = 800,
  quality: number = 0.7,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export function formatDateToDisplay(date: Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.getMonth() + 1;
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthName = monthNames[month - 1];
  const year = d.getFullYear() + 543;
  return `${day} ${monthName} ${year}`;
}

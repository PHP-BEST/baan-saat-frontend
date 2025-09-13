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

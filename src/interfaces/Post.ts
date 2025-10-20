export interface Post {
  _id: string;
  customerId: string;
  title: string;
  description?: string;
  budget: number;
  telNumber: string;
  location: string;
  tag: PostTag;
  other: string;
  image1Url?: string;
  image2Url?: string;
  image3Url?: string;
  date: Date;
  status: 'Not working' | 'In progress' | 'Completed';
  payStatus: 'Not paid' | 'Paid';
  coverPhotoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PostTag =
  | 'houseCleaning'
  | 'houseRepair'
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'painting'
  | 'landscaping'
  | 'others';

export interface TagsOption {
  label: string;
  value: string;
  order: number;
}

export const TAG_OPTIONS: TagsOption[] = [
  { label: 'การทำความสะอาด', value: 'houseCleaning', order: 1 },
  { label: 'การซ่อมแซม', value: 'houseRepair', order: 2 },
  { label: 'ประปา', value: 'plumbing', order: 3 },
  { label: 'ไฟฟ้า', value: 'electrical', order: 4 },
  { label: 'เครื่องปรับอากาศ', value: 'hvac', order: 5 },
  { label: 'การทาสี', value: 'painting', order: 6 },
  { label: 'การจัดสวน', value: 'landscaping', order: 7 },
];

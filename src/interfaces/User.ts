interface ProviderProfile {
  title: string;
  skills: SkillsType[];
  description: string;
}

export interface User {
  _id: string;
  role: 'customer' | 'provider';
  name: string;
  email: string;
  avatarUrl: string;
  telNumber: string;
  address: string;
  lastLoginAt: Date;
  providerProfile?: ProviderProfile;
  createdAt: Date;
  updatedAt: Date;
}

export type SkillsType =
  | 'houseCleaning'
  | 'houseRepair'
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'painting'
  | 'landscaping'
  | 'others';

export interface SkillOption {
  label: string;
  value: string;
  order: number;
}

export const SKILL_OPTIONS: SkillOption[] = [
  { label: 'การทำความสะอาด', value: 'houseCleaning', order: 1 },
  { label: 'การซ่อมแซม', value: 'houseRepair', order: 2 },
  { label: 'ประปา', value: 'plumbing', order: 3 },
  { label: 'ไฟฟ้า', value: 'electrical', order: 4 },
  { label: 'เครื่องปรับอากาศ', value: 'hvac', order: 5 },
  { label: 'การทาสี', value: 'painting', order: 6 },
  { label: 'การจัดสวน', value: 'landscaping', order: 7 },
  { label: 'อื่นๆ', value: 'others', order: 8 },
];

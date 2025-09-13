interface ProviderProfile {
  title: string;
  skills: string[];
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

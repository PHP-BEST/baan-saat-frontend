interface ProviderProfile {
  title: string;
  skills: string[];
  description: string;
}

export interface User {
  userId: string;
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

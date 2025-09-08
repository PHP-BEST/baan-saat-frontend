export interface Service {
  _id: string;
  customerId: string;
  title: string;
  description: string;
  budget: number;
  telNumber: string;
  location: string;
  tags?: ServiceTag[];
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceTag =
  | 'houseCleaning'
  | 'houseRepair'
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'painting'
  | 'landscaping'
  | 'others';


export enum UserRole {
  ADMIN = 'ADMIN',
  DONOR = 'DONOR',
  VOLUNTEER = 'VOLUNTEER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
  skills?: string[];
  bio?: string;
  avatar?: string;
  // Location Fields
  city?: string;
  state?: string;
  pincode?: string;
  // New Registration Fields
  phoneNumber?: string;
  availability?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  target: number;
  raised: number;
  image: string;
  category: 'Education' | 'Environment' | 'Healthcare' | 'Disaster Relief';
  // Location Fields
  city: string;
  state: string;
  address: string;
}

export interface Donation {
  id: string;
  donorId: string;
  campaignId: string;
  amount: number;
  date: string;
  campaignTitle: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string; // General descriptor (e.g., "Main Hall")
  requiredSkills: string[];
  description: string;
  volunteers: string[]; 
  // Location Fields
  city: string;
  state: string;
  address: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

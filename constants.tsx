
import { Campaign, Event, User, UserRole } from './types';

export const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    title: 'Safe Water for All',
    description: 'Providing clean drinking water to remote villages in sub-Saharan Africa.',
    target: 50000,
    raised: 32400,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
    category: 'Healthcare',
    city: 'San Francisco',
    state: 'CA',
    address: '123 Market St, Financial District'
  },
  {
    id: 'c2',
    title: 'Education for Every Child',
    description: 'Building digital classrooms and providing tablets for underprivileged students.',
    target: 75000,
    raised: 12000,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    category: 'Education',
    city: 'New York',
    state: 'NY',
    address: '456 Broadway Ave, Manhattan'
  },
  {
    id: 'c3',
    title: 'Reforest the Amazon',
    description: 'Help us plant 10,000 native trees to restore critical wildlife habitats.',
    target: 20000,
    raised: 18500,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
    category: 'Environment',
    city: 'Austin',
    state: 'TX',
    address: '789 Congress Ave, Downtown'
  }
];

export const SAMPLE_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Weekend Food Drive',
    date: '2024-11-20',
    location: 'Community Center',
    requiredSkills: ['Logistics', 'Teamwork'],
    description: 'Help us sort and pack food donations for local families.',
    volunteers: [],
    city: 'San Francisco',
    state: 'CA',
    address: '555 Mission Bay Blvd'
  },
  {
    id: 'e2',
    title: 'Virtual Tutoring: Math',
    date: '2024-11-22',
    location: 'Remote (Zoom)',
    requiredSkills: ['Teaching', 'Mathematics'],
    description: 'Tutor high school students in basic calculus and algebra.',
    volunteers: [],
    city: 'San Francisco',
    state: 'CA',
    address: 'HQ - 101 California St'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u-admin',
    email: 'admin@ngo.com',
    name: 'Sarah NGO',
    role: UserRole.ADMIN,
    password: 'admin123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    city: 'San Francisco',
    state: 'CA',
    pincode: '94105'
  },
  {
    id: 'u-donor',
    email: 'donor@gmail.com',
    name: 'John Doe',
    role: UserRole.DONOR,
    password: 'password',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    city: 'New York',
    state: 'NY',
    pincode: '10001'
  },
  {
    id: 'u-volunteer',
    email: 'volunteer@gmail.com',
    name: 'Jane Smith',
    role: UserRole.VOLUNTEER,
    password: 'password',
    skills: ['Teaching', 'Logistics'],
    bio: 'Passionate about community service and education.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    city: 'San Francisco',
    state: 'CA',
    pincode: '94107'
  }
];

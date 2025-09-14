
import { DEPARTMENTS } from './constants';

export type UserRole = 'Admin' | 'Director' | 'Manager' | 'Employee';

export type User = {
  id: string;
  name: string;
  role: UserRole;
  department: (typeof DEPARTMENTS)[number] | 'Executive';
  avatarUrl: string;
};

export const allUsers: User[] = [
  {
    id: 'admin',
    name: 'Loknath Behera',
    role: 'Admin',
    department: 'Executive',
    avatarUrl: 'https://picsum.photos/seed/user-admin/100/100',
  },
  {
    id: 'director-fin',
    name: 'Sonal Gupta',
    role: 'Director',
    department: 'Finance & Accounts',
    avatarUrl: 'https://picsum.photos/seed/user-sonal/100/100',
  },
  {
    id: 'director-proj',
    name: 'Rajesh Kumar',
    role: 'Director',
    department: 'Engineering & Projects',
    avatarUrl: 'https://picsum.photos/seed/user-rajesh/100/100',
  },
  {
    id: 'manager-it',
    name: 'Priya Sharma',
    role: 'Manager',
    department: 'IT / Systems',
    avatarUrl: 'https://picsum.photos/seed/user-priya/100/100',
  },
   {
    id: 'manager-hr',
    name: 'Amit Patel',
    role: 'Manager',
    department: 'Human Resources (HR) & Administration',
    avatarUrl: 'https://picsum.photos/seed/user-amit/100/100',
  },
  {
    id: 'employee-ops',
    name: 'Deepa Menon',
    role: 'Employee',
    department: 'Operations',
    avatarUrl: 'https://picsum.photos/seed/user-deepa/100/100',
  },
   {
    id: 'employee-safety',
    name: 'Vijay Singh',
    role: 'Employee',
    department: 'Safety & Security',
    avatarUrl: 'https://picsum.photos/seed/user-vijay/100/100',
  },
];

export const findUserById = (id: string): User | undefined => {
    return allUsers.find(user => user.id === id);
}

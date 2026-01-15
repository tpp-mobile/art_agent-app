import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';
import { demoUsers } from '../constants/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  registeredUsers: User[];

  // Actions
  login: (role: UserRole) => void;
  loginWithCredentials: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string, role: UserRole) => { success: boolean; error?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  getUserByRole: (role: UserRole) => User | undefined;
  getAllUsers: () => User[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registeredUsers: [],

      login: (role: UserRole) => {
        const user = demoUsers.find(u => u.role === role);
        if (user) {
          set({ user, isAuthenticated: true });
        }
      },

      loginWithCredentials: (email: string, password: string) => {
        const allUsers = get().getAllUsers();
        const user = allUsers.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (user) {
          set({ user, isAuthenticated: true });
          return { success: true };
        }

        return { success: false, error: 'Invalid email or password' };
      },

      register: (name: string, email: string, password: string, role: UserRole) => {
        const allUsers = get().getAllUsers();

        // Check if email already exists
        if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          return { success: false, error: 'Email already registered' };
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          name,
          email,
          password,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`,
          role,
          createdAt: new Date(),
        };

        set(state => ({
          registeredUsers: [...state.registeredUsers, newUser],
          user: newUser,
          isAuthenticated: true,
        }));

        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      switchRole: (role: UserRole) => {
        const user = demoUsers.find(u => u.role === role);
        if (user) {
          set({ user, isAuthenticated: true });
        }
      },

      getUserByRole: (role: UserRole) => {
        return demoUsers.find(u => u.role === role);
      },

      getAllUsers: () => {
        const { registeredUsers } = get();
        return [...demoUsers, ...registeredUsers];
      },
    }),
    {
      name: 'art-agent-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

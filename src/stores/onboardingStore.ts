import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '../types';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface OnboardingState {
  hasSeenOnboarding: {
    artist: boolean;
    agent: boolean;
  };
  currentStep: number;

  // Actions
  setHasSeenOnboarding: (role: UserRole) => void;
  resetOnboarding: (role?: UserRole) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const onboardingSteps: Record<UserRole, OnboardingStep[]> = {
  artist: [
    {
      id: 'welcome',
      title: 'Welcome, Artist!',
      description: 'Art Agent helps you prove the authenticity of your human-made artwork and reach verified collectors.',
      icon: 'brush',
    },
    {
      id: 'upload',
      title: 'Upload Your Work',
      description: 'Submit your artwork along with process proofs like sketches, timelapses, and PSD files.',
      icon: 'cloud-upload',
    },
    {
      id: 'verification',
      title: 'AI Verification',
      description: 'Our AI analyzes your work and proofs to generate a Human Score, proving your artwork is human-made.',
      icon: 'shield-checkmark',
    },
    {
      id: 'certificate',
      title: 'Get Certified',
      description: 'Verified artworks receive a certificate of authenticity that collectors trust.',
      icon: 'ribbon',
    },
    {
      id: 'sell',
      title: 'Reach Collectors',
      description: 'Your verified work is showcased to buyers looking for authentic human art.',
      icon: 'storefront',
    },
  ],
  agent: [
    {
      id: 'welcome',
      title: 'Welcome, Agent!',
      description: 'Art Agent connects you with verified, authentic human-made artwork from talented artists.',
      icon: 'heart',
    },
    {
      id: 'browse',
      title: 'Browse Verified Art',
      description: 'Every artwork in our marketplace has been verified as human-made with a Human Score.',
      icon: 'images',
    },
    {
      id: 'humanScore',
      title: 'Trust the Human Score',
      description: 'Higher scores mean stronger proof of human creation. Look for 95%+ for premium authenticity.',
      icon: 'analytics',
    },
    {
      id: 'shortlist',
      title: 'Save & Organize',
      description: 'Shortlist artworks you love and organize them into collections.',
      icon: 'bookmark',
    },
    {
      id: 'connect',
      title: 'Connect with Artists',
      description: 'Message artists directly to discuss commissions or purchases.',
      icon: 'chatbubbles',
    },
  ],
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      hasSeenOnboarding: {
        artist: false,
        agent: false,
      },
      currentStep: 0,

      setHasSeenOnboarding: (role: UserRole) => {
        set(state => ({
          hasSeenOnboarding: {
            ...state.hasSeenOnboarding,
            [role]: true,
          },
          currentStep: 0,
        }));
      },

      resetOnboarding: (role?: UserRole) => {
        if (role) {
          set(state => ({
            hasSeenOnboarding: {
              ...state.hasSeenOnboarding,
              [role]: false,
            },
            currentStep: 0,
          }));
        } else {
          set({
            hasSeenOnboarding: {
              artist: false,
              agent: false,
            },
            currentStep: 0,
          });
        }
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      nextStep: () => {
        set(state => ({ currentStep: state.currentStep + 1 }));
      },

      prevStep: () => {
        set(state => ({ currentStep: Math.max(0, state.currentStep - 1) }));
      },
    }),
    {
      name: 'art-agent-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

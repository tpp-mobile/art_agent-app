import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';
import { ThemeMode } from '../types';

interface ThemeState {
  mode: ThemeMode;
  effectiveTheme: 'light' | 'dark';

  // Actions
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

const getSystemTheme = (): 'light' | 'dark' => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      effectiveTheme: getSystemTheme(),

      setMode: (mode: ThemeMode) => {
        const effectiveTheme =
          mode === 'system' ? getSystemTheme() : mode;
        set({ mode, effectiveTheme });
      },

      toggleTheme: () => {
        const currentMode = get().mode;
        let newMode: 'light' | 'dark';

        if (currentMode === 'system') {
          newMode = getSystemTheme() === 'dark' ? 'light' : 'dark';
        } else {
          newMode = currentMode === 'dark' ? 'light' : 'dark';
        }

        set({ mode: newMode, effectiveTheme: newMode });
      },

      getEffectiveTheme: () => {
        const mode = get().mode;
        return mode === 'system' ? getSystemTheme() : mode;
      },
    }),
    {
      name: 'art-agent-theme',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Update effective theme after rehydration
        if (state) {
          const effectiveTheme =
            state.mode === 'system' ? getSystemTheme() : state.mode;
          state.effectiveTheme = effectiveTheme;
        }
      },
    }
  )
);

// Listen for system theme changes
Appearance.addChangeListener(({ colorScheme }) => {
  const { mode, setMode } = useThemeStore.getState();
  if (mode === 'system') {
    // Re-trigger to update effective theme
    setMode('system');
  }
});

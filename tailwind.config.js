/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors - Trust Green
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Accent - Deep Teal
        accent: {
          500: '#0d9488',
          600: '#0f766e',
          700: '#115e59',
        },
        // Status Colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        // Background Colors
        background: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
          card: '#ffffff',
          sidebar: '#1e293b',
        },
        // Dark mode backgrounds
        dark: {
          primary: '#0f172a',
          secondary: '#1e293b',
          tertiary: '#334155',
          card: '#1e293b',
          sidebar: '#0f172a',
        },
        // Text Colors
        text: {
          primary: '#0f172a',
          secondary: '#475569',
          tertiary: '#94a3b8',
          inverse: '#ffffff',
        },
        // Border Colors
        border: {
          light: '#e2e8f0',
          medium: '#cbd5e1',
          dark: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter'],
        display: ['SpaceGrotesk'],
        serif: ['DMSerifDisplay'],
        mono: ['FiraCode'],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

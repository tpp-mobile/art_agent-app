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
        // Primary Colors - Electric Blue (Modern & Trustworthy)
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#b8ccff',
          300: '#8fadff',
          400: '#5c85ff',
          500: '#3A7DFF',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Accent Colors - Soft Terracotta (Artistic & Handcrafted)
        accent: {
          400: '#e59b81',
          500: '#D97757',
          600: '#c25a38',
          700: '#a14428',
        },
        // Status Colors
        success: '#6FAF8E', // Muted Sage
        warning: '#D97757', // Terracotta
        error: '#C84B4B',   // Soft Red
        info: '#3A7DFF',    // Electric Blue
        // Background Colors - Gallery Base
        background: {
          primary: '#FFFDF9',   // Warm White
          secondary: '#F2F2F2', // Soft Grey
          tertiary: '#E0E0E0',  // Light Grey
          card: '#ffffff',
          sidebar: '#1E1E1E',   // Charcoal
        },
        // Dark mode backgrounds
        dark: {
          primary: '#121212',   // Near Black
          secondary: '#1F1F1F', // Dark Grey
          tertiary: '#2A2A2A',
          card: '#1F1F1F',
          sidebar: '#121212',
        },
        // Text Colors
        text: {
          primary: '#1E1E1E',   // Charcoal
          secondary: '#4A4A4A',
          tertiary: '#757575',
          inverse: '#EDEDED',   // Off White
        },
        // Border Colors
        border: {
          light: '#E0E0E0',     // Light Grey
          medium: '#BDBDBD',
          dark: '#757575',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui'],
        display: ['PlayfairDisplay', 'DMSerifDisplay'],
        serif: ['PlayfairDisplay', 'DMSerifDisplay', 'serif'],
        mono: ['FiraCode', 'monospace'],
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

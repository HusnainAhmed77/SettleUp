import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: '#3cc9bb', // Teal - Main brand color
          50: '#e6f9f7',
          100: '#b3ede7',
          200: '#80e1d7',
          300: '#4dd5c7',
          400: '#3cc9bb',
          500: '#35b3a7',
          600: '#2e9d93',
          700: '#27877f',
          800: '#20716b',
          900: '#195b57',
        },
        secondary: {
          DEFAULT: '#333333', // Dark Gray - Text and backgrounds
          50: '#f4f4f4',
          100: '#e0e0e0',
          200: '#cccccc',
          300: '#b8b8b8',
          400: '#a3a3a3',
          500: '#8f8f8f',
          600: '#7a7a7a',
          700: '#666666',
          800: '#4d4d4d',
          900: '#333333',
        },
        // Accent Colors
        accent: {
          blue: '#4A90E2',
          orange: '#FF8C42',
          green: '#3cc9bb',
        },
        // Neutral Colors
        neutral: {
          light: '#f4f4f4',
          white: '#ffffff',
          dark: '#333333',
        },
        // Legacy colors for compatibility
        teal: {
          50: '#e6f9f7',
          100: '#b3ede7',
          200: '#80e1d7',
          300: '#4dd5c7',
          400: '#3cc9bb',
          500: '#35b3a7',
          600: '#2e9d93',
          700: '#27877f',
          800: '#20716b',
          900: '#195b57',
        },
        orange: {
          50: '#FFF3EF',
          400: '#FF8C42',
          500: '#FF8C42',
          600: '#E65F2F',
          700: '#CC5329',
        },
        blue: {
          50: '#E6F0F8',
          400: '#4A90E2',
          500: '#4A90E2',
          600: '#3A7BC8',
          700: '#2A66AE',
        },
        purple: {
          400: '#9B8EF5',
          500: '#7B68EE',
          600: '#6A5ADB',
        },
        success: {
          500: '#48BB78',
        },
        error: {
          500: '#F56565',
        },
        warning: {
          500: '#ECC94B',
        },
        info: {
          500: '#4299E1',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;

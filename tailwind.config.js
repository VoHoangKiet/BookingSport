/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          primary: '#059669',
          secondary: '#6B7280',
          success: '#059669',
          warning: '#D97706',
          danger: '#DC2626',
          bg: '#F9FAFB',
          surface: '#FFFFFF',
          border: '#E5E7EB',
          text: '#111827',
          muted: '#6B7280'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'bounce-delay-0': 'bounce 1s ease-in-out infinite',
        'bounce-delay-150': 'bounce 1s ease-in-out 0.15s infinite',
        'bounce-delay-300': 'bounce 1s ease-in-out 0.3s infinite',
        'shimmer': 'shimmer 2s infinite',
        'shimmer-bg': 'shimmerBg 2s ease-in-out infinite',
        'progress': 'progress 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out 1.5s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        shimmerBg: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        progress: {
          '0%': { width: '0%', marginLeft: '0%' },
          '50%': { width: '70%', marginLeft: '30%' },
          '100%': { width: '0%', marginLeft: '100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(10deg)' },
        },
      },
      backgroundSize: {
        'shimmer': '200% 100%',
      },
    },
  },
  plugins: [],
}

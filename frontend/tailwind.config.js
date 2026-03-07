/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    DEFAULT: '#001F3F',
                    50: '#E6EBF2',
                    100: '#B3C2D9',
                    200: '#8099BF',
                    300: '#4D70A6',
                    400: '#1A478C',
                    500: '#001F3F',
                    600: '#001933',
                    700: '#001326',
                    800: '#000D1A',
                    900: '#00060D',
                },
                teal: {
                    DEFAULT: '#008080',
                    50: '#E6F5F5',
                    100: '#B3E0E0',
                    200: '#80CCCC',
                    300: '#4DB8B8',
                    400: '#1AA3A3',
                    500: '#008080',
                    600: '#006B6B',
                    700: '#005555',
                    800: '#004040',
                    900: '#002A2A',
                },
                accent: {
                    cyan: '#00D4FF',
                    emerald: '#10B981',
                    amber: '#F59E0B',
                    rose: '#F43F5E',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(135deg, #001F3F 0%, #001224 50%, #002A2A 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
                'teal-gradient': 'linear-gradient(135deg, #008080 0%, #00B3B3 100%)',
                'card-gradient': 'linear-gradient(180deg, rgba(0,128,128,0.08) 0%, rgba(0,31,63,0.04) 100%)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delay': 'float 6s ease-in-out 2s infinite',
                'float-slow': 'float 8s ease-in-out 1s infinite',
                'pulse-ring': 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                'gradient-shift': 'gradient-shift 8s ease infinite',
                'fade-up': 'fade-up 0.8s ease-out forwards',
                'fade-up-delay-1': 'fade-up 0.8s ease-out 0.15s forwards',
                'fade-up-delay-2': 'fade-up 0.8s ease-out 0.3s forwards',
                'fade-up-delay-3': 'fade-up 0.8s ease-out 0.45s forwards',
                'spin-slow': 'spin 20s linear infinite',
                'dash': 'dash 2s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-ring': {
                    '0%': { transform: 'scale(0.8)', opacity: '1' },
                    '80%, 100%': { transform: 'scale(2.2)', opacity: '0' },
                },
                'gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                dash: {
                    '0%': { strokeDashoffset: '1000' },
                    '100%': { strokeDashoffset: '0' },
                },
                glow: {
                    '0%': { filter: 'drop-shadow(0 0 2px rgba(0, 212, 255, 0.4))' },
                    '100%': { filter: 'drop-shadow(0 0 12px rgba(0, 212, 255, 0.8))' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}

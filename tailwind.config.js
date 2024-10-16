/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '960px',
      xl: '1200px',
    },
    fontFamily: {
      text: ['Inter', 'sans-serif'],
      textBd: ['Inter-Bold', 'sans-serif']
    },
    extend: {
      colors: {
        border: 'rgb(60, 63, 67)',
        text: "#e9ebf0",
        borderGold: 'rgb(189, 124, 64)',
        themeColor: '#bd7c40',
        bg: '#202124',
        boardBg: '#303135',
        lightTheme: 'rgb(220, 130, 40)'
      },
      spacing: {
        calc: 'calc(100% - 48px)'        
      },
      backgroundImage: {
        logoSm: "url('./assets/logo-wordless.png')",
        logo: "url('./assets/logo.png')",
      },
    },
  },
  plugins: [],
}


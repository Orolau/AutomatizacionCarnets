/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'AzulUtad' : "#212A77",
      },
      fontSize: {
        'xxs': '0.6rem',
        'xxxs': '0.5rem' 
      },
    },
  },
  plugins: [],
};

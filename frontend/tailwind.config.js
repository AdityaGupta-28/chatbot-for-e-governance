
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563eb', // Vibrant Blue
                secondary: '#7c3aed', // Viking Violet
                accent: '#f59e0b', // Amber
                dark: '#0f172a', // Slate 900
                light: '#f1f5f9', // Slate 100
                success: '#10b981', // Emerald
                error: '#ef4444', // Red
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}

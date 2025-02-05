/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", "sans-serif"],
        "poppins-light": ["Poppins-Light", "sans-serif"],
        "poppins-regular": ["Poppins-Regular", "sans-serif"],
        "poppins-medium": ["Poppins-Medium", "sans-serif"],
        "poppins-semibold": ["Poppins-SemiBold", "sans-serif"],
        "poppins-bold": ["Poppins-Bold", "sans-serif"],
        "quicksand-light": ["Quicksand-Light", "sans-serif"],
        "quicksand-regular": ["Quicksand-Regular", "sans-serif"],
        "quicksand-medium": ["Quicksand-Medium", "sans-serif"],
        "quicksand-semibold": ["Quicksand-SemiBold", "sans-serif"],
        "quicksand-bold": ["Quicksand-Bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};

module.exports = {
  purge: {
    enabled: true,
    content: ["./app/**/*.html", "./app/assets/style/**/*.scss", "./app/**/*.js", "./app/**/*.ejs"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: "0"
      },
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1440px',
    },
    colors: {
      primary: '#00807E',
      secondary: '#64C3BF',
      danger: '#dc3545',
      white: '#ffffff',
      'gray-100': '#F7F7F7',
      'gray-200': '#FAFAFA',
      'gray-400': '#CED4DA',
      'gray-500': '#818A91',
    },
    boxShadow: {
      DEFAULT: '0px 3px 6px #00000029',
    },
    fontSize: {
      xs: '.75rem',
      tiny: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    extend: {
      spacing: {
        13: '3.25rem',
        14: '3.5rem',
        15: '3.75rem',
        25: '6.25rem',
        30: '7.5rem',
      },
      height: {
        45: '11.25rem',
      },
      maxWidth: {
        230: '57.5rem',
      },
      borderWidth: {
        3: '3px',
      },
      borderRadius: {
        5: '5px',
      },
    },
  },
  variants: {
    extend: {},
    opacity: ['hover'],
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          '@screen sm': {
            maxWidth: '540px',
          },
          '@screen md': {
            maxWidth: '720px',
          },
          '@screen lg': {
            maxWidth: '960px',
          },
          '@screen xl': {
            maxWidth: '1140px',
          },
        },
      });
    },
  ],
};

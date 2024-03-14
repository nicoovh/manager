/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'var(--ods-color-text-500)',
        primary: {
          DEFAULT: 'var(--ods-color-primary-500)',
          foreground: 'hsl(var(--primary-foreground))',
          '000': 'var(--ods-color-primary-000)',
          '000-contrasted': 'var(--ods-color-primary-000-contrasted)',
          '50': '#f5feff',
          '050-contrasted': 'var(--ods-color-primary-050-contrasted)',
          '100': 'var(--ods-color-primary-100)',
          '100-contrasted': 'var(--ods-color-primary-100-contrasted)',
          '200': 'var(--ods-color-primary-200)',
          '200-contrasted': 'var(--ods-color-primary-200-contrasted)',
          '300': 'var(--ods-color-primary-300)',
          '300-contrasted': 'var(--ods-color-primary-300-contrasted)',
          '400': 'var(--ods-color-primary-400)',
          '400-contrasted': 'var(--ods-color-primary-400-contrasted)',
          '500': 'var(--ods-color-primary-500)',
          '500-contrasted': 'var(--ods-color-primary-500-contrasted)',
          '600': 'var(--ods-color-primary-600)',
          '600-contrasted': 'var(--ods-color-primary-600-contrasted)',
          '700': 'var(--ods-color-primary-700)',
          '700-contrasted': 'var(--ods-color-primary-700-contrasted)',
          '800': 'var(--ods-color-primary-800)',
          '800-contrasted': 'var(--ods-color-primary-800-contrasted)',
          '900': 'var(--ods-color-primary-900)',
          '900-contrasted': 'var(--ods-color-primary-900-contrasted)',
        },
        gray: {
          '000': 'var(--ods-color-gray-000)',
          '000-contrasted': 'var(--ods-color-gray-000-contrasted)',
          '050': 'var(--ods-color-gray-050)',
          '050-contrasted': 'var(--ods-color-gray-050-contrasted)',
          '100': 'var(--ods-color-gray-100)',
          '100-contrasted': 'var(--ods-color-gray-100-contrasted)',
          '200': 'var(--ods-color-gray-200)',
          '200-contrasted': 'var(--ods-color-gray-200-contrasted)',
          '300': 'var(--ods-color-gray-300)',
          '300-contrasted': 'var(--ods-color-gray-300-contrasted)',
          '400': 'var(--ods-color-gray-400)',
          '400-contrasted': 'var(--ods-color-gray-400-contrasted)',
          '500': 'var(--ods-color-gray-500)',
          '500-contrasted': 'var(--ods-color-gray-500-contrasted)',
          '600': 'var(--ods-color-gray-600)',
          '600-contrasted': 'var(--ods-color-gray-600-contrasted)',
          '700': 'var(--ods-color-gray-700)',
          '700-contrasted': 'var(--ods-color-gray-700-contrasted)',
          '800': 'var(--ods-color-gray-800)',
          '800-contrasted': 'var(--ods-color-gray-800-contrasted)',
          '900': 'var(--ods-color-gray-900)',
          '900-contrasted': 'var(--ods-color-gray-900-contrasted)',
        },
        blue: {
          '000': 'var(--ods-color-blue-000)',
          '000-contrasted': 'var(--ods-color-blue-000-contrasted)',
          '050': 'var(--ods-color-blue-050)',
          '050-contrasted': 'var(--ods-color-blue-050-contrasted)',
          '075': 'var(--ods-color-blue-075)',
          '075-contrasted': 'var(--ods-color-blue-075-contrasted)',
          '100': 'var(--ods-color-blue-100)',
          '100-contrasted': 'var(--ods-color-blue-100-contrasted)',
          '200': 'var(--ods-color-blue-200)',
          '200-contrasted': 'var(--ods-color-blue-200-contrasted)',
          '300': 'var(--ods-color-blue-300)',
          '300-contrasted': 'var(--ods-color-blue-300-contrasted)',
          '400': 'var(--ods-color-blue-400)',
          '400-contrasted': 'var(--ods-color-blue-400-contrasted)',
          '500': 'var(--ods-color-blue-500)',
          '500-contrasted': 'var(--ods-color-blue-500-contrasted)',
          '600': 'var(--ods-color-blue-600)',
          '600-contrasted': 'var(--ods-color-blue-600-contrasted)',
          '700': 'var(--ods-color-blue-700)',
          '700-contrasted': 'var(--ods-color-blue-700-contrasted)',
          '800': 'var(--ods-color-blue-800)',
          '800-contrasted': 'var(--ods-color-blue-800-contrasted)',
          '900': 'var(--ods-color-blue-900)',
          '900-contrasted': 'var(--ods-color-blue-900-contrasted)',
        },
        'gray-blue': {
          '000': 'var(--ods-color-gray-blue-000)',
          '000-contrasted': 'var(--ods-color-gray-blue-000-contrasted)',
          '100': 'var(--ods-color-gray-blue-100)',
          '100-contrasted': 'var(--ods-color-gray-blue-100-contrasted)',
          '500': 'var(--ods-color-gray-blue-500)',
          '500-contrasted': 'var(--ods-color-gray-blue-500-contrasted)',
          '900': 'var(--ods-color-gray-blue-900)',
          '900-contrasted': 'var(--ods-color-gray-blue-900-contrasted)',
        },
        red: {
          '000': 'var(--ods-color-red-000)',
          '000-contrasted': 'var(--ods-color-red-000-contrasted)',
          '050': 'var(--ods-color-red-050)',
          '050-contrasted': 'var(--ods-color-red-050-contrasted)',
          '100': 'var(--ods-color-red-100)',
          '100-contrasted': 'var(--ods-color-red-100-contrasted)',
          '200': 'var(--ods-color-red-200)',
          '200-contrasted': 'var(--ods-color-red-200-contrasted)',
          '300': 'var(--ods-color-red-300)',
          '300-contrasted': 'var(--ods-color-red-300-contrasted)',
          '400': 'var(--ods-color-red-400)',
          '400-contrasted': 'var(--ods-color-red-400-contrasted)',
          '500': 'var(--ods-color-red-500)',
          '500-contrasted': 'var(--ods-color-red-500-contrasted)',
          '600': 'var(--ods-color-red-600)',
          '600-contrasted': 'var(--ods-color-red-600-contrasted)',
          '700': 'var(--ods-color-red-700)',
          '700-contrasted': 'var(--ods-color-red-700-contrasted)',
          '800': 'var(--ods-color-red-800)',
          '800-contrasted': 'var(--ods-color-red-800-contrasted)',
          '900': 'var(--ods-color-red-900)',
          '900-contrasted': 'var(--ods-color-red-900-contrasted)',
        },
        orange: {
          '000': 'var(--ods-color-orange-000)',
          '000-contrasted': 'var(--ods-color-orange-000-contrasted)',
          '050': 'var(--ods-color-orange-050)',
          '050-contrasted': 'var(--ods-color-orange-050-contrasted)',
          '100': 'var(--ods-color-orange-100)',
          '100-contrasted': 'var(--ods-color-orange-100-contrasted)',
          '200': 'var(--ods-color-orange-200)',
          '200-contrasted': 'var(--ods-color-orange-200-contrasted)',
          '300': 'var(--ods-color-orange-300)',
          '300-contrasted': 'var(--ods-color-orange-300-contrasted)',
          '400': 'var(--ods-color-orange-400)',
          '400-contrasted': 'var(--ods-color-orange-400-contrasted)',
          '500': 'var(--ods-color-orange-500)',
          '500-contrasted': 'var(--ods-color-orange-500-contrasted)',
          '600': 'var(--ods-color-orange-600)',
          '600-contrasted': 'var(--ods-color-orange-600-contrasted)',
          '700': 'var(--ods-color-orange-700)',
          '700-contrasted': 'var(--ods-color-orange-700-contrasted)',
          '800': 'var(--ods-color-orange-800)',
          '800-contrasted': 'var(--ods-color-orange-800-contrasted)',
          '900': 'var(--ods-color-orange-900)',
          '900-contrasted': 'var(--ods-color-orange-900-contrasted)',
        },
        green: {
          '000': 'var(--ods-color-green-000)',
          '000-contrasted': 'var(--ods-color-green-000-contrasted)',
          '050': 'var(--ods-color-green-050)',
          '050-contrasted': 'var(--ods-color-green-050-contrasted)',
          '100': 'var(--ods-color-green-100)',
          '100-contrasted': 'var(--ods-color-green-100-contrasted)',
          '200': 'var(--ods-color-green-200)',
          '200-contrasted': 'var(--ods-color-green-200-contrasted)',
          '300': 'var(--ods-color-green-300)',
          '300-contrasted': 'var(--ods-color-green-300-contrasted)',
          '400': 'var(--ods-color-green-400)',
          '400-contrasted': 'var(--ods-color-green-400-contrasted)',
          '500': 'var(--ods-color-green-500)',
          '500-contrasted': 'var(--ods-color-green-500-contrasted)',
          '600': 'var(--ods-color-green-600)',
          '600-contrasted': 'var(--ods-color-green-600-contrasted)',
          '700': 'var(--ods-color-green-700)',
          '700-contrasted': 'var(--ods-color-green-700-contrasted)',
          '800': 'var(--ods-color-green-800)',
          '800-contrasted': 'var(--ods-color-green-800-contrasted)',
          '900': 'var(--ods-color-green-900)',
          '900-contrasted': 'var(--ods-color-green-900-contrasted)',
        },
        pink: {
          '000': 'var(--ods-color-pink-000)',
          '000-contrasted': 'var(--ods-color-pink-000-contrasted)',
          '050': 'var(--ods-color-pink-050)',
          '050-contrasted': 'var(--ods-color-pink-050-contrasted)',
          '100': 'var(--ods-color-pink-100)',
          '100-contrasted': 'var(--ods-color-pink-100-contrasted)',
          '200': 'var(--ods-color-pink-200)',
          '200-contrasted': 'var(--ods-color-pink-200-contrasted)',
          '300': 'var(--ods-color-pink-300)',
          '300-contrasted': 'var(--ods-color-pink-300-contrasted)',
          '400': 'var(--ods-color-pink-400)',
          '400-contrasted': 'var(--ods-color-pink-400-contrasted)',
          '500': 'var(--ods-color-pink-500)',
          '500-contrasted': 'var(--ods-color-pink-500-contrasted)',
          '600': 'var(--ods-color-pink-600)',
          '600-contrasted': 'var(--ods-color-pink-600-contrasted)',
          '700': 'var(--ods-color-pink-700)',
          '700-contrasted': 'var(--ods-color-pink-700-contrasted)',
          '800': 'var(--ods-color-pink-800)',
          '800-contrasted': 'var(--ods-color-pink-800-contrasted)',
          '900': 'var(--ods-color-pink-900)',
          '900-contrasted': 'var(--ods-color-pink-900-contrasted)',
        },
        secondary: {
          DEFAULT: 'var(--ods-color-secondary-500))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'var(--ods-color-primary-500)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'var(--ods-color-text-500)',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'var(--ods-color-text-500)',
        },
      },
      borderRadius: {
        sm: 'var(--ods-size-border-radius-01)',
        DEFAULT: 'var(--ods-size-border-radius-01)',
        md: 'var(--ods-size-border-radius-02)',
        lg: 'var(--ods-size-border-radius-02)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // eslint-disable-next-line global-require
  plugins: [require('tailwindcss-animate')],
};

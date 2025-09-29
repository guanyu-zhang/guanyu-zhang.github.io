import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        invert: {
          css: {
            'pre': {
              backgroundColor: theme('colors.neutral.900'),
              border: `1px solid ${theme('colors.neutral.700')}`,
              borderRadius: theme('borderRadius.lg'),
            },
            'a': {
              color: theme('colors.cyan.400'),
              textDecoration: 'none',
              '&:hover': {
                color: theme('colors.cyan.300'),
                textDecoration: 'underline',
              },
              '&:active': {
                color: theme('colors.cyan.500'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#050914',
        surface: '#08111f',
        'surface-2': '#0b1628',
        blue: {
          qci: '#2f80ed'
        },
        gold: {
          duck: '#f6c453'
        },
        cyan: {
          quantum: '#7dd3fc'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'SFMono-Regular',
          'Cascadia Code',
          'Liberation Mono',
          'monospace'
        ]
      },
      boxShadow: {
        'blue-glow': '0 0 36px rgba(47, 128, 237, 0.22)',
        'gold-glow': '0 0 30px rgba(246, 196, 83, 0.2)'
      },
      backgroundImage: {
        'radial-pond':
          'radial-gradient(circle at 50% 35%, rgba(47,128,237,0.2), rgba(5,9,20,0) 40%)',
        'grid-faint':
          'linear-gradient(rgba(125,211,252,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.045) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};

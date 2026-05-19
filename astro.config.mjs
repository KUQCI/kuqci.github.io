import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  integrations: [
    react(),
    mdx(),
    tailwind({
      applyBaseStyles: false
    })
  ]
  // TODO: Set `site` before production deployment.
  // Organization repo example: site: 'https://qci.github.io'
  // Project repo example: site: 'https://qci.github.io', base: '/qci-site'
});

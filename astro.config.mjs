import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

const site = process.env.ASTRO_SITE;
const base = process.env.ASTRO_BASE;

export default defineConfig({
  output: 'static',
  ...(site ? { site } : {}),
  ...(base ? { base } : {}),
  integrations: [
    react(),
    mdx(),
    tailwind({
      applyBaseStyles: false
    })
  ]
  // TODO: Set `ASTRO_SITE` and `ASTRO_BASE` in CI or hard-code them here before production.
  // Organization repo example: ASTRO_SITE='https://qci.github.io' with no ASTRO_BASE.
  // Project repo example: ASTRO_SITE='https://qci.github.io' and ASTRO_BASE='/qci-site'.
});

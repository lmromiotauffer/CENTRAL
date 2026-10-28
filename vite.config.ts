import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import path from 'node:path';

const pluginMdx = mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] });

export default defineConfig({
  plugins: [
    {
      ...pluginMdx,
      enforce: 'pre',
      // O filtro do plugin descarta a query: sem isto, `.mdx?raw` vira componente no vitest e a busca perde o texto.
      transform(codigo, id) {
        if (id.includes('?raw')) return;
        return pluginMdx.transform.call(this, codigo, id);
      },
    },
    react(),
  ],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});

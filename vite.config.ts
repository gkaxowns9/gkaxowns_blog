import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from "@prerenderer/rollup-plugin";

const postsDir = path.resolve(__dirname, 'src', 'posts');

function generateSlug(fileName: string) {
  return fileName
    .replace(/\.md$/, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[\[\]\(\)\{\}]/g, '')
    .replace(/[?,.:;'"!@#$%^&*]/g, '');
}

function getPostStatus(rawContent: string) {
  const lines = rawContent.split('\n');
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim();
    if (line.startsWith('상태:')) {
      return line.substring(3).trim();
    }
  }
  return '';
}

const post_list = fs.readdirSync(postsDir)
  .filter(fileName => fileName.endsWith('.md'))
  .map(fileName => {
    const rawContent = fs.readFileSync(path.join(postsDir, fileName), 'utf-8');
    const status = getPostStatus(rawContent);
    const slug = generateSlug(fileName);
    return status === '정리 완료' ? `/post/${slug}` : null;
  })
  .filter((route): route is string => route !== null);

console.log('Prerendering the following routes:', post_list);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes: post_list,
      renderer: "@prerenderer/renderer-puppeteer",
      server: {
        port: 5173,
        host: "localhost",
      },
      rendererOptions: {
        maxConcurrentRoutes: 1,
        renderAfterDocumentEvent: "render-event",
        renderAfterTime: 500,
        timeout: 120000,
        skipThirdPartyRequests: true,
        launchOptions: {
          args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
      postProcess(renderedRoute) {
        renderedRoute.html = renderedRoute.html
          .replace(/http:/i, "https:")
          .replace(
            /(https:\/\/)?(localhost|127\.0\.0\.1):\d*/i,
            "https://gkaxowns-blog.netlify.app/"
          );
      },
    }),
  ],
});
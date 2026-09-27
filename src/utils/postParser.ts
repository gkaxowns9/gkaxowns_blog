export interface PostMetadata {
  title: string;
  date: string;
  status: string;
  tags: string[];
}

export interface Post extends PostMetadata {
  slug: string;
  content: string;
}

// Function to generate web-friendly slugs from filenames/titles
export function generateSlug(filename: string): string {
  // Remove .md extension
  const baseName = filename.replace(/\.md$/, '');
  // Replace spaces and special characters to make it cleaner, but preserve Korean characters
  return baseName
    .trim()
    .replace(/\s+/g, '-')             // Replace spaces with -
    .replace(/[\[\]\(\)\{\}]/g, '')   // Remove brackets
    .replace(/[?,.:;'"!@#$%^&*]/g, ''); // Remove general special chars
}

// Parse a YAML front matter value: "string" or ["a", "b"]
function parseFrontMatterValue(value: string): string | string[] {
  const v = value.trim();
  if (v.startsWith('[')) {
    try {
      return JSON.parse(v);
    } catch {
      return v.slice(1, -1).split(',').map(t => t.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    }
  }
  if (v.startsWith('"')) {
    try {
      return JSON.parse(v);
    } catch {
      return v.slice(1, -1);
    }
  }
  return v.replace(/^'|'$/g, '');
}

export function parseMarkdown(fileName: string, rawContent: string): Post {
  const lines = rawContent.replace(/\r\n/g, '\n').split('\n');

  let title = fileName.replace(/\.md$/, '');
  let date = '';
  let status = '';
  let tags: string[] = [];

  let metadataEndIndex = 0;

  // Parse YAML front matter between the leading '---' lines
  if (lines[0]?.trim() === '---') {
    const closeIndex = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
    if (closeIndex > 0) {
      for (const line of lines.slice(1, closeIndex)) {
        const sep = line.indexOf(':');
        if (sep === -1) continue;
        const key = line.slice(0, sep).trim();
        const value = parseFrontMatterValue(line.slice(sep + 1));

        if (key === 'title') title = String(value);
        else if (key === 'date') date = String(value);
        else if (key === 'status') status = String(value);
        else if (key === 'tags') tags = Array.isArray(value) ? value : String(value).split(',').map(t => t.trim()).filter(Boolean);
      }
      metadataEndIndex = closeIndex + 1;
    }
  }

  // Get the main content, skipping the metadata section and any empty lines immediately following it
  let contentStartLine = metadataEndIndex;
  while (contentStartLine < lines.length && lines[contentStartLine].trim() === '') {
    contentStartLine++;
  }

  const content = lines.slice(contentStartLine).join('\n');
  const slug = generateSlug(fileName);

  return {
    title,
    date,
    status,
    tags,
    slug,
    content
  };
}

// Format an ISO date ("2025-01-14T17:23:00") for display: "2025년 1월 14일 오후 5:23"
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (!dateStr || isNaN(d.getTime())) return dateStr;
  const hours = d.getHours();
  const ampm = hours < 12 ? '오전' : '오후';
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${ampm} ${h12}:${minutes}`;
}

// Eagerly load all markdown posts using Vite's import.meta.glob
export function getAllPosts(): Post[] {
  // Vite import.meta.glob loads markdown files as raw strings
  const publicModules = import.meta.glob(['/public/posts/*.md', '../../public/posts/*.md'], { query: '?raw', eager: true }) as Record<string, { default: string }>;
  const srcModules = import.meta.glob('../posts/*.md', { query: '?raw', eager: true }) as Record<string, { default: string }>;
  const modules = { ...srcModules, ...publicModules };
  
  const seenFileNames = new Set<string>();
  const posts: Post[] = [];

  for (const path in modules) {
    const fileName = path.split('/').pop() || '';
    if (!fileName || seenFileNames.has(fileName)) continue;
    seenFileNames.add(fileName);

    const rawContent = modules[path].default || '';
    
    if (rawContent) {
      const parsedPost = parseMarkdown(fileName, rawContent);
      posts.push(parsedPost);
    }
  }

  // Sort posts by date (newest first). Dates are ISO 8601 local time strings.
  const toTime = (dateStr: string) => {
    const time = new Date(dateStr).getTime();
    return isNaN(time) ? 0 : time;
  };
  return posts.sort((a, b) => toTime(b.date) - toTime(a.date));
}

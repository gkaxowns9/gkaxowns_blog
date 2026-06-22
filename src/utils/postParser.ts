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

export function parseMarkdown(fileName: string, rawContent: string): Post {
  const lines = rawContent.split('\n');
  
  let title = fileName.replace(/\.md$/, '');
  let date = '';
  let status = '';
  let tags: string[] = [];
  
  let metadataEndIndex = 0;
  
  // Parse the first few lines for metadata
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('# ')) {
      title = line.substring(2).trim();
      metadataEndIndex = i + 1;
    } else if (line.startsWith('생성일:')) {
      date = line.substring(4).trim();
      metadataEndIndex = i + 1;
    } else if (line.startsWith('상태:')) {
      status = line.substring(3).trim();
      metadataEndIndex = i + 1;
    } else if (line.startsWith('태그:')) {
      const tagsStr = line.substring(3).trim();
      tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];
      metadataEndIndex = i + 1;
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

// Eagerly load all markdown posts using Vite's import.meta.glob
export function getAllPosts(): Post[] {
  // Vite import.meta.glob loads markdown files as raw strings
  const modules = import.meta.glob('../posts/*.md', { query: '?raw', eager: true }) as Record<string, { default: string }>;
  
  const posts: Post[] = [];

  for (const path in modules) {
    const fileName = path.split('/').pop() || '';
    const rawContent = modules[path].default || '';
    
    if (rawContent) {
      const parsedPost = parseMarkdown(fileName, rawContent);
      posts.push(parsedPost);
    }
  }

  // Sort posts by date (newest first). Since Notion dates are string like "2025년 1월 9일 오후 6:58",
  // we will try to parse them. If parsing fails, we fallback to slug sorting.
  return posts.sort((a, b) => {
    const parseNotionDate = (dateStr: string) => {
      if (!dateStr) return new Date(0);
      try {
        // e.g., "2025년 1월 9일 오후 6:58" -> convert to ISO/standard format
        // PM/AM check
        const isPM = dateStr.includes('오후');
        const cleanedStr = dateStr
          .replace('년', '-')
          .replace('월', '-')
          .replace('일', '')
          .replace('오전', '')
          .replace('오후', '')
          .replace(/\s+/g, ' ')
          .trim();
        
        const [datePart, timePart] = cleanedStr.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        
        let hours = 0;
        let minutes = 0;
        if (timePart) {
          const parts = timePart.split(':').map(Number);
          hours = parts[0] || 0;
          minutes = parts[1] || 0;
        }
        
        if (isPM && hours < 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;
        
        return new Date(year, month - 1, day, hours, minutes);
      } catch (e) {
        return new Date(0);
      }
    };

    return parseNotionDate(b.date).getTime() - parseNotionDate(a.date).getTime();
  });
}

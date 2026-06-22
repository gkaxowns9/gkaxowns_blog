import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Calendar, Tag, Inbox } from 'lucide-react';
import { getAllPosts } from '../utils/postParser';

// Excerpt generator to strip markdown formatting
function getExcerpt(content: string, maxLength = 120): string {
  const clean = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Convert links to plain text
    .replace(/`{3,}[\s\S]*?`{3,}/g, '') // Remove code blocks
    .replace(/`.*?`/g, '') // Remove inline code
    .replace(/#+\s+/g, '') // Remove headers
    .replace(/[*\-_>~|]/g, '') // Remove markup indicators
    .replace(/\s+/g, ' ') // Collapse whitespaces
    .trim();
  
  return clean.length > maxLength ? clean.substring(0, maxLength) + '...' : clean;
}

export default function Home() {
  const allPosts = useMemo(() => getAllPosts(), []);
  
  // 정리 완료 글만 가져옴
  const publishedPosts = useMemo(() => {
    return allPosts.filter(post => post.status === '정리 완료');
  }, [allPosts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Dynamically extract all unique tags from published posts
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    publishedPosts.forEach(post => {
      post.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [publishedPosts]);

  // Filter posts based on search query and selected tag
  const filteredPosts = useMemo(() => {
    return publishedPosts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
      
      return matchesSearch && matchesTag;
    });
  }, [publishedPosts, searchQuery, selectedTag]);

  return (
    <div className="container">
      {/* Dynamic SEO Meta Tags for Home Page */}
      <Helmet>
        <title>gkaxowns - 함태준 블로그</title>
        <meta name="description" content="개발, 정리, 배움 블로그" />
        <meta property="og:title" content="gkaxowns - 함태준 블로그" />
        <meta property="og:description" content="개발, 정리, 배움 블로그" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="hero">
        <h1>함태준 블로그</h1>
        <p>스스로 공부하여 정리한 내용과 경험한 문제, 풀이 등을 공유</p>

        {/* Search Input */}
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="포스트 제목, 내용, 태그 검색..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      <div className="posts-grid">
        {filteredPosts.length > 0 ? 
            filteredPosts.map(post => (
              <div className="post-card">
                <div className="post-card-meta">
                  <span className="meta-item">
                    <Calendar size={14} />
                    {post.date || '날짜 없음'}
                  </span>
                </div>
                <Link to={`/post/${post.slug}`} key={post.slug}>
                  <h2 className="post-card-title">{post.title}</h2>
                  <p className="post-card-excerpt">
                    {getExcerpt(post.content)}
                  </p>
                </Link>
                <div className="post-card-tags">
                {post.tags.map(tag => (
                  <button key={tag} className="card-tag" onClick={() => setSelectedTag(tag)}>#{tag}</button>
                ))}
              </div>
              </div>
            )
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)',
            color: 'var(--text-secondary)'
          }}>
            <Inbox size={48} style={{ marginBottom: '1rem', strokeWidth: '1.5px', color: 'var(--accent)' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>조건에 맞는 포스트를 찾을 수 없습니다.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>다른 키워드로 검색해 보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}

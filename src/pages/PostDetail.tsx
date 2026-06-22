import { useMemo, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import dracula from 'react-syntax-highlighter/dist/esm/styles/prism/dracula';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { ArrowLeft, Calendar } from 'lucide-react';
import { getAllPosts } from '../utils/postParser';

// Helper to strip markdown for meta description
function getMetaDescription(content: string): string {
  const clean = content
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/`{3,}[\s\S]*?`{3,}/g, '')
    .replace(/#+\s+/g, '')
    .replace(/[*\-_>~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.substring(0, 150) + '...';
}

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();

  // Load posts
  const { post, prevPost, nextPost } = useMemo(() => {
    const allPosts = getAllPosts().filter(p => p.status === '정리 완료');
    const currentIndex = allPosts.findIndex(p => p.slug === slug);
    
    if (currentIndex === -1) {
      return { post: null, prevPost: null, nextPost: null };
    }
    
    return {
      post: allPosts[currentIndex],
      // Since sorted newest first, index + 1 is older post (prev), index - 1 is newer post (next)
      prevPost: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
      nextPost: currentIndex > 0 ? allPosts[currentIndex - 1] : null
    };
  }, [slug]);

  // Handle image path replacement (../img/ -> /img/)
  const processedContent = useMemo(() => {
    if (!post) return '';
    return post.content.replace(/\.\.\/img\//g, '/img/');
  }, [post]);

  // Extract table of contents (H2 and H3 headers)
  const toc = useMemo(() => {
    if (!processedContent) return [];
    
    const reg = /^(##|###)\s+(.*)$/gm;
    const items: { level: number; text: string; id: string }[] = [];
    let match;
    
    while ((match = reg.exec(processedContent)) !== null) {
      const level = match[1].length; // 2 or 3
      const text = match[2].replace(/[#`*_\[\]]/g, '').trim(); // Clean markdown markup from title
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣-]/g, '');
      items.push({ level, text, id });
    }
    
    return items;
  }, [processedContent]);

  // Track active header in viewport
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!toc.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find(entry => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: '-100px 0px -40% 0px', threshold: 0.1 }
    );

    toc.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc, processedContent]);

  if (!post) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>
          포스트를 찾을 수 없습니다.
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          찾으시는 글이 삭제되었거나 경로가 잘못되었습니다.
        </p>
        <Link to="/" className="post-back-link">
          <ArrowLeft size={16} />
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const metaDesc = getMetaDescription(post.content);

  const handleTocClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  return (
    <div className="container">
      {/* Dynamic SEO Meta tags for Post Detail */}
      <Helmet>
        <title>{post.title} - gkaxowns</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={`${post.title} - gkaxowns`} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:article:published_time" content={post.date} />
      </Helmet>

      {/* Back Link */}
      <div style={{ paddingTop: '3rem' }}>
        <Link to="/" className="post-back-link">
          <ArrowLeft size={16} />
          글 목록으로 돌아가기
        </Link>
      </div>

      <div className="post-detail-layout">
        {/* Post Contents */}
        <article style={{ minWidth: 0 }}>
          {/* Post Header */}
          <header className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta-info">
              <span className="meta-item">
                <Calendar size={16} style={{ color: 'var(--accent)' }} />
                {post.date}
              </span>
              <div className="post-card-tags" style={{ margin: 0 }}>
                {post.tags.map(tag => (
                  <span key={tag} className="card-tag">#{tag}</span>
                ))}
              </div>
            </div>
          </header>

          {/* Post Body (Markdown) */}
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h2: ({ node, children, ...props }) => {
                  const text = String(children).replace(/[#`*_\[\]]/g, '').trim();
                  const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣-]/g, '');
                  return <h2 id={id} {...props}>{children}</h2>;
                },
                h3: ({ node, children, ...props }) => {
                  const text = String(children).replace(/[#`*_\[\]]/g, '').trim();
                  const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣-]/g, '');
                  return <h3 id={id} {...props}>{children}</h3>;
                },
                code: ({ node, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  
                  return match ? (
                    <SyntaxHighlighter
                      style={dracula} // TODO: 에러 수정
                      language={match[1] || ''}
                      PreTag="div"
                      children={String(children).replace(/\n$/, '')}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {processedContent}
            </ReactMarkdown>
          </div>

          {/* Post Navigation */}
          <nav className="post-navigation">
            {prevPost ? (
              <Link to={`/post/${prevPost.slug}`} className="nav-link-card">
                <span className="nav-link-label">이전 글</span>
                <span className="nav-link-title">{prevPost.title}</span>
              </Link>
            ) : (
              <div style={{ flex: 1 }} />
            )}

            {nextPost ? (
              <Link to={`/post/${nextPost.slug}`} className="nav-link-card next">
                <span className="nav-link-label">다음 글</span>
                <span className="nav-link-title">{nextPost.title}</span>
              </Link>
            ) : (
              <div style={{ flex: 1 }} />
            )}
          </nav>
        </article>

        {/* TOC Sidebar */}
        {toc.length > 0 && (
          <aside className="toc-sidebar">
            <div className="toc-card">
              <h4 style={{ fontFamily: 'var(--font-title)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                목차
              </h4>
              <ul className="toc-list">
                {toc.map((item, idx) => (
                  <li key={idx} className="toc-item">
                    <span
                      onClick={() => handleTocClick(item.id)}
                      className={`toc-link ${item.level === 2 ? 'h2' : 'h3'} ${activeId === item.id ? 'active' : ''}`}
                    >
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

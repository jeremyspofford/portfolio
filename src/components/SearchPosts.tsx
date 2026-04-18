"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export function SearchPosts({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState('');

  const filteredPosts = posts.filter((post) => {
    const searchContent = `${post.title} ${post.description} ${post.tags.join(' ')}`.toLowerCase();
    return searchContent.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint w-5 h-5" />
        <input
          type="text"
          placeholder="Search posts by title, description, or tags..."
          className="w-full pl-10 pr-4 py-3 rounded border border-border-primary bg-bg-muted text-text-primary focus:border-text-primary outline-none transition-colors placeholder:text-text-faint"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="space-y-7">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block py-3 border-b border-border-primary last:border-0"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                <h2 className="font-display font-semibold text-[17px] text-text-primary group-hover:underline underline-offset-4">
                  {post.title}
                </h2>
                <span className="text-[13px] font-mono text-text-faint shrink-0 mt-1 md:mt-0">
                  {post.date}
                </span>
              </div>
              <p className="text-[15px] leading-relaxed text-text-body mb-2 line-clamp-2 max-w-[65ch]">
                {post.description}
              </p>
              <div className="flex gap-3 flex-wrap">
                {post.tags.map(tag => (
                  <span key={tag} className="font-mono text-[11px] text-text-faint">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 text-text-muted">
            No posts found matching &quot;{query}&quot;
          </div>
        )}
      </div>
    </div>
  );
}

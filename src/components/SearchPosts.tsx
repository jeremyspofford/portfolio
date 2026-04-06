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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] w-5 h-5" />
        <input
          type="text"
          placeholder="Search posts by title, description, or tags..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1E293B] bg-[#111827] text-[#F1F5F9] focus:ring-2 focus:ring-[#22D3EE] focus:border-transparent outline-none transition-all placeholder:text-[#475569]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block p-6 bg-[#111827] hover:bg-[#1F2B45] border border-[#1E293B] hover:border-[#22D3EE]/40 rounded-xl transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-3">
                <h2 className="text-xl font-bold text-[#F1F5F9] group-hover:text-[#22D3EE] transition-colors">
                  {post.title}
                </h2>
                <span className="text-sm font-mono text-[#475569] shrink-0 mt-1 md:mt-0">
                  {post.date}
                </span>
              </div>
              <p className="text-[#94A3B8] mb-4 line-clamp-2 leading-relaxed">
                {post.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-md bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 text-[#475569]">
            No posts found matching &quot;{query}&quot;
          </div>
        )}
      </div>
    </div>
  );
}

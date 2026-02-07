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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search posts by title, description, or tags..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900"
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
              className="group block p-6 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-indigo-500 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-3">
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h2>
                <span className="text-sm font-mono text-slate-500 shrink-0 mt-1 md:mt-0">
                  {post.date}
                </span>
              </div>
              <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                {post.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            No posts found matching &quot;{query}&quot;
          </div>
        )}
      </div>
    </div>
  );
}

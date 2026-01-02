import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { ArrowLeft } from 'lucide-react';

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-6 md:p-12 space-y-12">
      <div className="space-y-4">
        <Link 
          href="/"
          className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portfolio
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
          Latest Thoughts
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Musings on DevOps, AI, and building for the modern web.
        </p>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group block p-6 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                {post.title}
              </h2>
              <span className="text-sm font-mono text-slate-500 dark:text-slate-400 shrink-0 mt-1 md:mt-0">
                {post.date}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">
              {post.description}
            </p>
            <div className="flex gap-2 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-400/40 font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

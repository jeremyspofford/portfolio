import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { ArrowLeft } from 'lucide-react';
import { SearchPosts } from '@/components/SearchPosts';

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col w-full max-w-doc mx-auto px-6 py-12 space-y-10">
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portfolio
        </Link>
        <h1 className="font-display font-semibold text-[28px] text-text-primary">
          Writing
        </h1>
        <p className="text-[15px] leading-relaxed text-text-body max-w-[65ch]">
          Occasional notes on DevOps patterns, AI infrastructure, and the in-progress pivot from platform DevOps into AI/ML platform work. More as I have things worth saying.
        </p>
      </div>

      <SearchPosts posts={posts} />
    </div>
  );
}

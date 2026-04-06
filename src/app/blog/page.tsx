import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { ArrowLeft } from 'lucide-react';
import { SearchPosts } from '@/components/SearchPosts';

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto p-6 md:p-12 pt-24 space-y-12">
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-[#94A3B8] hover:text-[#22D3EE] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portfolio
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-[#F1F5F9]">
          Latest Thoughts
        </h1>
        <p className="text-[#94A3B8] text-lg">
          Musings on DevOps, AI, and building for the modern web.
        </p>
      </div>

      <SearchPosts posts={posts} />
    </div>
  );
}

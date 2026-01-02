import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="flex flex-col w-full max-w-3xl mx-auto p-6 md:p-12 space-y-8">
       <Link 
          href="/blog"
          className="inline-flex items-center text-sm text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
      
      <header className="space-y-4 border-b border-slate-800 pb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-100">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <div className="hidden sm:block text-slate-600">•</div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-indigo-400">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="prose prose-invert prose-lg max-w-none prose-headings:text-slate-100 prose-p:text-slate-300 prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-code:text-emerald-400 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}

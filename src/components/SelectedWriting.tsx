import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export function SelectedWriting() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section id="selected-writing" className="w-full">
      <div className="mx-auto max-w-doc px-6 py-12 border-t border-border-primary">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-faint mb-5">
          Recent Writing
        </h2>
        <div className="space-y-5 max-w-[65ch]">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-1">
                <h3 className="font-display font-semibold text-[17px] text-text-primary group-hover:underline underline-offset-4">
                  {post.title}
                </h3>
                <span className="text-[13px] font-mono text-text-faint shrink-0 mt-1 md:mt-0 md:ml-4">
                  {post.date}
                </span>
              </div>
              <p className="text-[14px] leading-relaxed text-text-muted line-clamp-2">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
        <Link
          href="/blog"
          className="mt-7 inline-block text-[13px] font-mono text-text-muted hover:text-text-primary underline underline-offset-4 decoration-text-faint hover:decoration-text-primary"
        >
          All posts →
        </Link>
      </div>
    </section>
  );
}

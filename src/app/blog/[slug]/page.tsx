import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'highlight.js/styles/github-dark.css'; // Add highlight.js styles

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mdxOptions: { mdxOptions: { remarkPlugins: any[]; rehypePlugins: any[] } } = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeHighlight,
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }]
      ],
    },
  };

  return (
    <article className="w-full max-w-5xl mx-auto p-4 md:p-8 pt-8 space-y-8">
       <Link 
          href="/blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
      
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
          {/* Hero Image */}
          {post.image && (
              <div className="w-full h-64 md:h-96 relative bg-zinc-100">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
              </div>
          )}

          <div className="p-8 md:p-12">
            <header className="space-y-6 mb-12 text-center max-w-2xl mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.date}>{post.date}</time>
                </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 leading-tight">
                {post.title}
                </h1>
                
                <div className="flex flex-wrap justify-center gap-2">
                    {post.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                        <Tag className="w-3 h-3" />
                        {tag}
                    </span>
                    ))}
                </div>
            </header>

            <div className="prose prose-zinc max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md
                prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
            ">
                <MDXRemote source={post.content} options={mdxOptions} />
            </div>
          </div>
      </div>
    </article>
  );
}

import { ProfileContent } from '@/lib/api';

interface FooterProps {
  profile: ProfileContent | undefined;
}

export function Footer({ profile }: FooterProps) {
  return (
    <footer className="w-full border-t border-border-primary">
      <div className="mx-auto max-w-doc px-6 py-8 text-xs font-mono text-text-muted flex flex-col sm:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} {profile?.name ?? 'Jeremy Spofford'}</span>
        <span>Built with Next.js · Deployed on Cloudflare Pages</span>
      </div>
    </footer>
  );
}

import { ProfileContent } from '@/lib/api';

interface SiteHeaderProps {
  profile: ProfileContent | undefined;
}

function getInitials(name: string | undefined): string {
  if (!name) return 'JS';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('') || 'JS';
}

export function SiteHeader({ profile }: SiteHeaderProps) {
  if (!profile) return null;
  const initials = getInitials(profile.name);

  return (
    <header className="w-full bg-header-bg">
      <div className="mx-auto max-w-doc px-6 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold text-sm bg-[#292524] text-header-fg"
          >
            {initials}
          </div>
          <div>
            <h1 className="font-display font-semibold text-[28px] leading-tight tracking-tight text-header-fg">
              {profile.name}
            </h1>
            <p className="text-sm text-header-muted mt-0.5">
              Senior DevOps Engineer · Founder of Aria Labs
            </p>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-1 text-sm pl-14 md:pl-0">
          <div className="flex items-center gap-3 text-header-muted">
            {profile.socials?.github && (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-header-fg hover:underline underline-offset-4"
              >
                GitHub
              </a>
            )}
            {profile.socials?.gitlab && (
              <>
                <span className="text-[#57534E]" aria-hidden="true">·</span>
                <a
                  href={profile.socials.gitlab}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-header-fg hover:underline underline-offset-4"
                >
                  GitLab
                </a>
              </>
            )}
            {profile.socials?.linkedin && (
              <>
                <span className="text-[#57534E]" aria-hidden="true">·</span>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-header-fg hover:underline underline-offset-4"
                >
                  LinkedIn
                </a>
              </>
            )}
          </div>
          {profile.location && (
            <span className="text-[#78716C]">{profile.location}</span>
          )}
        </div>
      </div>
    </header>
  );
}

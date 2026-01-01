import { Github, Linkedin, Mail, FileText } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroProps {
  profile: any;
}

export function Hero({ profile }: HeroProps) {
  if (!profile) return null;

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center text-center px-4">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              {profile.name}
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              {profile.title}
            </p>
             <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400 italic">
              {profile.bio}
            </p>
          </div>
          <div className="space-x-4">
            <Link
              href="/resume"
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Resume
            </Link>
             <Link
              href={`mailto:${profile.email}`}
              className={cn(
                "inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact
            </Link>
          </div>
           <div className="flex space-x-4 mt-4">
            {profile.socials?.github && (
                <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github className="h-6 w-6" />
                </a>
            )}
             {profile.socials?.linkedin && (
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-6 w-6" />
                </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

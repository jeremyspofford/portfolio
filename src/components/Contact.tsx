import { Mail, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import { ProfileContent } from "@/lib/api";

// GitLab icon (not available in lucide-react)
function GitlabIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
    </svg>
  );
}

interface ContactProps {
  profile?: ProfileContent;
}

export function Contact({ profile }: ContactProps) {
  if (!profile) return null;

  return (
    <section className="py-12 md:py-20 px-4 md:px-8 bg-white border-t border-zinc-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">Get In Touch</h2>
        <p className="text-base sm:text-lg text-zinc-600 mb-8 md:mb-12 max-w-2xl mx-auto">
          I&apos;m always open to discussing new opportunities, interesting projects, or just chatting about DevOps and Cloud architecture.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2.5 sm:p-3 bg-zinc-100 rounded-full">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="text-left">
                <p className="text-xs sm:text-sm text-zinc-500">Email Me</p>
                <a href={`mailto:${profile.email}`} className="text-sm sm:text-lg font-medium hover:text-primary transition-colors break-all">
                    {profile.email}
                </a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
             <div className="p-2.5 sm:p-3 bg-zinc-100 rounded-full">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="text-left">
                <p className="text-xs sm:text-sm text-zinc-500">Location</p>
                <p className="text-sm sm:text-lg font-medium">{profile.location || "Remote"}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 sm:gap-6">
            {profile.socials.github && (
                <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
                >
                    <Github className="w-6 h-6" />
                </a>
            )}
            {profile.socials.gitlab && (
                <a
                    href={profile.socials.gitlab}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitLab Profile"
                    className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
                >
                    <GitlabIcon className="w-6 h-6" />
                </a>
            )}
            {profile.socials.linkedin && (
                <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
                >
                    <Linkedin className="w-5 h-5" />
                </a>
            )}
             {profile.socials.twitter && (
                 <a
                    href={profile.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter Profile"
                    className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
                >
                    <Twitter className="w-5 h-5" />
                </a>
            )}
        </div>

        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-zinc-100 text-xs sm:text-sm text-zinc-500">
            © {new Date().getFullYear()} {profile.name}. All rights reserved. Built with Next.js, Tailwind, and AWS.
        </div>
      </div>
    </section>
  );
}

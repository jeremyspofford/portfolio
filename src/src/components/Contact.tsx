import { Mail, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import { ProfileContent } from "@/lib/api";

interface ContactProps {
  profile?: ProfileContent;
}

export function Contact({ profile }: ContactProps) {
  if (!profile) return null;

  return (
    <section id="contact" className="py-20 px-4 md:px-8 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
          I'm always open to discussing new opportunities, interesting projects, or just chatting about DevOps and Cloud architecture.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-8 mb-12">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <Mail className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Email Me</p>
                <a href={`mailto:${profile.email}`} className="text-lg font-medium hover:text-primary transition-colors">
                    {profile.email}
                </a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
             <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Location</p>
                <p className="text-lg font-medium">{profile.location || "Remote"}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6">
            {profile.socials.github && (
                <a 
                    href={profile.socials.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                    <Github className="w-6 h-6" />
                </a>
            )}
            {profile.socials.linkedin && (
                <a 
                    href={profile.socials.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                    <Linkedin className="w-5 h-5" />
                </a>
            )}
             {profile.socials.twitter && (
                 <a 
                    href={profile.socials.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                    <Twitter className="w-5 h-5" />
                </a>
            )}
        </div>
        
        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-sm text-zinc-500">
            © {new Date().getFullYear()} {profile.name}. All rights reserved. Built with Next.js, Tailwind, and AWS.
        </div>
      </div>
    </section>
  );
}


interface AboutProps {
  bio: string;
}

export function About({ bio }: AboutProps) {
  // Simple math for years of experience (2014 - Present)
  const startYear = 2014;
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - startYear;

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center px-4">
      <div className="container px-4 md:px-6 max-w-4xl">
        <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            About Me
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-center bg-background rounded-xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800">
             {/* Left Column: Stats */}
             <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg min-w-[200px]">
                 <span className="text-6xl font-bold text-primary">{yearsOfExperience}+</span>
                 <span className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-widest text-center">Years of<br/>Experience</span>
             </div>

             {/* Right Column: Bio */}
             <div className="flex-1 space-y-4">
                 <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
                     {bio}
                 </p>
                 <p className="text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
                     I specialize in building robust CI/CD pipelines, optimizing cloud infrastructure (GCP & AWS), and automating everything that moves. My goal is always to reduce friction for development teams while maintaining the highest standards of security and reliability.
                 </p>
             </div>
        </div>
      </div>
    </section>
  );
}

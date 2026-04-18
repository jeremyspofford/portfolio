import { ContentItem, CertificationContent, ProfileContent } from "@/lib/api";

interface HeroProps {
  profile: ProfileContent | undefined;
  certifications?: ContentItem<CertificationContent>[];
}

function getKidAge(): number {
  const now = new Date();
  const birthYear = 2020;
  const birthMonth = 10; // November (0-indexed)
  let age = now.getFullYear() - birthYear;
  if (now.getMonth() < birthMonth) age--;
  return age;
}

export function Hero({ profile, certifications: _certifications }: HeroProps) {
  if (!profile) return null;

  return (
    <section className="w-full bg-bg-primary">
      <div className="mx-auto max-w-doc px-6 pt-12 pb-8">
        <p className="text-[17px] leading-relaxed text-text-body max-w-[65ch]">
          The best infrastructure disappears. 8 years of making systems{" "}
          <em className="italic text-text-primary font-medium">boring-on-purpose</em>{" "}
          in DevOps — shrinking a 30-minute pipeline to 2 by rebuilding change detection. Now turning that same discipline on the ML side — graph-based memory, learned retrieval, and inference routing between cloud providers and local GPUs.
        </p>

        <blockquote className="mt-8 pl-5 border-l border-border-primary max-w-[55ch]">
          <p className="font-display italic text-[15px] leading-relaxed text-text-muted">
            &ldquo;Oh, that broke. That&apos;s okay — it&apos;s just part of engineering.&rdquo;
          </p>
          <cite className="block mt-2 text-[13px] font-mono not-italic text-text-faint">
            — My {getKidAge()}-year-old, who gets it.
          </cite>
        </blockquote>
      </div>
    </section>
  );
}

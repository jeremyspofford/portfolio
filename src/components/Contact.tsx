import { ProfileContent } from "@/lib/api";

interface ContactProps {
  profile?: ProfileContent;
}

export function Contact({ profile }: ContactProps) {
  if (!profile) return null;

  return (
    <section id="contact" className="w-full scroll-mt-20">
      <div className="mx-auto max-w-doc px-6 py-12 border-t border-border-primary">
        <h2 className="font-display font-semibold text-[22px] text-text-primary mb-4">
          Contact
        </h2>
        <p className="text-[15px] leading-relaxed text-text-body max-w-[65ch]">
          Currently open to conversations about Senior / Staff Platform, DevOps, and AI Infrastructure roles — remote, or Maine-adjacent.
        </p>
        <p className="mt-6 text-[15px] text-text-body">
          Get in touch:{' '}
          <a
            href={`mailto:${profile.email}`}
            className="text-text-primary underline underline-offset-4 decoration-text-faint hover:decoration-text-primary"
          >
            {profile.email}
          </a>
        </p>
      </div>
    </section>
  );
}

export function Testimonial() {
  return (
    <section id="testimonial" className="w-full">
      <div className="mx-auto max-w-doc px-6 py-12 border-t border-border-primary">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-faint mb-5">
          Recommendation
        </h2>
        <blockquote className="pl-6 border-l border-border-primary max-w-[65ch]">
          <a
            href="https://www.linkedin.com/in/jeremyspofford/#:~:text=Show%20all-,Recommendations,-Received%20(1)"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <p className="font-display italic text-[17px] leading-relaxed text-text-body group-hover:text-text-primary transition-colors">
              &ldquo;Jeremy led improvements to our CI/CD pipelines, Terraform automation, and Docker build/publish workflows, making deployments more reliable and our developer experience smoother. He embodies a blameless, collaborative mindset. Any team would be lucky to have someone with his drive, expertise, and generosity.&rdquo;
            </p>
          </a>
          <cite className="block mt-4 text-[13px] not-italic text-text-muted">
            <span className="font-medium text-text-primary">Jessica Wood</span>
            , Software Engineer
          </cite>
        </blockquote>
      </div>
    </section>
  );
}

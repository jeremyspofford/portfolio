"use client";

import { motion } from "framer-motion";

const PHILOSOPHY_CARDS = [
  {
    title: "Automate everything twice-done",
    body: "If I do it more than once, it gets automated. Manual is technical debt that compounds. Review-app infra, cert renewals, Terraform docs — all automated out of existence.",
  },
  {
    title: "Boring is the goal",
    body: "Infrastructure should be predictably reliable, never exciting at 2am. The best systems are the ones nobody notices because they just work.",
  },
  {
    title: "Hands-on by nature",
    body: "Finished basement, built a shed, dual-boot PC, gave an AI its own mini-PC with LAN wake access to my GPU desktop. I tinker because I need to understand how things work.",
  },
  {
    title: "Ship, then refine",
    body: "72 hours to an MVP. 535 reps tracked. 9 microservices orchestrated. Shipping is a muscle — the portfolio is the proof.",
  },
];

export function Philosophy() {
  return (
    <section
      id="philosophy"
      className="w-full py-12 md:py-16 px-6 md:px-12 scroll-mt-20"
      style={{ background: "#182240" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-xs text-[#F59E0B] tracking-widest uppercase mb-2 block">
            04 // philosophy
          </span>
          <h2
            className="font-display font-bold text-4xl md:text-5xl text-[#F1F5F9] mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            How I Work
          </h2>
        </motion.div>

        {/* 2x2 grid of cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {PHILOSOPHY_CARDS.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-xl border border-[#3D4F6B] p-6"
              style={{ background: "#1F2B45" }}
            >
              <h3 className="font-display font-semibold text-lg text-[#F1F5F9] mb-3">
                {card.title}
              </h3>
              <p className="text-[#CBD5E1] text-sm leading-relaxed">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

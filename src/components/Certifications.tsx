"use client";

import { motion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { ContentItem, CertificationContent } from "@/lib/api";
import { useState } from "react";

interface CertificationsProps {
  items: ContentItem<CertificationContent>[];
}

export function Certifications({ items }: CertificationsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const sortedItems = [...items].sort((a, b) => b.SK.localeCompare(a.SK));

  if (!sortedItems.length) return null;

  return (
    <section id="certifications" className="w-full py-20 md:py-32 px-6 md:px-12 scroll-mt-20" style={{ background: "#141C2F" }}>
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[#22D3EE] text-sm">//</span>
            <div className="h-px flex-1 max-w-[60px] bg-[#22D3EE]/30" />
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#F1F5F9] mb-4">
            Certifications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedItems.map((item, index) => {
            const cert = item.content;
            return (
              <motion.div
                key={item.SK}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                className="group rounded-xl border border-[#2D3748] p-6 card-hover-glow relative overflow-hidden"
                style={{ background: "#1E2538" }}
              >
                {/* Active indicator accent */}
                {cert.active && (
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, #10B981, transparent)" }}
                  />
                )}

                {/* Header row */}
                <div className="flex justify-between items-start mb-5">
                  <div
                    className="p-2.5 rounded-lg border border-[#2D3748]"
                    style={{ background: "#141C2F" }}
                  >
                    {/* Shield-check icon in monochrome */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#B0BEC5]" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded ${
                      cert.active
                        ? "text-[#10B981] border border-[#10B981]/30"
                        : "text-[#B0BEC5] border border-[#2D3748]"
                    }`}
                    style={{ background: cert.active ? "rgba(16,185,129,0.08)" : "#111827" }}
                  >
                    {cert.active ? "Active" : "Expired"}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-lg text-[#F1F5F9] mb-1 group-hover:text-[#22D3EE] transition-colors">
                  {cert.name}
                </h3>
                <p className="font-mono text-xs text-[#B0BEC5] mb-5">
                  {cert.issuer}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#2D3748]">
                  <span className="font-mono text-[11px] text-[#B0BEC5]">{cert.date}</span>
                  <div className="flex gap-3">
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-[#22D3EE] hover:underline"
                      >
                        Verify <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {cert.imageUrl && (
                      <button
                        onClick={() => setSelectedImage(cert.imageUrl!)}
                        className="font-mono text-[11px] text-[#B0BEC5] hover:text-[#F1F5F9] transition-colors"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(10,14,23,0.9)", backdropFilter: "blur(8px)" }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 text-[#B0BEC5] hover:text-[#F1F5F9] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Certification"
              className="rounded-xl shadow-2xl max-w-full max-h-[85vh] object-contain mx-auto"
              style={{ border: "1px solid #1E293B" }}
            />
          </div>
        </div>
      )}
    </section>
  );
}

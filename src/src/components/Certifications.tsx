'use client';

import { BadgeCheck, Calendar, Eye, X } from "lucide-react";
import { ContentItem, CertificationContent } from "@/lib/api";
import { useState } from "react";

interface CertificationsProps {
  items: ContentItem<CertificationContent>[];
}

export function Certifications({ items }: CertificationsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Filter for active/featured certifications if needed, or sort by date
  // Filter for active/featured certifications if needed, or sort by date
  const sortedItems = [...items].sort((a, b) => {
      // Sort by date descending (newest first)
      // Assuming date string is comparable or ISO-like enough for localeCompare,
      // but for "Jan 2025 - Jan 2028" vs "Expired", simple string compare might be tricky.
      // However, usually SK is date-based or we rely on insertion order if not specified.
      // Let's try to parse the date if possible or stick to SK if it has date info.
      
      // If SK contains date like YYYY-MM-DD, we can use it.
      // Current seed data uses SK: "GCP_ACE_2025" etc.
      // Let's try to extract year from SK or just rely on text for now as a simple step,
      // but the `items` in prop might come in any order.
      // Reverting to simple string compare of SK as a proxy if it helps, 
      // but `b.SK.localeCompare(a.SK)` typically puts Z before A.
      
      // Better approach using properties if available, but for now let's stick to the plan:
      return b.SK.localeCompare(a.SK);
  });

  if (!sortedItems.length) return null;

  return (
    <section id="certifications" className="py-12 md:py-20 px-4 md:px-8 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 flex items-center gap-2 sm:gap-3">
          <BadgeCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          Certifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sortedItems.map((item) => {
            const cert = item.content;
            return (
              <div
                key={item.SK}
                className="group relative flex flex-col bg-white dark:bg-zinc-800 rounded-xl p-4 sm:p-6 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-700/50 rounded-lg">
                        {/* Placeholder for logo if we had one, simplified to text char for now or generic icon */}
                         <BadgeCheck className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    {cert.active ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Active
                        </span>
                    ) : (
                         <span className="px-2 py-1 text-xs font-medium rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                            Expired
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {cert.name}
                </h3>
                
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-4">
                    {cert.issuer}
                </p>

                <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-700/50 flex items-center justify-between text-sm">
                   <div className="flex items-center text-zinc-500 dark:text-zinc-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {cert.date}
                   </div>
                   
                   {/* Verification Link */}
                   <div className="flex gap-3">
                     {cert.link && (
                         <a href={cert.link} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                             Verify <BadgeCheck className="w-3 h-3 ml-1" />
                         </a>
                     )}
                     {cert.imageUrl && (
                         <button 
                            onClick={() => setSelectedImage(cert.imageUrl!)}
                            className="flex items-center text-indigo-500 hover:underline hover:text-indigo-600"
                         >
                             View <Eye className="w-3 h-3 ml-1" />
                         </button>
                     )}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedImage(null)}
        >
            <div className="relative max-w-[95vw] sm:max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
                <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 sm:-top-10 sm:right-0 p-2 bg-black/50 sm:bg-transparent rounded-full text-white hover:text-gray-300 transition-colors z-10"
                >
                    <X className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
                <img
                    src={selectedImage}
                    alt="Certification"
                    className="rounded-lg shadow-2xl max-w-full max-h-[85vh] object-contain bg-white"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
      )}
    </section>
  );
}

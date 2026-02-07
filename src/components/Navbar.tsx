'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

// ThemeToggle removed - light mode only

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Certifications', href: '/#certifications' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Contact', href: '/#contact' },
];

// Anchor links for homepage sections
const SECTION_LINKS = [
  { label: 'Resume', href: '/resume' },
  { label: 'Blog', href: '/blog' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur z-50 print:hidden" role="navigation" aria-label="Main navigation">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
            <span className="text-primary">&lt;</span>
            JeremySpofford
            <span className="text-primary">/&gt;</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          {/* Section anchor links - always visible, navigate to homepage sections */}
          <span className="text-muted-foreground/30">|</span>
          {SECTION_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-0 top-16 bg-background z-40 animate-in slide-in-from-top-5 fade-in duration-200 p-4 border-t"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
           <div className="flex flex-col space-y-2">
             {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-lg font-medium transition-colors hover:bg-muted rounded-md"
                >
                  {item.label}
                </Link>
             ))}
             {/* Section links in mobile menu */}
             <div className="border-t pt-4 mt-2">
               <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sections</p>
               {SECTION_LINKS.map((item) => (
                 <Link
                   key={item.href}
                   href={item.href}
                   onClick={() => setIsOpen(false)}
                   className="px-4 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-muted rounded-md block"
                 >
                   {item.label}
                 </Link>
               ))}
             </div>
           </div>
        </div>
      )}
    </nav>
  );
}

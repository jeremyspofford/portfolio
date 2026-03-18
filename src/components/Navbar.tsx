'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const NAV_ITEMS = [
  { label: 'Work', href: '/#projects', sectionId: 'projects', shortcut: 'p' },
  { label: 'Skills', href: '/#skills', sectionId: 'skills', shortcut: 's' },
  { label: 'Experience', href: '/#experience', sectionId: 'experience', shortcut: 'e' },
  { label: 'Philosophy', href: '/#philosophy', sectionId: 'philosophy', shortcut: null },
  { label: 'Blog', href: '/blog', sectionId: null, shortcut: null },
  { label: 'Resume', href: '/resume', sectionId: null, shortcut: null },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    if (pathname !== '/') return;

    const sectionIds = NAV_ITEMS.map(i => i.sectionId).filter(Boolean) as string[];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) setActiveSection(id);
          });
        },
        { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, [pathname]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) setIsOpen(false);

    // Skip if user is typing in an input/textarea
    const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const shortcuts: Record<string, string> = { p: '/#projects', s: '/#skills', e: '/#experience', c: '/#contact' };
    if (shortcuts[e.key]) {
      e.preventDefault();
      window.location.href = shortcuts[e.key];
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isNavItemActive = (item: typeof NAV_ITEMS[number]) => {
    if (item.sectionId && pathname === '/') return activeSection === item.sectionId;
    if (!item.sectionId) return pathname === item.href || pathname.startsWith(item.href + '/');
    return false;
  };

  return (
    <nav
      className="fixed top-0 w-full z-50 print:hidden transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(10,14,23,0.85)"
          : "rgba(10,14,23,0.5)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid #1E293B" : "1px solid transparent",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-sm text-[#F1F5F9] hover:text-[#22D3EE] transition-colors"
        >
          <span className="text-[#22D3EE]">~/</span>jeremyspofford
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative inline-flex items-center gap-1.5 font-mono text-xs tracking-wide uppercase transition-colors pb-1"
                style={{ color: active ? '#22D3EE' : '#94A3B8' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#22D3EE'; }}
                onMouseLeave={e => { e.currentTarget.style.color = active ? '#22D3EE' : '#94A3B8'; }}
              >
                {item.label}
                {item.shortcut && (
                  <kbd className="ml-1 text-[10px] font-mono text-[#475569] border border-[#1E293B] rounded px-1 normal-case">
                    {item.shortcut}
                  </kbd>
                )}
                {active && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px rounded-full"
                    style={{ background: '#22D3EE', opacity: 0.7 }}
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/#contact"
            className="ml-2 inline-flex items-center gap-1.5 h-8 px-4 rounded border border-[#22D3EE]/40 font-mono text-xs text-[#22D3EE] hover:bg-[#22D3EE]/10 transition-colors"
          >
            Contact
            <kbd className="text-[10px] font-mono text-[#22D3EE]/50 border border-[#22D3EE]/20 rounded px-1">c</kbd>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-[#94A3B8] hover:text-[#22D3EE] transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-0 top-16 z-40 p-6"
          style={{ background: "rgba(10,14,23,0.95)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex flex-col space-y-1 pt-4">
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-4 font-mono text-sm rounded-lg transition-colors"
                  style={{
                    color: active ? '#22D3EE' : '#94A3B8',
                    background: active ? 'rgba(34,211,238,0.05)' : 'transparent',
                  }}
                >
                  {active && <span className="mr-2" style={{ color: '#22D3EE' }}>›</span>}
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/#contact"
              onClick={() => setIsOpen(false)}
              className="mt-4 inline-flex items-center justify-center h-11 rounded-lg border border-[#22D3EE]/40 font-mono text-sm text-[#22D3EE] hover:bg-[#22D3EE]/10 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

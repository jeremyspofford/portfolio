'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect } from 'react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', shortcut: 'h' },
  { label: 'Resume', href: '/resume', shortcut: 'r' },
  { label: 'Projects', href: '/projects', shortcut: 'p' },
  { label: 'Blog', href: '/blog', shortcut: 'b' },
];

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const shortcuts: Record<string, string> = { h: '/', r: '/resume', p: '/projects', b: '/blog' };
    if (shortcuts[e.key]) {
      e.preventDefault();
      window.location.href = shortcuts[e.key];
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <nav
      className="sticky top-0 z-40 w-full bg-bg-primary border-b border-border-primary print:hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-doc px-6 h-12 flex items-center gap-5 md:gap-6 overflow-x-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? 'font-mono text-[11px] uppercase tracking-[0.08em] text-text-primary font-semibold underline underline-offset-[6px] decoration-1'
                  : 'font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted hover:text-text-primary'
              }
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

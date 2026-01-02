'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { ThemeToggle } from '@/components/ThemeToggle';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Resume', href: '/resume' },
  { label: 'Blog', href: '/blog' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur z-50 print:hidden">
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
          <ThemeToggle />
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
             {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

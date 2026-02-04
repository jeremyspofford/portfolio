# Quick Wins - Brand Review

**5 Changes That Make Immediate Impact** (< 2 hours total)

---

## 1. Add Aria Labs Branding to Hero (15 min)

```tsx
// src/components/Hero.tsx - Add after name
<div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
  <span>Building the future at</span>
  <span className="font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
    Aria Labs
  </span>
</div>
```

**Impact:** Immediate brand recognition

---

## 2. Remove Boot Sequence (10 min)

```tsx
// src/components/Hero.tsx
export function Hero({ profile, certifications }: HeroProps) {
  // DELETE: All bootSequence state and useEffect
  // KEEP: Only the main hero content
  
  if (!profile) return null;
  
  return (
    <section className="w-full py-8 sm:py-12...">
      {/* Existing hero content */}
    </section>
  );
}
```

**Impact:** Users see content immediately, better conversion

---

## 3. Upgrade Primary Color to Aria Labs Violet (30 min)

```css
/* src/app/globals.css */
:root {
  --primary: 262 83% 58%;  /* Violet instead of blue */
  --secondary: 280 65% 60%;
  --accent: 243 75% 59%;
}

.dark {
  --primary: 262 83% 65%;
  --secondary: 280 60% 50%;
  --accent: 243 75% 65%;
}
```

**Impact:** Consistent AI/tech brand feel throughout

---

## 4. Fix CTA Hierarchy (15 min)

```tsx
// src/components/Hero.tsx - Make "View Resume" primary
<Link
  href="/resume"
  className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105"
>
  <FileText className="mr-2 h-5 w-5" />
  View Resume
</Link>
```

**Impact:** Clear primary action for visitors

---

## 5. Update Footer with Aria Labs (10 min)

```tsx
// src/components/Contact.tsx - Replace copyright line
<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
  <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
  <p className="flex items-center gap-2">
    Built with <span className="font-bold text-primary">Aria Labs</span>
    <span className="text-muted-foreground/50">|</span> Next.js · AWS
  </p>
</div>
```

**Impact:** Reinforces brand at exit point

---

## Before You Start

```bash
cd ~/repos/portfolio
git checkout -b brand-improvements
npm run dev  # Test locally as you go
```

## After Changes

```bash
git add .
git commit -m "feat: add Aria Labs branding and improve visual consistency"
git push origin brand-improvements
```

---

**Total Time: ~80 minutes**  
**Impact: Transforms brand identity** ✨

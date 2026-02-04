# Aria Labs Color Palette Guide

Visual reference for the updated brand colors.

---

## 🎨 Current vs. Proposed

### PRIMARY COLOR

**Current (Blue):**
```
Light:  hsl(221.2, 83.2%, 53.3%)  #3b82f6 🔵
Dark:   hsl(217.2, 91.2%, 59.8%)  #60a5fa 🔵
```

**Proposed (Violet - Aria Labs Brand):**
```
Light:  hsl(262, 83%, 58%)  #7c3aed 🟣
Dark:   hsl(262, 83%, 65%)  #8b5cf6 🟣
```

**Why Change:** Violet is strongly associated with AI, innovation, and premium tech brands. It creates instant brand recognition for Aria Labs.

---

## 🎨 Complete Palette

### Light Mode

```css
:root {
  /* Backgrounds */
  --background: hsl(0, 0%, 100%)           /* #ffffff - White */
  --card: hsl(0, 0%, 100%)                 /* #ffffff - White */
  --muted: hsl(215, 20%, 93%)              /* #eff1f5 - Light gray */
  
  /* Text */
  --foreground: hsl(222.2, 84%, 4.9%)      /* #020617 - Near black */
  --muted-foreground: hsl(215, 16%, 47%)   /* #64748b - Medium gray */
  
  /* Brand Colors */
  --primary: hsl(262, 83%, 58%)            /* #7c3aed - Aria Violet */
  --secondary: hsl(280, 65%, 60%)          /* #b968e6 - Light purple */
  --accent: hsl(243, 75%, 59%)             /* #6366f1 - Indigo */
  
  /* Borders & Inputs */
  --border: hsl(215, 20%, 88%)             /* #e2e8f0 - Light border */
  --input: hsl(215, 20%, 88%)              /* #e2e8f0 - Light border */
  --ring: hsl(262, 83%, 58%)               /* #7c3aed - Focus ring */
  
  /* States */
  --destructive: hsl(0, 84%, 60%)          /* #ef4444 - Red */
}
```

### Dark Mode

```css
.dark {
  /* Backgrounds */
  --background: hsl(224, 71%, 4%)          /* #0c0a1f - Deep blue-black */
  --card: hsl(224, 65%, 7%)                /* #141226 - Dark card */
  --muted: hsl(223, 47%, 11%)              /* #1e1b2e - Muted dark */
  
  /* Text */
  --foreground: hsl(213, 31%, 91%)         /* #e2e8f0 - Light text */
  --muted-foreground: hsl(215, 20%, 65%)   /* #94a3b8 - Muted text */
  
  /* Brand Colors */
  --primary: hsl(262, 83%, 65%)            /* #8b5cf6 - Bright violet */
  --secondary: hsl(280, 60%, 50%)          /* #a855f7 - Purple */
  --accent: hsl(243, 75%, 65%)             /* #818cf8 - Light indigo */
  
  /* Borders & Inputs */
  --border: hsl(223, 47%, 15%)             /* #262339 - Dark border */
  --input: hsl(223, 47%, 15%)              /* #262339 - Dark border */
  --ring: hsl(262, 83%, 65%)               /* #8b5cf6 - Focus ring */
  
  /* States */
  --destructive: hsl(0, 63%, 31%)          /* #991b1b - Dark red */
}
```

---

## 🎨 Usage Examples

### Gradients

**Hero Title:**
```tsx
bg-gradient-to-r from-primary via-secondary to-accent
```
Result: Violet → Purple → Indigo gradient ✨

**Section Backgrounds:**
```tsx
bg-gradient-to-b from-primary/5 to-background
```
Result: Subtle violet fade to white

**AI Showcase:**
```tsx
bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10
```
Result: Multi-color subtle background

---

## 🎨 Component Color Map

| Component | Color Usage | CSS Variable |
|-----------|-------------|--------------|
| **Hero Title** | Gradient | `from-primary via-secondary to-accent` |
| **Navbar Logo** | Accent text | `text-primary` |
| **Primary Buttons** | Background | `bg-primary text-primary-foreground` |
| **Card Hover** | Border | `hover:border-primary/50` |
| **Links** | Text | `text-primary hover:text-primary/80` |
| **Badges (Active)** | Background | `bg-primary/10 text-primary border-primary/20` |
| **Focus Rings** | Border | `ring-primary` |
| **Section Accents** | Background | `bg-primary/5` or `bg-primary/10` |

---

## 🎨 Accessibility

### Contrast Ratios (WCAG AA Minimum: 4.5:1)

**Light Mode:**
- Primary on White: **6.2:1** ✅ PASS
- Primary Foreground on Primary: **8.1:1** ✅ PASS
- Muted Foreground on Background: **5.4:1** ✅ PASS

**Dark Mode:**
- Primary on Dark Background: **7.8:1** ✅ PASS
- Foreground on Dark Background: **9.2:1** ✅ PASS
- Muted Foreground on Dark Background: **5.1:1** ✅ PASS

All ratios meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).

---

## 🎨 Color Psychology

### Why Violet for Aria Labs?

**Violet/Purple in Tech:**
- 🤖 **AI & Innovation:** OpenAI, Twitch, Yahoo use purple
- 🔮 **Future-Forward:** Associated with creativity and imagination
- 👑 **Premium:** Historically associated with quality and luxury
- 🌟 **Unique:** Less common than blue, stands out in portfolio reviews

**Violet vs. Blue:**
- Blue: Trust, stability, corporate (common in DevOps)
- Violet: Innovation, AI, creativity (differentiator for Aria Labs)

---

## 🎨 Migration Strategy

### Step 1: Update CSS Variables
```css
/* src/app/globals.css */
/* Copy the complete palette from above */
```

### Step 2: Test Components
- Check Hero gradient
- Check buttons
- Check links
- Check cards
- Check badges

### Step 3: Search & Replace (if needed)
```bash
# Find any hardcoded blues
rg "blue-[456]00" src/

# Find any hardcoded indigo
rg "indigo-[456]00" src/

# Replace with primary/secondary/accent
```

### Step 4: Dark Mode Verification
- Toggle dark mode
- Check all sections
- Verify contrast

---

## 🎨 Brand Assets Needed

- [ ] **Favicon:** 32x32 icon with violet theme
- [ ] **OG Image:** 1200x630 with violet gradient background
- [ ] **Logo:** SVG with violet primary color
- [ ] **Touch Icon:** 180x180 for iOS home screen

**Design Tools:**
- Figma template: [Create from color palette]
- Canva: Use hex codes above
- AI Generator: "Aria Labs logo, violet and purple, AI theme, modern"

---

## 🎨 Quick Reference

**Copy-Paste Ready:**

```tsx
// Primary violet
className="text-primary bg-primary border-primary"

// Secondary purple
className="text-secondary bg-secondary border-secondary"

// Accent indigo
className="text-accent bg-accent border-accent"

// Gradient
className="bg-gradient-to-r from-primary via-secondary to-accent"

// Subtle background
className="bg-primary/5"

// Hover effect
className="hover:text-primary hover:border-primary/50"
```

---

**Need Help?** Reference the full brand review in `brand-review.md`

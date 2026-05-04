# Design Language: Blocked - Indeed.com

> Extracted from `https://pk.indeed.com/` on April 30, 2026
> 57 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#2557a7` | rgb(37, 87, 167) | hsl(217, 64%, 40%) | 8 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#2d2d2d` | hsl(0, 0%, 18%) | 84 |
| `#000000` | hsl(0, 0%, 0%) | 16 |
| `#dcdcdc` | hsl(0, 0%, 86%) | 4 |
| `#ffffff` | hsl(0, 0%, 100%) | 4 |

### Text Colors

Text color palette: `#000000`, `#2d2d2d`, `#dcdcdc`, `#2557a7`, `#ffffff`

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#2d2d2d` | text, border | 84 |
| `#000000` | text, border | 16 |
| `#2557a7` | background, text, border | 8 |
| `#dcdcdc` | text, border | 4 |
| `#ffffff` | text, border | 4 |

## Typography

### Font Families

- **Noto Sans** — used for all (47 elements)
- **Times New Roman** — used for body (8 elements)
- **Arial** — used for all (2 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 24px | 1.5rem | 700 | 30px | normal | h1 |
| 16px | 1rem | 400 | normal | normal | html, head, meta, title |
| 14px | 0.875rem | 400 | 21px | normal | a, img, span |
| 13.3333px | 0.8333rem | 400 | normal | normal | button, img |

### Heading Scale

```css
h1 { font-size: 24px; font-weight: 700; line-height: 30px; }
```

### Body Text

```css
body { font-size: 16px; font-weight: 400; line-height: normal; }
```

### Font Weights in Use

`400` (50x), `700` (7x)

## Spacing

| Token | Value | Rem |
|-------|-------|-----|
| spacing-1 | 1px | 0.0625rem |
| spacing-400 | 400px | 25rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| md | 8px | 2 |

## CSS Custom Properties

### Colors

```css
--background-color: #fff;
--primary-1000: #0d2d5e;
--primary-900: #164081;
--primary-800: #2557a7;
--primary-700: #3f73d3;
--primary-600: #6792f0;
--link-color: var(--primary-800);
--link-color-hover: var(--primary-900);
--menu-background-color: #fff;
--text-color: var(--neutral-1000);
--text-color-hover: var(--neutral-900);
```

### Typography

```css
--font-family: "Noto Sans",system-ui,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
```

### Other

```css
--lightningcss-light: initial;
--lightningcss-dark: ;
--neutral-1000: #2d2d2d;
--neutral-900: #424242;
--neutral-400: #d4d2d0;
--dark-1000: #040606;
--default-transition: cubic-bezier(.645,.045,.355,1);
--menu-transition: .28s all .12s ease-out;
--icon-profile: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 9C11.4862 9 13.5 6.98625 13.5 4.5C13.5 2.01375 11.4862 0 9 0C6.51375 0 4.5 2.01375 4.5 4.5C4.5 6.98625 6.51375 9 9 9ZM9 11.25C5.99625 11.25 0 12.7575 0 15.75V17.5C0 17.7761 0.223858 18 0.5 18H17.5C17.7761 18 18 17.7761 18 17.5V15.75C18 12.7575 12.0037 11.25 9 11.25Z' fill='white'/%3E%3C/svg%3E%0A");
```

### Dependencies

```css
--link-color: --primary-800;
--link-color-hover: --primary-900;
--text-color: --neutral-1000;
--text-color-hover: --neutral-900;
```

### Semantic

```css
success: [object Object];
warning: [object Object];
error: [object Object];
info: [object Object];
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| md | 800px | max-width |

## Transitions & Animations

**Easing functions:** `[object Object]`

**Durations:** `0.2s`

### Common Transitions

```css
transition: all;
transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1), border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (3 instances)

```css
.button {
  background-color: rgb(37, 87, 167);
  color: rgb(45, 45, 45);
  font-size: 14px;
  font-weight: 700;
  padding-top: 9px;
  padding-right: 16px;
  border-radius: 8px;
}
```

### Links (14 instances)

```css
.link {
  color: rgb(45, 45, 45);
  font-size: 14px;
  font-weight: 400;
}
```

### Navigation (9 instances)

```css
.navigatio {
  color: rgb(45, 45, 45);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(37, 87, 167);
  color: rgb(255, 255, 255);
  padding: 9px 16px 9px 16px;
  border-radius: 8px;
  border: 0px none rgb(255, 255, 255);
  font-size: 16px;
  font-weight: 700;
```

## Layout System

**0 grid containers** and **7 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 480px | 16px |

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 4x |
| row/wrap | 2x |
| column/nowrap | 1x |

**Gap values:** `24px`

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 1 passing, 0 failing color pairs

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#ffffff` | `#2557a7` | 7:1 | AAA |

## Design System Score

**Overall: 88/100 (Grade: B)**

| Category | Score |
|----------|-------|
| Color Discipline | 100/100 |
| Typography Consistency | 80/100 |
| Spacing System | 70/100 |
| Shadow Consistency | 85/100 |
| Border Radius Consistency | 100/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Tight, disciplined color palette, Clean elevation system, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 57 duplicate CSS declarations

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 1 | objectFit: fill, borderRadius: 0px, shape: square |

**Aspect ratios:** 3.75:1 (1x)

## Motion Language

**Feel:** mixed · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `sm` | `200ms` | 200 |

### Easing Families

- **custom** (2 uses) — `cubic-bezier(0.645, 0.045, 0.355, 1)`

## Brand Voice

**Tone:** friendly · **Pronoun:** you-only · **Headings:** Title Case (tight)

### Top CTA Verbs

- **return** (1)

### Button Copy Patterns

- "return home
  →" (1×)

### Sample Headings

> Request Blocked

## Page Intent

**Type:** `landing` (confidence 0.31)

Alternates: auth (0.35)

## Section Roles

Reading order (top→bottom): nav → hero

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | nav | — | 0.9 |
| 1 | hero | Request Blocked | 0.85 |

## Material Language

**Label:** `flat` (confidence 0.55)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.156 |
| Shadow profile | none |
| Avg shadow blur | 0px |
| Max radius | 8px |
| backdrop-filter in use | no |
| Gradients | 0 |

## Imagery Style

**Label:** `flat-illustration` (confidence 0.4)
**Counts:** total 1, svg 1, icon 0, screenshot-like 0, photo-like 0
**Dominant aspect:** ultra-wide
**Radius profile on images:** square

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Noto Sans` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration

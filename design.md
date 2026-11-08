---
version: "alpha"
name: "Flat 2.0 / Semi-flat"
description: "Flat 2.0 / Semi-flat visual system, translated from the Claude Artisan catalog for use in digital products. Flat foundation with subtle shadows and depth cues restored; Long/ghost shadows, subtle gradients"
colors:
  primary: "#3f6df0"
  background: "#eef1f6"
  surface: "#ffffff"
  text: "#1c2430"
  accent: "#ff7a45"
  on-primary: "#000000"
  on-surface: "#000000"
  on-accent: "#000000"
typography:
  h1:
    fontFamily: "'Roboto', system-ui, sans-serif"
    fontSize: "4rem"
    fontWeight: "700"
    lineHeight: "1.05"
  body-md:
    fontFamily: "'Roboto', 'Google Sans', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: "400"
    lineHeight: "1.6"
  label-caps:
    fontFamily: "'Roboto', 'Google Sans', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: "600"
    letterSpacing: "0.06em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "16px"
  button-secondary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    padding: "16px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    padding: "16px"
---
## Overview

Flat 2.0 / Semi-flat visual system, translated from the Claude Artisan catalog for use in digital products. Flat foundation with subtle shadows and depth cues restored; Long/ghost shadows, subtle gradients

- **Category:** morphism
- **Era:** 2015–present
- **Origin:** Google Material (2014) and industry reaction to pure flat's usability problems.
- **Reference:** Google Material Design; most modern SaaS dashboards.
- **Structural base:** shell de aplicação com navegação e cartões

**Defining traits:**
- Flat foundation with subtle shadows and depth cues restored
- Long/ghost shadows, subtle gradients
- Clear affordances without skeuomorphic texture
- Layered card surfaces

## Colors

- **bg** — #eef1f6
- **surface** — #ffffff
- **surface-strong** — #f4f6fa
- **border** — #dbe1ea
- **text** — #1c2430
- **text-muted** — #5a6472
- **primary** — #3f6df0
- **accent** — #ff7a45

## Typography

- Display: 'Roboto', system-ui, sans-serif
- Body: 'Roboto', 'Google Sans', system-ui, sans-serif
- Mono: 'Roboto Mono', ui-monospace, monospace

## Layout

- shell de aplicação com navegação e cartões
- Use a responsive grid and preserve content hierarchy.
- Collapse columns below 768px without horizontal overflow.

## Elevation & Depth

- Flat foundation with subtle shadows and depth cues restored; Long/ghost shadows, subtle gradients; Clear affordances without skeuomorphic texture; Layered card surfaces

## Shapes

- Radius scale: 0 1px 2px rgba(28,36,48,0.06), 0 4px 8px rgba(28,36,48,0.06), 0 2px 4px rgba(28,36,48,0.07), 0 10px 24px rgba(28,36,48,0.10), 0 4px 8px rgba(28,36,48,0.08), 0 24px 48px rgba(28,36,48,0.14).

## Components

- Buttons keep visible focus and predictable hover/pressed states.
- Cards use the surface and radius scale from the tokens.
- Forms expose persistent labels, textual errors, and keyboard focus.

## Do's and Don'ts

- Do: follow the tokens and the structural composition.
- Do: maintain WCAG AA contrast and `prefers-reduced-motion`.
- Avoid: using the style as decoration without functional hierarchy.

<!-- Source: https://designmd.app/library/flat-2 · designmd.app -->

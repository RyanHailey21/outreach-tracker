# Branding & Styling Guidelines

This project uses a **centralized, semantic styling system** built on Tailwind CSS and CSS Variables. This ensures consistency across the application and makes global theming changes effortless (e.g., implementing Dark Mode or changing brand colors).

## Core Principles

1.  **Centralized Source of Truth**: All color and spacing definitions live in `index.css` as CSS variables (e.g., `--primary`, `--status-success`).
2.  **Semantic Naming**: We use names that describe *what* a color represents, not what color it *is*.
    *   ✅ DO: `--status-error`
    *   ❌ DON'T: `--red-500`
3.  **Tailwind Configuration**: `tailwind.config.js` maps these variables to utility classes, so you can use standard Tailwind syntax (e.g., `bg-primary`, `text-status-error`).

## How to Add Styles

### 1. New Theme Colors
If you need a new brand color, add it to the `:root` block in `index.css`.

```css
:root {
  /* ... existing vars ... */
  --brand-highlight: 210 100% 50%;
}
.dark {
  --brand-highlight: 210 100% 30%; /* Dark mode variant */
}
```

Then, Register it in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
        brand: {
            highlight: "hsl(var(--brand-highlight))"
        }
    }
  }
}
```

Usage: `<div className="bg-brand-highlight" />`

### 2. Status & functional Colors
We have a dedicated semantic palette for statuses. Always use these for state indication:

| Role | Tailwind Class | CSS Variable |
|------|---------------|--------------|
| Neutral / Draft | `bg-status-neutral` | `--status-neutral` |
| Info / Sent | `bg-status-info` | `--status-info` |
| Warning / Follow-up | `bg-status-warning` | `--status-warning` |
| Engaged / Active | `bg-status-engaged` | `--status-engaged` |
| Success / Scheduled | `bg-status-success` | `--status-success` |
| Completed | `bg-status-completed` | `--status-completed` |
| Error / Rejected | `bg-status-error` | `--status-error` |

### 3. Component Styling
- Use **shadcn/ui** components from `@/components/ui/` whenever possible.
- Avoid hardcoding specific hex codes or arbitrary Tailwind colors (e.g., `bg-[#123456]` or `bg-blue-400`) in your components. Always defaults to the theme or semantic variables.

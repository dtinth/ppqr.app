# Agent Style Guide

This document provides a style guide for agents working on this project.

## Styling

The project uses a mix of Tailwind CSS and traditional CSS with a BEM-like naming convention.

### Tailwind CSS

For new components, prefer using Tailwind CSS for styling. Apply utility classes directly in the `className` attribute of your components.

**Example:**

```tsx
<div className="max-w-[440px] mx-auto h-12 flex items-center">
  <img className="w-12 h-12" alt="" src={logo} />
  <h1 className="font-bold">ppqr.app</h1>
  <div className="ml-auto">{props.rightContent}</div>
</div>
```

### Traditional CSS

When modifying existing components that use traditional CSS, follow the existing conventions. The project uses a BEM-like naming convention for CSS classes.

**Example:**

```tsx
// SlotSelector.tsx
<div className="SlotSelector">
  <button className={'SlotSelectorのitem' + (props.active === i ? ' is-active' : '')}>
    <span className="SlotSelectorのnum">{i}</span>
    <span className="SlotSelectorのinfo">{renderInfo(props.data[i])}</span>
  </button>
</div>
```

```css
/* SlotSelector.css */
.SlotSelector {
  /* ... */
}

.SlotSelectorのitem {
  /* ... */
}

.SlotSelectorのitem.is-active {
  /* ... */
}
```

## Components

Components are located in the `src/packlets` directory. When creating a new component, create a new directory for it with the component's name. The directory should contain the component file (`.tsx`) and its corresponding CSS file (if not using Tailwind CSS).

## State Management

For simple state management within a component, use the `useState` hook from Preact. For more complex state, consider using a state management library, but consult with the project owner first.

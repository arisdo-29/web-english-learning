import React, { createContext, useContext } from 'react';
import { cn } from '../../lib/utils';

/* ============================================================================
 * 1. CARD (apps/v4/registry/new-york-v4/ui/card.tsx)
 * ============================================================================ */
export function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-5 rounded-2xl border border-border py-5 shadow-sm transition-all',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[data-slot=card-action]:grid-cols-[1fr_auto]',
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-snug font-semibold tracking-tight text-foreground', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-xs sm:text-sm leading-relaxed', className)}
      {...props}
    />
  );
}

export function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 pt-3 border-t border-border/60', className)}
      {...props}
    />
  );
}

/* ============================================================================
 * 2. BUTTON (apps/v4/registry/new-york-v4/ui/button.tsx)
 * ============================================================================ */
export function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}) {
  const variants = {
    default: 'bg-primary text-primary-foreground shadow-xs hover:opacity-92',
    destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:opacity-90',
    outline: 'border border-border bg-card shadow-2xs hover:bg-secondary hover:text-secondary-foreground',
    secondary: 'bg-secondary text-secondary-foreground shadow-2xs hover:opacity-85',
    ghost: 'hover:bg-secondary/80 hover:text-secondary-foreground',
    link: 'text-primary underline-offset-4 hover:underline'
  };

  const sizes = {
    default: 'h-9 px-4 py-2 text-xs sm:text-sm',
    sm: 'h-8 rounded-lg gap-1.5 px-3 text-xs',
    lg: 'h-10 rounded-xl px-6 text-sm',
    icon: 'h-9 w-9'
  };

  return (
    <button
      type={type}
      data-slot="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.98] shrink-0',
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        className
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * 3. BADGE (apps/v4/registry/new-york-v4/ui/badge.tsx)
 * ============================================================================ */
export function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-border/60 bg-secondary text-secondary-foreground',
    destructive: 'border-transparent bg-destructive/15 text-destructive',
    outline: 'text-foreground border-border bg-card',
    pastel: 'border-primary/20 bg-primary/10 text-primary'
  };

  return (
    <span
      data-slot="badge"
      className={cn(
        'inline-flex items-center justify-center rounded-lg border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-colors',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * 4. TABS (apps/v4/registry/new-york-v4/ui/tabs.tsx)
 * ============================================================================ */
const TabsContext = createContext({ value: '', onValueChange: () => {} });

export function Tabs({ value, defaultValue, onValueChange, className, children, ...props }) {
  const [internalVal, setInternalVal] = React.useState(defaultValue || '');
  const activeValue = value !== undefined ? value : internalVal;
  const handleChange = (next) => {
    if (value === undefined) setInternalVal(next);
    if (onValueChange) onValueChange(next);
  };

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleChange }}>
      <div data-slot="tabs" className={cn('flex flex-col gap-3', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn(
        'bg-secondary/90 text-muted-foreground inline-flex h-10 w-fit items-center justify-center rounded-xl p-1 border border-border/60',
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ value, className, children, ...props }) {
  const ctx = useContext(TabsContext);
  const isActive = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      data-slot="tabs-trigger"
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-lg border border-transparent px-3 py-1 text-xs font-medium whitespace-nowrap transition-all cursor-pointer',
        isActive
          ? 'bg-card text-foreground shadow-xs border-border/60 font-semibold'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, ...props }) {
  const ctx = useContext(TabsContext);
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      data-slot="tabs-content"
      className={cn('flex-1 outline-none animate-in fade-in duration-150', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ============================================================================
 * 5. PROGRESS (apps/v4/registry/new-york-v4/ui/progress.tsx)
 * ============================================================================ */
export function Progress({ value = 0, max = 100, className, indicatorClassName, ...props }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;
  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn('bg-secondary relative h-2 w-full overflow-hidden rounded-full', className)}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className={cn('bg-primary h-full transition-all duration-300 rounded-full', indicatorClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ============================================================================
 * 6. INPUT & TEXTAREA (apps/v4/registry/new-york-v4/ui/input.tsx & textarea.tsx)
 * ============================================================================ */
export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-border bg-card text-foreground placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-xl border px-3.5 py-1 text-xs sm:text-sm shadow-2xs transition-all outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-border bg-card text-foreground placeholder:text-muted-foreground flex min-h-20 w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm shadow-2xs transition-all outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

/* ============================================================================
 * 7. SWITCH (apps/v4/registry/new-york-v4/ui/switch.tsx)
 * ============================================================================ */
export function Switch({ checked = false, onCheckedChange, className, ...props }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? 'checked' : 'unchecked'}
      data-slot="switch"
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-2xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
        checked ? 'bg-primary' : 'bg-secondary',
        className
      )}
      {...props}
    >
      <span
        data-slot="switch-thumb"
        className={cn(
          'bg-card pointer-events-none block h-4 w-4 rounded-full ring-0 shadow-xs transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  );
}

/* ============================================================================
 * 8. SEPARATOR & ALERT (apps/v4/registry/new-york-v4/ui/separator.tsx & alert.tsx)
 * ============================================================================ */
export function Separator({ orientation = 'horizontal', className, ...props }) {
  return (
    <div
      data-slot="separator"
      role="separator"
      className={cn(
        'bg-border shrink-0',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  );
}

export function Alert({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-secondary/60 text-foreground border-border',
    pastel: 'bg-primary/8 text-foreground border-primary/20',
    destructive: 'border-destructive/30 bg-destructive/10 text-destructive'
  };
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(
        'relative w-full rounded-2xl border px-4 py-3.5 text-xs sm:text-sm grid has-[>svg]:grid-cols-[16px_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}

export function AlertTitle({ className, ...props }) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

export function AlertDescription({ className, ...props }) {
  return (
    <div
      data-slot="alert-description"
      className={cn('text-muted-foreground col-start-2 grid justify-items-start gap-1 text-xs leading-relaxed', className)}
      {...props}
    />
  );
}

/* ============================================================================
 * 9. TABLE (apps/v4/registry/new-york-v4/ui/table.tsx)
 * ============================================================================ */
export function Table({ className, ...props }) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn('w-full caption-bottom text-xs sm:text-sm', className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead data-slot="table-header" className={cn('[&_tr]:border-b border-border', className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      data-slot="table-row"
      className={cn('hover:bg-secondary/50 border-b border-border/70 transition-colors', className)}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }) {
  return (
    <th
      data-slot="table-head"
      className={cn('text-muted-foreground h-10 px-4 text-left align-middle font-semibold whitespace-nowrap text-xs', className)}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn('p-3.5 px-4 align-middle', className)}
      {...props}
    />
  );
}

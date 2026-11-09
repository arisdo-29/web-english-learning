/**
 * shadcn-ui/ui Component Bridge
 * Bridges all app-level UI primitives (Card, Button, Badge, Tabs/SegmentedControl, Progress, Alert)
 * directly to the shadcn-ui/ui component primitives in ../components/ui
 */

import React from 'react';
import {
  Card,
  Button,
  Badge,
  Progress,
  Alert,
  AlertTitle,
  AlertDescription
} from '../components/ui';
import { cn } from '../lib/utils';

export function themeProps(target, stateMap = {}, extraClassName = '') {
  const classes = [`astryx-${target}`];
  const dataAttrs = {};

  Object.entries(stateMap).forEach(([key, val]) => {
    if (val === undefined || val === null || val === false) return;
    const kebabKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
    if (val === true) {
      classes.push(kebabKey);
      dataAttrs[`data-${kebabKey}`] = '';
    } else {
      classes.push(`${kebabKey}-${val}`);
      dataAttrs[`data-${kebabKey}`] = String(val);
    }
  });

  if (extraClassName) classes.push(extraClassName);
  return {
    className: classes.join(' '),
    ...dataAttrs
  };
}

/**
 * shadcn/ui Card Wrapper
 */
export function AstryxCard({
  children,
  variant = 'surface', // 'surface' | 'muted' | 'elevated' | 'interactive'
  isSelected = false,
  padding = 'md', // 'none' | 'sm' | 'md' | 'lg'
  className = '',
  onClick,
  ...rest
}) {
  const padMap = {
    none: 'p-0 py-0',
    sm: 'p-4 py-4',
    md: 'p-5 sm:p-6 py-5 sm:py-6',
    lg: 'p-6 sm:p-8 py-6 sm:py-8'
  };
  return (
    <Card
      onClick={onClick}
      data-variant={variant}
      data-selected={isSelected ? '' : undefined}
      className={cn(
        'astryx-card-base gap-0',
        padMap[padding] || padMap.md,
        variant === 'muted' && 'bg-secondary/70 border-border/60 shadow-none',
        variant === 'interactive' && 'hover:border-primary/40 hover:shadow-md cursor-pointer',
        isSelected && 'border-primary ring-2 ring-primary/20 bg-primary/5',
        onClick && 'cursor-pointer',
        className
      )}
      {...rest}
    >
      {children}
    </Card>
  );
}

/**
 * shadcn/ui Button Wrapper
 */
export function AstryxButton({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'accent-muted'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  isLoading = false,
  disabled = false,
  icon: IconComp = null,
  iconEnd: IconEndComp = null,
  className = '',
  type = 'button',
  ...rest
}) {
  const isDisabled = disabled || isLoading;
  const variantMap = {
    primary: 'default',
    secondary: 'secondary',
    outline: 'outline',
    ghost: 'ghost',
    destructive: 'destructive',
    'accent-muted': 'secondary'
  };
  const sizeMap = {
    sm: 'sm',
    md: 'default',
    lg: 'lg',
    xl: 'lg'
  };

  return (
    <Button
      type={type}
      variant={variantMap[variant] || 'default'}
      size={sizeMap[size] || 'default'}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={cn(
        variant === 'accent-muted' && 'bg-primary/12 text-primary border border-primary/25 hover:bg-primary/18',
        className
      )}
      {...rest}
    >
      {isLoading ? (
        <span className="astryx-spinner" aria-hidden="true" />
      ) : (
        IconComp && <IconComp className="w-4 h-4 shrink-0" />
      )}
      <span className="truncate">{children}</span>
      {!isLoading && IconEndComp && <IconEndComp className="w-4 h-4 shrink-0" />}
    </Button>
  );
}

/**
 * shadcn/ui Badge Wrapper
 */
export function AstryxBadge({
  children,
  status = 'neutral', // 'neutral' | 'accent' | 'positive' | 'warning' | 'negative' | 'info'
  prominence = 'muted', // 'muted' | 'solid'
  icon: IconComp = null,
  className = '',
  ...rest
}) {
  const statusClasses = {
    neutral: prominence === 'solid' ? 'bg-foreground text-background' : 'bg-secondary text-secondary-foreground border-border/70',
    accent: prominence === 'solid' ? 'bg-primary text-primary-foreground' : 'bg-primary/12 text-primary border-primary/25',
    positive: prominence === 'solid' ? 'bg-emerald-600 text-white' : 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    warning: prominence === 'solid' ? 'bg-amber-600 text-white' : 'bg-amber-500/14 text-amber-800 dark:text-amber-300 border-amber-500/25',
    negative: prominence === 'solid' ? 'bg-rose-600 text-white' : 'bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/25',
    info: prominence === 'solid' ? 'bg-sky-600 text-white' : 'bg-sky-500/12 text-sky-700 dark:text-sky-300 border-sky-500/25'
  };

  return (
    <Badge
      variant="outline"
      className={cn(statusClasses[status] || statusClasses.neutral, className)}
      {...rest}
    >
      {IconComp && <IconComp className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </Badge>
  );
}

/**
 * shadcn/ui TabsList / TabsTrigger Wrapper
 */
export function AstryxSegmentedControl({
  options = [],
  value,
  onChange,
  size = 'md',
  className = ''
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'astryx-segmented-control bg-secondary/90 p-1 rounded-xl border border-border/60 inline-flex items-center gap-1',
        className
      )}
    >
      {options.map(opt => {
        const isSelected = value === opt.value;
        const IconComp = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(opt.value)}
            className={cn(
              'astryx-segmented-option rounded-lg px-3 py-1.5 text-xs font-medium transition-all inline-flex items-center gap-1.5',
              isSelected
                ? 'selected bg-card text-foreground shadow-xs font-semibold border border-border/50'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {IconComp && <IconComp className="w-3.5 h-3.5 shrink-0" />}
            <span>{opt.label}</span>
            {opt.badge !== undefined && opt.badge !== null && (
              <span className="astryx-segmented-badge">{opt.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * shadcn/ui Progress Wrapper
 */
export function AstryxProgressBar({
  value = 0,
  max = 100,
  variant = 'accent', // 'accent' | 'positive' | 'warning'
  size = 'md', // 'sm' | 'md' | 'lg'
  showLabel = false,
  label = '',
  className = ''
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;
  const indicatorVariant = {
    accent: 'bg-primary',
    positive: 'bg-emerald-600 dark:bg-emerald-400',
    warning: 'bg-amber-500'
  }[variant] || 'bg-primary';

  const sizeCls = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5'
  }[size] || 'h-2';

  return (
    <div className={cn('space-y-1.5', className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">{label}</span>
          <span className="font-semibold text-foreground">{pct}%</span>
        </div>
      )}
      <Progress
        value={value}
        max={max}
        className={sizeCls}
        indicatorClassName={indicatorVariant}
      />
    </div>
  );
}

/**
 * shadcn/ui Alert Wrapper
 */
export function AstryxBanner({
  status = 'info',
  title,
  children,
  icon: IconComp = null,
  action = null,
  className = ''
}) {
  return (
    <Alert className={cn(`astryx-banner astryx-banner-${status}`, className)}>
      {IconComp && <IconComp className="w-4 h-4 mt-0.5 text-primary" />}
      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex-1 min-w-0">
          {title && <AlertTitle className="mb-0.5">{title}</AlertTitle>}
          <AlertDescription>{children}</AlertDescription>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </Alert>
  );
}

/**
 * AI Agent Status Pill
 */
export function AstryxAgentStatus({ state = 'ready', label = '', onClick }) {
  const stateConfig = {
    thinking: {
      dot: 'bg-amber-500 animate-ping',
      solidDot: 'bg-amber-500',
      text: label || 'AI Agent · Thinking...',
      cls: 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300'
    },
    streaming: {
      dot: 'bg-sky-500 animate-ping',
      solidDot: 'bg-sky-500',
      text: label || 'AI Agent · Streaming...',
      cls: 'border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-300'
    },
    ready: {
      dot: '',
      solidDot: 'bg-emerald-500',
      text: label || 'AI Agent · Ready',
      cls: 'border-primary/25 bg-primary/10 text-primary'
    },
    offline: {
      dot: '',
      solidDot: 'bg-muted-foreground',
      text: label || 'AI · Local Mode',
      cls: 'border-border bg-secondary text-muted-foreground'
    }
  }[state] || {
    dot: '',
    solidDot: 'bg-emerald-500',
    text: label || 'AI Ready',
    cls: 'border-border bg-secondary text-muted-foreground'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 h-7 rounded-full border text-[11px] font-medium transition-all hover:opacity-90',
        stateConfig.cls
      )}
      title="Trạng thái kết nối AI Agent (Nhấn để mở Cài đặt AI)"
    >
      <span className="relative flex h-2 w-2">
        {stateConfig.dot && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${stateConfig.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${stateConfig.solidDot}`} />
      </span>
      <span className="truncate max-w-[140px]">{stateConfig.text}</span>
    </button>
  );
}

/**
 * Keyboard Shortcut Token
 */
export function AstryxKbd({ children, className = '' }) {
  return (
    <kbd className={cn('astryx-kbd', className)}>
      {children}
    </kbd>
  );
}

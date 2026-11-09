import React from 'react';
import { useApp } from '../context/AppContext';
import { Icons } from './Icons';

export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';
  const isError = toastMessage.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in duration-150">
      <div className="px-4 py-3 rounded-2xl border border-border bg-card text-foreground shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 max-w-sm">
        {isSuccess ? (
          <Icons.CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : isError ? (
          <Icons.AlertCircle className="w-4 h-4 text-destructive shrink-0" />
        ) : (
          <Icons.Sparkles className="w-4 h-4 text-primary shrink-0" />
        )}
        <span>{toastMessage.message}</span>
      </div>
    </div>
  );
}

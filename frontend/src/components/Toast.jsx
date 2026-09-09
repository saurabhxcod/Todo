import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertCircle, X, RotateCcw } from 'lucide-react';

export default function Toast({
  toast,
  onDismiss,
  onUndo
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    info: <Info className="w-4 h-4 text-indigo-400" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-400" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-down">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel border border-white/15 bg-slate-900/95 shadow-2xl text-slate-100 text-sm">
        <div className="p-1 rounded-lg bg-white/5">
          {icons[toast.type] || icons.success}
        </div>
        <span className="font-medium text-slate-200">{toast.message}</span>

        {toast.undoAction && onUndo && (
          <button
            onClick={() => {
              onUndo();
              onDismiss();
            }}
            className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        )}

        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all cursor-pointer ml-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

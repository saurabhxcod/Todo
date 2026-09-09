import React from 'react';
import { Calendar, Check, Clock, Edit2, Trash2, Tag, AlertCircle } from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../types/todo';

export default function TaskItem({
  todo,
  onToggle,
  onEdit,
  onDelete
}) {
  const priorityConfig = PRIORITIES[todo.priority?.toUpperCase()] || PRIORITIES.MEDIUM;
  const categoryConfig = CATEGORIES.find(c => c.id === todo.category) || CATEGORIES[0];

  // Calculate due date status
  let dueDateLabel = null;
  let isOverdue = false;
  let isDueToday = false;

  if (todo.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0 && !todo.completed) {
      isOverdue = true;
      dueDateLabel = `Overdue by ${Math.abs(diffDays)}d`;
    } else if (diffDays === 0) {
      isDueToday = true;
      dueDateLabel = 'Due Today';
    } else if (diffDays === 1) {
      dueDateLabel = 'Due Tomorrow';
    } else {
      dueDateLabel = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  }

  return (
    <div
      className={`group relative rounded-2xl glass-panel p-4 sm:p-5 transition-all duration-300 border ${
        todo.completed
          ? 'opacity-70 bg-slate-900/40 border-white/5'
          : 'glass-panel-interactive border-white/10 hover:border-indigo-500/30'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Custom Animated Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={todo.completed}
          onClick={() => onToggle(todo.id)}
          className={`shrink-0 relative mt-1 w-6 h-6 rounded-lg border transition-all duration-200 flex items-center justify-center cursor-pointer ${
            todo.completed
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-emerald-400 shadow-md shadow-emerald-500/25'
              : 'border-slate-600 bg-slate-800/60 hover:border-indigo-400 hover:bg-slate-800 focus:ring-2 focus:ring-indigo-500/40'
          }`}
        >
          {todo.completed && (
            <Check className="w-4 h-4 text-white stroke-[3] animate-pop-in" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {/* Category Tag */}
            <span
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${categoryConfig.color}`}
            >
              {categoryConfig.label}
            </span>

            {/* Priority Badge */}
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1.5 ${priorityConfig.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dotColor}`} />
              {priorityConfig.label}
            </span>

            {/* Due Date Indicator */}
            {dueDateLabel && (
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                  isOverdue
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    : isDueToday
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : 'bg-slate-800/80 text-slate-400 border-white/5'
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                ) : (
                  <Calendar className="w-3 h-3 text-slate-400" />
                )}
                {dueDateLabel}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onToggle(todo.id)}
            className={`text-base font-semibold tracking-tight cursor-pointer select-none transition-colors ${
              todo.completed
                ? 'line-through text-slate-500'
                : 'text-slate-100 hover:text-indigo-300'
            }`}
          >
            {todo.title}
          </h3>

          {/* Description */}
          {todo.description && (
            <p
              className={`text-sm mt-1 line-clamp-2 transition-colors ${
                todo.completed ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              {todo.description}
            </p>
          )}
        </div>

        {/* Action Buttons (Edit & Delete) */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(todo)}
            title="Edit task"
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-white/5 transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo)}
            title="Delete task"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

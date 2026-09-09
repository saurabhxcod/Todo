import React from 'react';
import { CheckCircle2, ClipboardList, Plus, SearchX } from 'lucide-react';
import TaskItem from './TaskItem';

export default function TaskList({
  todos,
  onToggle,
  onEdit,
  onDelete,
  onOpenCreateModal,
  onClearFilters,
  isFiltered
}) {
  if (todos.length === 0) {
    return (
      <div className="rounded-3xl glass-panel border border-white/10 p-12 text-center flex flex-col items-center justify-center my-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
          {isFiltered ? <SearchX className="w-8 h-8" /> : <ClipboardList className="w-8 h-8" />}
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          {isFiltered ? 'No matching tasks found' : 'No tasks in your workspace yet'}
        </h3>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          {isFiltered
            ? 'Try changing your search term, switching status tabs, or clearing your filters.'
            : 'Get ahead of your schedule by creating your first task today.'}
        </p>

        {isFiltered ? (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-white/10 transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        ) : (
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Task</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {todos.map((todo) => (
        <TaskItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

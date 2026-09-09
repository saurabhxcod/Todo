import React from 'react';
import { Filter, ArrowUpDown, Tag, Check, Sparkles, RefreshCw } from 'lucide-react';
import { CATEGORIES, PRIORITIES, SORT_OPTIONS } from '../types/todo';

export default function TaskControls({
  statusFilter,
  setStatusFilter,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  sortBy,
  setSortBy,
  todos,
  onResetData
}) {
  const allCount = todos.length;
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Top Row: Status Tabs & Sorter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All <span className="ml-1 opacity-70">({allCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active <span className="ml-1 opacity-70">({activeCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Completed <span className="ml-1 opacity-70">({completedCount})</span>
          </button>
        </div>

        {/* Priority & Sort Dropdowns + Reset */}
        <div className="flex items-center gap-2">
          {/* Priority filter */}
          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-medium bg-slate-900/90 border border-white/10 text-slate-300 glass-input cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-medium bg-slate-900/90 border border-white/10 text-slate-300 glass-input cursor-pointer"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Reset sample data button */}
          <button
            onClick={onResetData}
            title="Reset sample tasks"
            className="p-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Category Pill Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-500 text-xs font-medium flex items-center gap-1 shrink-0 mr-1">
          <Tag className="w-3.5 h-3.5" /> Category:
        </span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full shrink-0 font-medium transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-200 text-slate-900 font-semibold shadow-sm'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-white/5'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = todos.filter(t => t.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full shrink-0 font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? `${cat.color} font-semibold ring-1 ring-white/20`
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              <span>{cat.label}</span>
              {count > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

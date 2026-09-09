import React from 'react';
import { CheckCircle, Clock, AlertTriangle, ListTodo, TrendingUp } from 'lucide-react';

export default function StatsOverview({ todos }) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  const highPriorityPending = todos.filter(t => !t.completed && t.priority === 'high').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      icon: ListTodo,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
    {
      label: 'In Progress',
      value: pending,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      label: 'High Priority',
      value: highPriorityPending,
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20'
    }
  ];

  return (
    <section className="mb-8">
      {/* Top Banner with Completion Percentage */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-6 glass-panel border border-white/10 shadow-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Workspace Performance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Outfit']">
              Manage Your Daily Focus
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              {pending === 0 && total > 0
                ? "🎉 Amazing! All your tasks are completed. Take a breather or add new goals."
                : `You have ${pending} ${pending === 1 ? 'task' : 'tasks'} waiting for your attention today.`}
            </p>
          </div>

          {/* Progress Circular/Bar Display */}
          <div className="flex items-center gap-5 bg-slate-900/60 p-4 rounded-2xl border border-white/5 backdrop-blur-md self-start md:self-auto min-w-[240px]">
            <div className="relative flex items-center justify-center w-14 h-14">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500 transition-all duration-700 ease-out"
                  strokeDasharray={`${completionRate}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-bold text-white">{completionRate}%</span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Completion Rate</div>
              <div className="text-base font-bold text-white">
                {completed} of {total} Done
              </div>
              <div className="text-[11px] text-slate-400">
                {highPriorityPending > 0 ? (
                  <span className="text-rose-400 font-medium">● {highPriorityPending} urgent pending</span>
                ) : (
                  <span className="text-emerald-400 font-medium">● No urgent blockers</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`p-4 rounded-2xl glass-panel border ${stat.border} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight font-['Outfit']">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

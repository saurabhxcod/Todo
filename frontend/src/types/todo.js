export const PRIORITIES = {
  LOW: {
    id: 'low',
    label: 'Low',
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    dotColor: 'bg-sky-400',
    weight: 1
  },
  MEDIUM: {
    id: 'medium',
    label: 'Medium',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    dotColor: 'bg-amber-400',
    weight: 2
  },
  HIGH: {
    id: 'high',
    label: 'High',
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    dotColor: 'bg-rose-400',
    weight: 3
  }
};

export const CATEGORIES = [
  { id: 'Work', label: 'Work', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  { id: 'Personal', label: 'Personal', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  { id: 'Study', label: 'Study', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  { id: 'Shopping', label: 'Shopping', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  { id: 'Health', label: 'Health', color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
  { id: 'Finance', label: 'Finance', color: 'bg-teal-500/15 text-teal-300 border-teal-500/30' },
  { id: 'Other', label: 'Other', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' }
];

export const SORT_OPTIONS = [
  { id: 'createdDesc', label: 'Recently Added' },
  { id: 'dueDateAsc', label: 'Due Date (Earliest)' },
  { id: 'dueDateDesc', label: 'Due Date (Latest)' },
  { id: 'priorityDesc', label: 'Highest Priority' },
  { id: 'titleAsc', label: 'Title (A-Z)' }
];

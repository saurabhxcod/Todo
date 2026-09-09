import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import TaskControls from './components/TaskControls';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import { todoService } from './services/todoService';
import { PRIORITIES } from './types/todo';
import { Server, Code, CheckCircle } from 'lucide-react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'completed'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('createdDesc');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  // Notifications & Undo state
  const [toast, setToast] = useState(null);
  const [lastDeletedTodo, setLastDeletedTodo] = useState(null);

  // Backend status state
  const [backendHealth, setBackendHealth] = useState(null);

  // Load initial tasks & check backend status
  useEffect(() => {
    async function loadData() {
      try {
        const data = await todoService.getTodos();
        setTodos(data);
      } catch (err) {
        console.error('Failed to load todos:', err);
      } finally {
        setLoading(false);
      }

      // Query backend health endpoint
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const health = await res.json();
          setBackendHealth(health);
        }
      } catch (err) {
        // Backend not reached or offline
        setBackendHealth(null);
      }
    }
    loadData();
  }, []);

  // Keyboard shortcut 'N' to open New Task modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key.toLowerCase() === 'n' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) &&
        !isTaskModalOpen &&
        !isConfirmModalOpen
      ) {
        e.preventDefault();
        setEditingTodo(null);
        setIsTaskModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen, isConfirmModalOpen]);

  // Handle Toggle completion
  const handleToggleTodo = async (id) => {
    const updated = await todoService.toggleTodo(id);
    if (updated) {
      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
      setToast({
        type: 'success',
        message: updated.completed ? '✓ Task marked as completed' : 'Task marked as in progress'
      });
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingTodo(null);
    setIsTaskModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (todo) => {
    setEditingTodo(todo);
    setIsTaskModalOpen(true);
  };

  // Submit Create or Edit
  const handleSubmitTask = async (taskData) => {
    if (editingTodo) {
      const updated = await todoService.updateTodo(editingTodo.id, taskData);
      setTodos(prev => prev.map(t => (t.id === editingTodo.id ? updated : t)));
      setToast({ type: 'info', message: 'Task updated successfully' });
    } else {
      const created = await todoService.createTodo(taskData);
      setTodos(prev => [created, ...prev]);
      setToast({ type: 'success', message: 'Task created successfully' });
    }
    setIsTaskModalOpen(false);
    setEditingTodo(null);
  };

  // Prompt Delete Confirmation
  const handlePromptDelete = (todo) => {
    setTodoToDelete(todo);
    setIsConfirmModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!todoToDelete) return;
    const toDelete = todoToDelete;
    await todoService.deleteTodo(toDelete.id);
    setTodos(prev => prev.filter(t => t.id !== toDelete.id));
    setLastDeletedTodo(toDelete);
    setIsConfirmModalOpen(false);
    setTodoToDelete(null);

    setToast({
      type: 'warning',
      message: `Deleted "${toDelete.title}"`,
      undoAction: true
    });
  };

  // Undo Delete
  const handleUndoDelete = async () => {
    if (!lastDeletedTodo) return;
    const restored = await todoService.createTodo(lastDeletedTodo);
    setTodos(prev => [restored, ...prev]);
    setLastDeletedTodo(null);
    setToast({ type: 'success', message: 'Task restored' });
  };

  // Reset sample data
  const handleResetData = async () => {
    const sample = await todoService.resetToSampleData();
    setTodos(sample);
    setToast({ type: 'info', message: 'Sample tasks reloaded' });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSelectedCategory('all');
    setSelectedPriority('all');
  };

  // Filtered & Sorted list calculation
  const filteredAndSortedTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        // Status filter
        if (statusFilter === 'active' && todo.completed) return false;
        if (statusFilter === 'completed' && !todo.completed) return false;

        // Category filter
        if (selectedCategory !== 'all' && todo.category !== selectedCategory) return false;

        // Priority filter
        if (selectedPriority !== 'all' && todo.priority !== selectedPriority) return false;

        // Search term
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = todo.title.toLowerCase().includes(query);
          const matchDesc = (todo.description || '').toLowerCase().includes(query);
          const matchCat = (todo.category || '').toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'createdDesc') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === 'dueDateAsc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'dueDateDesc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        }
        if (sortBy === 'priorityDesc') {
          const weightA = PRIORITIES[a.priority?.toUpperCase()]?.weight || 0;
          const weightB = PRIORITIES[b.priority?.toUpperCase()]?.weight || 0;
          return weightB - weightA;
        }
        if (sortBy === 'titleAsc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [todos, statusFilter, selectedCategory, selectedPriority, searchTerm, sortBy]);

  const isFiltered = Boolean(
    searchTerm || statusFilter !== 'all' || selectedCategory !== 'all' || selectedPriority !== 'all'
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenCreateModal={handleOpenCreateModal}
        totalTasks={todos.length}
        completedTasks={todos.filter(t => t.completed).length}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workspace Metrics & Banner */}
        <StatsOverview todos={todos} />

        {/* Filters, Tabs & Sorting Controls */}
        <TaskControls
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          sortBy={sortBy}
          setSortBy={setSortBy}
          todos={todos}
          onResetData={handleResetData}
        />

        {/* Task Items List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <TaskList
            todos={filteredAndSortedTodos}
            onToggle={handleToggleTodo}
            onEdit={handleOpenEditModal}
            onDelete={handlePromptDelete}
            onOpenCreateModal={handleOpenCreateModal}
            onClearFilters={handleClearFilters}
            isFiltered={isFiltered}
          />
        )}
      </main>

      {/* Footer Info & MVC Backend Status Bar */}
      <footer className="mt-auto border-t border-white/5 bg-slate-950/60 backdrop-blur-md py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Frontend React 19 + Tailwind CSS Active</span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
              <Code className="w-3.5 h-3.5" /> MVC Architecture Ready
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5 text-slate-300">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span>Node.js Backend:</span>
              <span className={backendHealth ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                {backendHealth ? 'Online (MVC Ready)' : 'Port 5000'}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Task Modal (Create / Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleSubmitTask}
        initialData={editingTodo}
      />

      {/* Confirm Deletion Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Delete Task"
        message={
          todoToDelete
            ? `Are you sure you want to delete "${todoToDelete.title}"? You can undo this action immediately after deleting.`
            : 'Are you sure you want to delete this task?'
        }
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setTodoToDelete(null);
        }}
      />

      {/* Toast Notification */}
      <Toast
        toast={toast}
        onDismiss={() => setToast(null)}
        onUndo={handleUndoDelete}
      />
    </div>
  );
}

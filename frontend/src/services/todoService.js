/**
 * Todo Service Layer
 * 
 * Provides an abstracted data API for the frontend.
 * Currently uses reactive LocalStorage persistence so all features work seamlessly.
 * When the backend CRUD feature is activated, toggling USE_BACKEND_API to true
 * maps all operations directly to the Express MVC API routes.
 */

const STORAGE_KEY = 'taskflow_todos_v1';
export const USE_BACKEND_API = false;
const API_BASE = '/api/todos';

// Rich initial sample tasks
const INITIAL_TODOS = [
  {
    id: 'task-1',
    title: 'Design high-converting Landing Page',
    description: 'Create wireframes in Figma and implement glassmorphic UI hero section.',
    category: 'Work',
    priority: 'high',
    completed: false,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'task-2',
    title: 'Review MVC backend architecture',
    description: 'Verify controllers, models, and route mappings in Express server.',
    category: 'Study',
    priority: 'medium',
    completed: true,
    dueDate: new Date().toISOString().split('T')[0], // Today
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'task-3',
    title: 'Morning 5km jog & hydration routine',
    description: 'Cardio training and stretch session before deep work block.',
    category: 'Health',
    priority: 'low',
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'task-4',
    title: 'Prepare quarterly expense report',
    description: 'Compile receipts and verify cloud hosting and SaaS subscriptions.',
    category: 'Finance',
    priority: 'high',
    completed: false,
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

export const todoService = {
  // Fetch all tasks
  async getTodos() {
    if (USE_BACKEND_API) {
      const res = await fetch(API_BASE);
      const data = await res.json();
      return data.data || [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TODOS));
        return INITIAL_TODOS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_TODOS;
    }
  },

  // Create a new task
  async createTodo(todoData) {
    if (USE_BACKEND_API) {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData)
      });
      return await res.json();
    }

    const todos = await this.getTodos();
    const newTodo = {
      id: `task-${Date.now()}`,
      title: todoData.title.trim(),
      description: (todoData.description || '').trim(),
      category: todoData.category || 'Work',
      priority: todoData.priority || 'medium',
      completed: false,
      dueDate: todoData.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [newTodo, ...todos];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newTodo;
  },

  // Update task details
  async updateTodo(id, updates) {
    if (USE_BACKEND_API) {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return await res.json();
    }

    const todos = await this.getTodos();
    let updatedItem = null;
    const updated = todos.map(t => {
      if (t.id === id) {
        updatedItem = {
          ...t,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        return updatedItem;
      }
      return t;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updatedItem;
  },

  // Toggle completion status
  async toggleTodo(id) {
    const todos = await this.getTodos();
    const target = todos.find(t => t.id === id);
    if (!target) return null;
    return this.updateTodo(id, { completed: !target.completed });
  },

  // Delete task
  async deleteTodo(id) {
    if (USE_BACKEND_API) {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      return await res.json();
    }

    const todos = await this.getTodos();
    const filtered = todos.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { success: true, id };
  },

  // Reset to initial sample tasks
  async resetToSampleData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TODOS));
    return INITIAL_TODOS;
  }
};

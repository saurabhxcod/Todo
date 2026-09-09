/**
 * Todo Model Blueprint
 * 
 * Defines the data structure, constraints, and validation rules
 * for Todo items. Prepared for database integration (e.g., MongoDB, PostgreSQL, SQLite)
 * when CRUD implementation is requested.
 */

export const TodoPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const TodoCategory = {
  WORK: 'Work',
  PERSONAL: 'Personal',
  SHOPPING: 'Shopping',
  STUDY: 'Study',
  HEALTH: 'Health',
  OTHER: 'Other'
};

export class TodoModel {
  constructor({
    id,
    title,
    description = '',
    category = TodoCategory.PERSONAL,
    priority = TodoPriority.MEDIUM,
    completed = false,
    dueDate = null,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.priority = priority;
    this.completed = completed;
    this.dueDate = dueDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Basic validation rule for a Todo item
   */
  static validate(payload) {
    const errors = [];

    if (!payload.title || typeof payload.title !== 'string' || !payload.title.trim()) {
      errors.push('Title is required and must be a non-empty string.');
    }

    if (payload.priority && !Object.values(TodoPriority).includes(payload.priority)) {
      errors.push(`Priority must be one of: ${Object.values(TodoPriority).join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

import { TaskManager } from './taskManager.js';
import { UIManager } from './uiManager.js';
import { TodoService } from './todoService.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the app
  const todoService = new TodoService();
  const taskManager = new TaskManager(todoService);
  const uiManager = new UIManager(taskManager);
  
  // Load tasks on initialization
  taskManager.loadTasks().then(() => {
    uiManager.renderTasks();
  });
  
  // Add event listeners
  document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    uiManager.handleAddTask();
  });
  
  document.getElementById('edit-task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    uiManager.handleEditTask();
  });
  
  document.querySelector('.close-modal').addEventListener('click', () => {
    uiManager.closeModal();
  });
  
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('edit-modal');
    if (e.target === modal) {
      uiManager.closeModal();
    }
  });
  
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      uiManager.filterTasks(filter);
      
      // Update active button
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});
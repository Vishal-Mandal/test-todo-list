export class UIManager {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.tasksList = document.getElementById('tasks-list');
    this.taskForm = document.getElementById('task-form');
    this.editModal = document.getElementById('edit-modal');
    this.editForm = document.getElementById('edit-task-form');
    this.taskCountEl = document.getElementById('task-count');
  }
  
  async handleAddTask() {
    const nameInput = document.getElementById('task-name');
    const descriptionInput = document.getElementById('task-description');
    const deadlineInput = document.getElementById('task-deadline');
    
    const task = {
      name: nameInput.value.trim(),
      description: descriptionInput.value.trim(),
      deadline: deadlineInput.value
    };
    
    if (!task.name || !task.description || !task.deadline) {
      this.shakeElement(this.taskForm);
      return;
    }
    
    const success = await this.taskManager.addTask(task);
    
    if (success) {
      this.renderTasks();
      this.resetForm();
    }
  }
  
  async handleEditTask() {
    const taskId = document.getElementById('edit-task-id').value;
    const nameInput = document.getElementById('edit-task-name');
    const descriptionInput = document.getElementById('edit-task-description');
    const deadlineInput = document.getElementById('edit-task-deadline');
    
    const task = {
      id: taskId,
      name: nameInput.value.trim(),
      description: descriptionInput.value.trim(),
      deadline: deadlineInput.value
    };
    
    if (!task.name || !task.description || !task.deadline) {
      this.shakeElement(this.editForm);
      return;
    }
    
    const success = await this.taskManager.updateTask(task);
    
    if (success) {
      this.renderTasks();
      this.closeModal();
    }
  }
  
  async handleDeleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      const success = await this.taskManager.deleteTask(taskId);
      
      if (success) {
        this.renderTasks();
      }
    }
  }
  
  async handleToggleCompletion(taskId) {
    const success = await this.taskManager.toggleTaskCompletion(taskId);
    
    if (success) {
      this.renderTasks();
    }
  }
  
  openEditModal(taskId) {
    const task = this.taskManager.getTask(taskId);
    
    if (task) {
      document.getElementById('edit-task-id').value = task.id;
      document.getElementById('edit-task-name').value = task.name;
      document.getElementById('edit-task-description').value = task.description;
      document.getElementById('edit-task-deadline').value = task.deadline;
      
      this.editModal.classList.add('show');
    }
  }
  
  closeModal() {
    this.editModal.classList.remove('show');
  }
  
  resetForm() {
    this.taskForm.reset();
  }
  
  shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
      element.classList.remove('shake');
    }, 500);
  }
  
  renderTasks() {
    const filteredTasks = this.taskManager.getFilteredTasks();
    this.tasksList.innerHTML = '';
    
    // Update task count
    this.taskCountEl.textContent = `(${filteredTasks.length})`;
    
    if (filteredTasks.length === 0) {
      this.renderEmptyState();
      return;
    }
    
    // Sort tasks: non-completed first, then by deadline
    const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(a.deadline) - new Date(b.deadline);
    });
    
    sortedTasks.forEach(task => {
      this.renderTaskCard(task);
    });
  }
  
  renderTaskCard(task) {
    const taskStatus = this.taskManager.getTaskStatus(task);
    const deadlineDate = new Date(task.deadline);
    const formattedDate = this.formatDate(deadlineDate);
    
    const taskElement = document.createElement('div');
    taskElement.className = `task-card ${taskStatus}`;
    taskElement.setAttribute('data-id', task.id);
    
    taskElement.innerHTML = `
      <div class="task-header">
        <h3 class="task-title">${task.name}</h3>
        <div class="task-actions">
          <button class="complete-btn" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
            <i class="fas ${task.completed ? 'fa-times-circle' : 'fa-check-circle'}"></i>
          </button>
          <button class="edit-btn" title="Edit task">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn" title="Delete task">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      <div class="task-description">${task.description}</div>
      <div class="task-meta">
        <div class="task-deadline">
          <span class="deadline-indicator ${taskStatus}"></span>
          <span>${formattedDate}</span>
        </div>
        <div class="task-status ${taskStatus}">
          ${this.getStatusText(taskStatus)}
        </div>
      </div>
    `;
    
    // Add event listeners
    taskElement.querySelector('.complete-btn').addEventListener('click', () => {
      this.handleToggleCompletion(task.id);
    });
    
    taskElement.querySelector('.edit-btn').addEventListener('click', () => {
      this.openEditModal(task.id);
    });
    
    taskElement.querySelector('.delete-btn').addEventListener('click', () => {
      this.handleDeleteTask(task.id);
    });
    
    this.tasksList.appendChild(taskElement);
  }
  
  renderEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    
    let message = 'No tasks found';
    if (this.taskManager.currentFilter === 'active') {
      message = 'No active tasks';
    } else if (this.taskManager.currentFilter === 'completed') {
      message = 'No completed tasks';
    }
    
    emptyState.innerHTML = `
      <i class="fas fa-clipboard-list"></i>
      <p>${message}</p>
      <p>Add a new task to get started</p>
    `;
    
    this.tasksList.appendChild(emptyState);
  }
  
  filterTasks(filter) {
    this.taskManager.setFilter(filter);
    this.renderTasks();
  }
  
  formatDate(date) {
    const options = { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  }
  
  getStatusText(status) {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'overdue':
        return 'Overdue';
      case 'approaching':
        return 'Due soon';
      default:
        return 'Active';
    }
  }
}
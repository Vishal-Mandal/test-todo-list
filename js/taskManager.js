export class TaskManager {
  constructor(todoService) {
    this.todoService = todoService;
    this.tasks = [];
    this.currentFilter = 'all';
  }
  
  async loadTasks() {
    try {
      this.tasks = await this.todoService.getTasks();
      return this.tasks;
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }
  
  async addTask(task) {
    try {
      // Generate a unique ID
      task.id = Date.now().toString();
      task.completed = false;
      task.createdAt = new Date().toISOString();
      
      this.tasks.push(task);
      await this.todoService.saveTasks(this.tasks);
      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      return false;
    }
  }
  
  async updateTask(updatedTask) {
    try {
      const index = this.tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        // Preserve the completion status and creation date
        updatedTask.completed = this.tasks[index].completed;
        updatedTask.createdAt = this.tasks[index].createdAt;
        
        this.tasks[index] = updatedTask;
        await this.todoService.saveTasks(this.tasks);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating task:', error);
      return false;
    }
  }
  
  async deleteTask(taskId) {
    try {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      await this.todoService.saveTasks(this.tasks);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }
  
  async toggleTaskCompletion(taskId) {
    try {
      const task = this.tasks.find(task => task.id === taskId);
      if (task) {
        task.completed = !task.completed;
        await this.todoService.saveTasks(this.tasks);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error toggling task completion:', error);
      return false;
    }
  }
  
  getTask(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }
  
  getFilteredTasks() {
    switch (this.currentFilter) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }
  
  setFilter(filter) {
    this.currentFilter = filter;
  }
  
  getTaskStatus(task) {
    if (task.completed) {
      return 'completed';
    }
    
    const deadline = new Date(task.deadline);
    const now = new Date();
    const timeDiff = deadline.getTime() - now.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    
    if (timeDiff < 0) {
      return 'overdue';
    } else if (daysDiff <= 1) {
      return 'approaching';
    } else {
      return 'active';
    }
  }
}
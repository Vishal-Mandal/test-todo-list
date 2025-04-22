export class TodoService {
  constructor() {
    this.STORAGE_KEY = 'tasks.txt';
  }
  
  // This simulates reading from a text file
  // In a real environment, this would use actual file system operations
  async getTasks() {
    try {
      const tasksJson = localStorage.getItem(this.STORAGE_KEY);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Error reading tasks:', error);
      return [];
    }
  }
  
  // This simulates writing to a text file
  async saveTasks(tasks) {
    try {
      const tasksJson = JSON.stringify(tasks, null, 2);
      localStorage.setItem(this.STORAGE_KEY, tasksJson);
      return true;
    } catch (error) {
      console.error('Error saving tasks:', error);
      return false;
    }
  }
  
  // In a browser environment, we need to simulate file operations with LocalStorage
  // This method emulates downloading the text file
  downloadTasksFile() {
    try {
      const tasksJson = localStorage.getItem(this.STORAGE_KEY);
      if (!tasksJson) return false;
      
      const blob = new Blob([tasksJson], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = this.STORAGE_KEY;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      return true;
    } catch (error) {
      console.error('Error downloading tasks file:', error);
      return false;
    }
  }
  
  // Method to simulate importing tasks from a text file
  setupFileImport(fileInputElement, onImportComplete) {
    fileInputElement.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const tasks = JSON.parse(e.target.result);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
          if (onImportComplete) onImportComplete(tasks);
        } catch (error) {
          console.error('Error importing tasks file:', error);
          alert('Invalid tasks file format');
        }
      };
      
      reader.readAsText(file);
    });
  }
}
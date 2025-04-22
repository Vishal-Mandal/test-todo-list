export class FileManager {
  constructor(todoService) {
    this.todoService = todoService;
  }
  
  // Create necessary UI elements for file operations
  createFileControls(parentElement) {
    const fileControls = document.createElement('div');
    fileControls.className = 'file-controls';
    
    // Export button
    const exportBtn = document.createElement('button');
    exportBtn.className = 'file-btn export-btn';
    exportBtn.innerHTML = '<i class="fas fa-download"></i> Export Tasks';
    exportBtn.addEventListener('click', () => this.exportTasks());
    
    // Import button and hidden file input
    const importBtn = document.createElement('button');
    importBtn.className = 'file-btn import-btn';
    importBtn.innerHTML = '<i class="fas fa-upload"></i> Import Tasks';
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'import-file';
    fileInput.accept = '.txt';
    fileInput.style.display = 'none';
    
    importBtn.addEventListener('click', () => fileInput.click());
    
    // Set up the import handler
    this.todoService.setupFileImport(fileInput, () => {
      // Dispatch a custom event that the main app can listen for
      const event = new CustomEvent('tasksImported');
      document.dispatchEvent(event);
    });
    
    // Add elements to the container
    fileControls.appendChild(exportBtn);
    fileControls.appendChild(importBtn);
    fileControls.appendChild(fileInput);
    
    // Add to parent
    parentElement.appendChild(fileControls);
  }
  
  // Export tasks to a text file
  exportTasks() {
    this.todoService.downloadTasksFile();
  }
  
  // Add CSS styles for file controls
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .file-controls {
        display: flex;
        gap: var(--spacing-md);
        margin-top: var(--spacing-md);
      }
      
      .file-btn {
        background-color: var(--background-color);
        border: 1px solid var(--border-color);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--border-radius-md);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-size: var(--font-size-sm);
        transition: all 0.2s ease;
      }
      
      .file-btn:hover {
        background-color: var(--primary-light);
        color: white;
      }
      
      .export-btn:hover {
        background-color: var(--primary-color);
      }
      
      .import-btn:hover {
        background-color: var(--accent-color);
      }
    `;
    
    document.head.appendChild(style);
  }
}
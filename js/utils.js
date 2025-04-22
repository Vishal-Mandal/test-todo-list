// Utility functions for the Todo app

/**
 * Format a date for display
 * @param {Date|string} date - Date object or ISO string
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const defaultOptions = { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  };
  
  const formatOptions = { ...defaultOptions, ...options };
  return dateObj.toLocaleDateString('en-US', formatOptions);
}

/**
 * Calculate time remaining until a deadline
 * @param {Date|string} deadline - Deadline date
 * @returns {Object} Time remaining details
 */
export function getTimeRemaining(deadline) {
  const deadlineDate = deadline instanceof Date ? deadline : new Date(deadline);
  const now = new Date();
  
  // Time difference in milliseconds
  const timeDiff = deadlineDate.getTime() - now.getTime();
  
  // Check if deadline has passed
  if (timeDiff <= 0) {
    return {
      expired: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      text: 'Expired'
    };
  }
  
  // Calculate time units
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
  // Generate human-readable text
  let text = '';
  if (days > 0) {
    text = `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    text = `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    text = `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    text = `${seconds} second${seconds > 1 ? 's' : ''}`;
  }
  
  return {
    expired: false,
    days,
    hours,
    minutes,
    seconds,
    text: `${text} left`
  };
}

/**
 * Shorten text with ellipsis if it exceeds max length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncating
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Generate a color based on task status
 * @param {string} status - Task status
 * @returns {string} CSS color variable
 */
export function getStatusColor(status) {
  switch (status) {
    case 'completed':
      return 'var(--secondary-color)';
    case 'overdue':
      return 'var(--danger-color)';
    case 'approaching':
      return 'var(--warning-color)';
    default:
      return 'var(--primary-color)';
  }
}

/**
 * Create a throttled function that only invokes func at most once per wait period
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle
 * @returns {Function} Throttled function
 */
export function throttle(func, wait = 100) {
  let timeout = null;
  let previous = 0;
  
  return function(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}
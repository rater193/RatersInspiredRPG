/**
 * Logger utility - Manages action log display
 */
export class Logger {
  constructor(maxEntries = 50) {
    this.maxEntries = maxEntries;
    this.entries = [];
    this.logElement = null;
  }

  /**
   * Set the DOM element for log display
   */
  setElement(element) {
    this.logElement = element;
  }

  /**
   * Add a log entry
   */
  log(message) {
    this.entries.push(message);
    
    // Keep only recent entries
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }
    
    this.render();
  }

  /**
   * Clear all log entries
   */
  clear() {
    this.entries = [];
    this.render();
  }

  /**
   * Render log to DOM
   */
  render() {
    if (!this.logElement) return;
    
    if (this.entries.length === 0) {
      this.logElement.innerHTML = '<div class="log-entry">Welcome to Gielinor!</div>';
      return;
    }
    
    const html = this.entries
      .map(entry => `<div class="log-entry">${this.escapeHtml(entry)}</div>`)
      .join('');
    
    this.logElement.innerHTML = html;
    
    // Auto-scroll to bottom
    this.logElement.scrollTop = this.logElement.scrollHeight;
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}

/**
 * Create singleton logger instance
 */
export const logger = new Logger();

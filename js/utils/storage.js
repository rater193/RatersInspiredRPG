/**
 * Storage utility - Handles saving/loading game state
 */
export class StorageManager {
  constructor(storageKey = 'idleRpgSave') {
    this.storageKey = storageKey;
  }

  /**
   * Save game state to localStorage
   */
  save(gameState) {
    try {
      const data = JSON.stringify(gameState);
      localStorage.setItem(this.storageKey, data);
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  /**
   * Load game state from localStorage
   */
  load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  /**
   * Check if save exists
   */
  hasSave() {
    return localStorage.getItem(this.storageKey) !== null;
  }

  /**
   * Delete saved game
   */
  deleteSave() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Failed to delete save:', error);
      return false;
    }
  }
}

/**
 * Create singleton storage manager
 */
export const storage = new StorageManager();

/**
 * Item class - Represents an item in the game
 */
export class Item {
  constructor(id, name, quantity = 1) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
  }

  /**
   * Create an item from a plain object
   */
  static fromJSON(data) {
    return new Item(data.id, data.name, data.quantity);
  }

  /**
   * Convert to plain object for saving
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      quantity: this.quantity
    };
  }
}

/**
 * Skill class - Represents a player skill with level and XP
 */
export class Skill {
  constructor(name, level = 1, xp = 0) {
    this.name = name;
    this.level = level;
    this.xp = xp;
  }

  /**
   * Calculate XP required for next level
   */
  getXpForNextLevel() {
    return Math.floor(100 * Math.pow(1.15, this.level - 1));
  }

  /**
   * Get progress to next level as a percentage (0-1)
   */
  getProgress() {
    const required = this.getXpForNextLevel();
    return Math.min(this.xp / required, 1);
  }

  /**
   * Add XP and handle leveling up
   * @returns {boolean} true if leveled up
   */
  addXp(amount) {
    this.xp += amount;
    let leveledUp = false;
    
    while (this.xp >= this.getXpForNextLevel()) {
      this.xp -= this.getXpForNextLevel();
      this.level++;
      leveledUp = true;
    }
    
    return leveledUp;
  }

  static fromJSON(name, data) {
    return new Skill(name, data.level, data.xp);
  }

  toJSON() {
    return {
      level: this.level,
      xp: this.xp
    };
  }
}

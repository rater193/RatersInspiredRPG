import { Skill, Item } from './Item.js';

/**
 * Player class - Represents the player character
 */
export class Player {
  constructor() {
    this.name = "Adventurer";
    this.maxHp = 30;
    this.hp = 30;
    this.gold = 20;
    this.inventoryCapacity = 20;
    this.inventory = [];
    
    // Initialize skills
    this.skills = {
      Attack: new Skill('Attack'),
      Strength: new Skill('Strength'),
      Defense: new Skill('Defense'),
      Hitpoints: new Skill('Hitpoints'),
      Agility: new Skill('Agility'),
      Mining: new Skill('Mining'),
      Smelting: new Skill('Smelting'),
      Smithing: new Skill('Smithing')
    };
  }

  /**
   * Get a skill by name
   */
  getSkill(name) {
    return this.skills[name];
  }

  /**
   * Add XP to a skill
   * @returns {boolean} true if leveled up
   */
  addSkillXp(skillName, amount) {
    const skill = this.skills[skillName];
    if (!skill) return false;
    return skill.addXp(amount);
  }

  /**
   * Take damage
   */
  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
  }

  /**
   * Heal
   */
  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }

  /**
   * Check if player is alive
   */
  isAlive() {
    return this.hp > 0;
  }

  /**
   * Get HP as percentage (0-1)
   */
  getHpPercent() {
    return this.hp / this.maxHp;
  }

  /**
   * Get current inventory count
   */
  getInventoryCount() {
    return this.inventory.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Check if inventory has space
   */
  hasInventorySpace(amount = 1) {
    return this.getInventoryCount() + amount <= this.inventoryCapacity;
  }

  /**
   * Add item to inventory
   * @returns {boolean} true if successful
   */
  addItem(id, name, quantity = 1) {
    if (!this.hasInventorySpace(quantity)) {
      return false;
    }

    const existing = this.inventory.find(item => item.id === id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.inventory.push(new Item(id, name, quantity));
    }
    return true;
  }

  /**
   * Remove item from inventory
   * @returns {boolean} true if successful
   */
  removeItem(id, quantity = 1) {
    const item = this.inventory.find(i => i.id === id);
    if (!item || item.quantity < quantity) {
      return false;
    }

    item.quantity -= quantity;
    if (item.quantity <= 0) {
      this.inventory = this.inventory.filter(i => i.id !== id);
    }
    return true;
  }

  /**
   * Check if player has item(s)
   */
  hasItem(id, quantity = 1) {
    const item = this.inventory.find(i => i.id === id);
    return item && item.quantity >= quantity;
  }

  /**
   * Get item from inventory
   */
  getItem(id) {
    return this.inventory.find(i => i.id === id);
  }

  /**
   * Load from saved data
   */
  static fromJSON(data) {
    const player = new Player();
    player.name = data.name || "Adventurer";
    player.maxHp = data.maxHp ?? 30;
    player.hp = data.hp ?? 30;
    player.gold = data.gold ?? 20;
    player.inventoryCapacity = data.inventoryCapacity ?? 20;
    
    // Load inventory
    player.inventory = (data.inventory || []).map(item => Item.fromJSON(item));
    
    // Load skills
    if (data.stats) {
      Object.keys(data.stats).forEach(skillName => {
        player.skills[skillName] = Skill.fromJSON(skillName, data.stats[skillName]);
      });
    }
    
    return player;
  }

  /**
   * Convert to JSON for saving
   */
  toJSON() {
    return {
      name: this.name,
      maxHp: this.maxHp,
      hp: this.hp,
      gold: this.gold,
      inventoryCapacity: this.inventoryCapacity,
      inventory: this.inventory.map(item => item.toJSON()),
      stats: Object.fromEntries(
        Object.entries(this.skills).map(([name, skill]) => [name, skill.toJSON()])
      )
    };
  }
}

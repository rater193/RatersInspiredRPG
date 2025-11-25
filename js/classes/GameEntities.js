/**
 * Location class - Represents a location in the game world
 */
export class Location {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.type = config.type; // city, mine, combat, bank, etc.
    this.description = config.description || '';
    this.emoji = config.emoji || '';
    
    // Connections to other locations with travel times
    this.connections = config.connections || {}; // { locationId: travelTimeMs }
    
    // Parent location for back navigation
    this.parent = config.parent || null;
    
    // Custom render function (optional)
    this.customRender = config.customRender || null;
    
    // Actions available at this location
    this.actions = config.actions || []; // ['mine', 'smelt', 'craft', 'combat', 'bank']
    
    // Mining options (ore IDs available at this mine)
    this.miningOptions = config.miningOptions || [];
    
    // Combat encounters (array of { enemyId, weight })
    this.encounters = config.encounters || [];
  }

  /**
   * Get travel time to another location
   */
  getTravelTimeTo(destinationId) {
    return this.connections[destinationId] || null;
  }

  /**
   * Check if can travel to a location
   */
  canTravelTo(destinationId) {
    return this.connections.hasOwnProperty(destinationId);
  }

  /**
   * Get all connected locations
   */
  getConnections() {
    return Object.keys(this.connections);
  }

  /**
   * Add a connection to another location
   */
  addConnection(locationId, travelTime) {
    this.connections[locationId] = travelTime;
  }

  /**
   * Check if location has an action available
   */
  hasAction(action) {
    return this.actions.includes(action);
  }

  /**
   * Get a random encounter based on weights
   */
  getRandomEncounter() {
    if (this.encounters.length === 0) return null;
    
    // Calculate total weight
    const totalWeight = this.encounters.reduce((sum, enc) => sum + enc.weight, 0);
    
    // Pick random value
    let random = Math.random() * totalWeight;
    
    // Select encounter based on weight
    for (const encounter of this.encounters) {
      random -= encounter.weight;
      if (random <= 0) {
        return encounter.enemyId;
      }
    }
    
    // Fallback to first encounter
    return this.encounters[0].enemyId;
  }

  static fromJSON(data) {
    return new Location(data);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      description: this.description,
      emoji: this.emoji,
      connections: this.connections,
      parent: this.parent,
      actions: this.actions
    };
  }
}

/**
 * Recipe class - Base class for crafting recipes
 */
export class Recipe {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.baseTime = config.baseTime || 3000;
    this.levelReq = config.levelReq || 1;
    this.xp = config.xp || 0;
    this.ingredients = config.ingredients || [];
  }

  /**
   * Check if player meets level requirement
   */
  meetsLevelRequirement(playerLevel) {
    return playerLevel >= this.levelReq;
  }

  /**
   * Check if player has required ingredients
   */
  hasIngredients(checkFunction) {
    return this.ingredients.every(ing => checkFunction(ing.id, ing.qty));
  }

  /**
   * Get time required for recipe
   */
  getTimeRequired() {
    return this.baseTime;
  }
}

/**
 * OreRecipe - Mining recipe
 */
export class OreRecipe extends Recipe {
  constructor(config) {
    super(config);
  }
}

/**
 * IngotRecipe - Smelting recipe
 */
export class IngotRecipe extends Recipe {
  constructor(config) {
    super(config);
    this.successChance = config.successChance || 1.0;
  }

  /**
   * Check if smelting succeeds
   */
  attemptSmelt() {
    return Math.random() < this.successChance;
  }
}

/**
 * CraftingRecipe - Armory/smithing recipe
 */
export class CraftingRecipe extends Recipe {
  constructor(config) {
    super(config);
    this.tier = config.tier;
    this.type = config.type; // Weapon, Armor, Shield, Box
    this.ingotId = config.ingotId;
    this.ingots = config.ingots || 1;
    
    // If ingredients not provided, auto-generate from ingot requirements
    if (!this.ingredients || this.ingredients.length === 0) {
      this.ingredients = [{ id: this.ingotId, name: config.ingotName || this.ingotId, qty: this.ingots }];
      
      // Add leather for armor/shields
      if (['Armor', 'Shield'].includes(this.type)) {
        const leatherQty = this.tier === 'Copper' ? 1 : 
                          this.tier === 'Bronze' ? 2 : 
                          this.tier === 'Iron' ? 3 : 4;
        this.ingredients.push({ id: 'leather', name: 'Leather', qty: leatherQty });
      }
    }
  }
}

/**
 * Enemy class - Represents a combat enemy
 */
export class Enemy {
  constructor(name, maxHp, attack, defense, loot = []) {
    this.name = name;
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.attack = attack;
    this.defense = defense;
    this.loot = loot; // Array of {id, name, chance}
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
  }

  isAlive() {
    return this.hp > 0;
  }

  getHpPercent() {
    return this.hp / this.maxHp;
  }

  /**
   * Roll for loot drops
   */
  rollLoot() {
    const drops = [];
    this.loot.forEach(lootItem => {
      if (Math.random() < lootItem.chance) {
        drops.push({ id: lootItem.id, name: lootItem.name, quantity: 1 });
      }
    });
    return drops;
  }

  /**
   * Create a copy of this enemy (for encounters)
   */
  clone() {
    return new Enemy(this.name, this.maxHp, this.attack, this.defense, [...this.loot]);
  }
}

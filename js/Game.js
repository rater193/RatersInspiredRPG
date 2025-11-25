import { Player } from './classes/Player.js';
import { logger } from './utils/logger.js';
import { storage } from './utils/storage.js';
import { formatGameTime } from './utils/helpers.js';
import * as GameData from './data/gameData.js';
import { createLocations } from './data/locations.js';
import { MenuRenderer } from './ui/MenuRenderer.js';

/**
 * Main Game class - Orchestrates all game systems
 */
export class Game {
  constructor() {
    this.player = new Player();
    this.timeMinutes = 0;
    this.currentLocation = 'lumbridge';
    this.currentMenu = 'main';
    this.bank = { gold: 0, items: [] };
    this.locations = createLocations(); // Now using Location objects!
    
    // Game state for various systems
    this.mining = {
      ores: GameData.ORES,
      activeOreId: null,
      progress: 0,
      isMining: false,
      lastTick: null
    };
    
    this.smelting = {
      ingots: GameData.INGOTS,
      activeIngotId: null,
      progress: 0,
      isSmelting: false,
      lastTick: null
    };
    
    this.armory = {
      recipes: GameData.CRAFTING_RECIPES,
      activeRecipeId: null,
      progress: 0,
      isCrafting: false,
      lastTick: null,
      search: ''
    };
    
    this.travel = {
      isTraveling: false,
      destination: null,
      progress: 0,
      travelTime: 0,
      baseTravelTime: 0,
      lastTick: null
    };
    
    this.combat = {
      inCombat: false,
      enemy: null,
      playerTurn: true,
      stance: 'accurate' // accurate, aggressive, defensive, controlled
    };
    
    // Auto-save timer
    this.lastAutoSave = Date.now();
    this.autoSaveInterval = 30000; // 30 seconds
    
    // Game loop
    this.lastFrameTime = performance.now();
    this.isRunning = false;
    
    // UI Renderer
    this.menuRenderer = null;
  }

  /**
   * Initialize the game
   */
  init() {
    // Set up logger
    logger.setElement(document.getElementById('log'));
    
    // Set up menu renderer
    this.menuRenderer = new MenuRenderer(this);
    
    // Try to load saved game
    this.loadGame();
    
    // Set up UI event listeners
    this.setupEventListeners();
    
    // Initial render
    this.renderAll();
    
    // Start game loop
    this.start();
    
    logger.log('Welcome to Lumbridge! Explore the world of Gielinor.');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Save button
    document.getElementById('manual-save-btn').onclick = () => {
      this.saveGame();
      const statusEl = document.getElementById('save-status');
      statusEl.textContent = '✓ Saved';
      setTimeout(() => statusEl.textContent = '', 2000);
    };
    
    // Reset button
    document.getElementById('reset-btn').onclick = () => {
      if (confirm('Are you sure you want to reset the game? This cannot be undone.')) {
        this.resetGame();
      }
    };
  }

  /**
   * Start the game loop
   */
  start() {
    this.isRunning = true;
    this.gameLoop();
  }

  /**
   * Main game loop
   */
  gameLoop = () => {
    if (!this.isRunning) return;
    
    const now = performance.now();
    const deltaMs = now - this.lastFrameTime;
    this.lastFrameTime = now;
    
    // Update game systems
    this.update(deltaMs);
    
    // Auto-save check
    if (Date.now() - this.lastAutoSave > this.autoSaveInterval) {
      this.saveGame();
      this.lastAutoSave = Date.now();
    }
    
    // Continue loop
    requestAnimationFrame(this.gameLoop);
  }

  /**
   * Update all game systems
   */
  update(deltaMs) {
    let needsRender = false;
    
    // Update travel
    if (this.travel.isTraveling) {
      this.updateTravel(deltaMs);
      needsRender = true;
    }
    
    // Update mining
    if (this.mining.isMining && this.currentLocation.includes('mine')) {
      this.updateMining(deltaMs);
      needsRender = true;
    }
    
    // Update smelting
    if (this.smelting.isSmelting && this.currentLocation.includes('furnace')) {
      this.updateSmelting(deltaMs);
      needsRender = true;
    }
    
    // Update crafting
    if (this.armory.isCrafting && (this.currentLocation.includes('guild') || this.currentMenu === 'craft')) {
      this.updateCrafting(deltaMs);
      needsRender = true;
    }
    
    // Update time (1 real second = 1 game minute)
    this.timeMinutes += deltaMs / 1000;
    if (Math.floor(this.timeMinutes) % 60 === 0) {
      this.renderGameTime();
    }
  }

  /**
   * Render all UI
   */
  renderAll() {
    this.renderVitals();
    this.renderStats();
    this.renderInventory();
    this.renderGameTime();
    this.renderLocationLabel();
    this.renderMenu();
  }

  /**
   * Render HP and gold
   */
  renderVitals() {
    const hpPercent = this.player.getHpPercent() * 100;
    document.getElementById('hp-bar').style.width = `${hpPercent}%`;
    document.getElementById('hp-text').textContent = `HP ${this.player.hp} / ${this.player.maxHp}`;
    document.getElementById('gold-text').textContent = `Gold: ${this.player.gold}`;
    document.getElementById('bank-gold-text').textContent = this.bank.gold;
  }

  /**
   * Render skills
   */
  renderStats() {
    const statsGrid = document.getElementById('stats-grid');
    const skills = Object.values(this.player.skills);
    
    statsGrid.innerHTML = skills.map(skill => {
      const progress = skill.getProgress() * 100;
      const xpNeeded = skill.getXpForNextLevel();
      return `
        <div class="stat-row">
          <div class="stat-top">
            <span class="stat-label">${skill.name}</span>
            <span class="stat-value">Lv. ${skill.level}</span>
          </div>
          <div class="xp-bar">
            <div class="xp-fill" style="width:${progress}%"></div>
          </div>
          <div class="tiny-muted">${skill.xp} / ${xpNeeded} XP</div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render inventory
   */
  renderInventory() {
    const count = this.player.getInventoryCount();
    const capacity = this.player.inventoryCapacity;
    document.getElementById('inventory-capacity').textContent = `${count} / ${capacity}`;
    
    const invList = document.getElementById('inventory-list');
    if (this.player.inventory.length === 0) {
      invList.innerHTML = '<div class="inventory-empty">Empty</div>';
    } else {
      invList.innerHTML = this.player.inventory.map(item => `
        <div class="inventory-item">
          <span class="inventory-item-name">${item.name}</span>
          <span class="inventory-item-qty">×${item.quantity}</span>
        </div>
      `).join('');
    }
  }

  /**
   * Render game time
   */
  renderGameTime() {
    document.getElementById('game-time').textContent = formatGameTime(Math.floor(this.timeMinutes));
  }

  /**
   * Render location label
   */
  renderLocationLabel() {
    const loc = this.locations[this.currentLocation];
    document.getElementById('location-label').textContent = `Location: ${loc ? loc.name : this.currentLocation}`;
  }

  /**
   * Render main menu
   */
  renderMenu() {
    if (this.menuRenderer) {
      this.menuRenderer.render();
    }
  }

  /**
   * Travel to a location
   */
  travelTo(locationId) {
    if (this.travel.isTraveling) return;
    
    const { travelTime, baseTravelTime } = this.getTravelTime(this.currentLocation, locationId);
    this.travel.isTraveling = true;
    this.travel.destination = locationId;
    this.travel.progress = 0;
    this.travel.travelTime = travelTime;
    this.travel.baseTravelTime = baseTravelTime; // Store base time for XP calculation
    this.travel.lastTick = performance.now();
    
    const destLoc = this.locations[locationId];
    logger.log(`You begin traveling to ${destLoc ? destLoc.name : locationId}...`);
    this.renderMenu();
  }

  /**
   * Get travel time between two locations - now using Location objects
   * Travel time is reduced by Agility level (up to 50% faster at level 99)
   */
  getTravelTime(from, to) {
    const fromLocation = this.locations[from];
    if (!fromLocation) return { travelTime: 5000, baseTravelTime: 5000 }; // Default fallback
    
    let baseTravelTime = fromLocation.getTravelTimeTo(to);
    if (baseTravelTime === null) {
      // Try reverse direction
      const toLocation = this.locations[to];
      if (toLocation) {
        baseTravelTime = toLocation.getTravelTimeTo(from);
      }
    }
    
    if (baseTravelTime === null) return { travelTime: 5000, baseTravelTime: 5000 }; // Default fallback
    
    // Apply Agility speed bonus: 0.5% reduction per level (50% at level 99)
    const agilityLevel = this.player.getSkill('Agility').level;
    const speedBonus = 1 - (agilityLevel * 0.005); // 1.0 at level 1, 0.505 at level 99
    const travelTime = Math.floor(baseTravelTime * speedBonus);
    
    return { travelTime, baseTravelTime };
    
    return 5000; // Default fallback
  }

  /**
   * Exit current location (go back) - uses Location.parent
   */
  exitLocation() {
    const currentLoc = this.locations[this.currentLocation];
    if (currentLoc && currentLoc.parent) {
      this.currentLocation = currentLoc.parent;
    } else {
      this.currentLocation = 'lumbridge';
    }
    
    this.renderLocationLabel();
    this.renderMenu();
  }

  /**
   * Start combat encounter
   */
  startCombat() {
    const location = this.locations[this.currentLocation];
    
    if (!location || !location.encounters || location.encounters.length === 0) {
      logger.log('No enemies found at this location!');
      return;
    }
    
    // Get random encounter based on location's encounter table
    const enemyType = location.getRandomEncounter();
    const enemyTemplate = GameData.ENEMIES[enemyType];
    
    if (!enemyTemplate) {
      logger.log('Enemy not found in database!');
      return;
    }
    
    // Initialize combat state
    this.combat.inCombat = true;
    this.combat.enemy = {
      ...enemyTemplate,
      hp: enemyTemplate.maxHp
    };
    this.combat.playerTurn = true;
    
    logger.log(`A ${this.combat.enemy.name} appears!`);
    this.renderMenu();
  }

  /**
   * Set combat stance
   */
  setCombatStance(stance) {
    this.combat.stance = stance;
    logger.log(`Combat stance set to ${stance}.`);
    this.renderMenu();
  }

  /**
   * Player attacks enemy
   */
  playerAttack() {
    if (!this.combat.inCombat || !this.combat.playerTurn) return;
    
    const enemy = this.combat.enemy;
    const damage = Math.max(1, Math.floor(Math.random() * 8) + 1 - enemy.defense);
    enemy.hp -= damage;
    
    logger.log(`You deal ${damage} damage to ${enemy.name}!`);
    
    // Award XP based on combat stance (RuneScape style)
    const xpPerDamage = 4;
    const stance = this.combat.stance;
    
    switch (stance) {
      case 'accurate': // Attack only
        this.player.addSkillXp('Attack', damage * xpPerDamage);
        break;
      case 'aggressive': // Strength only
        this.player.addSkillXp('Strength', damage * xpPerDamage);
        break;
      case 'defensive': // Defense only
        this.player.addSkillXp('Defense', damage * xpPerDamage);
        break;
      case 'controlled': // Shared (Attack, Strength, Defense)
        const sharedXp = Math.floor(damage * xpPerDamage / 3);
        this.player.addSkillXp('Attack', sharedXp);
        this.player.addSkillXp('Strength', sharedXp);
        this.player.addSkillXp('Defense', sharedXp);
        break;
    }
    
    // Always award Hitpoints XP (1.33 XP per damage dealt)
    this.player.addSkillXp('Hitpoints', Math.floor(damage * 1.33));
    
    this.renderStats();
    
    if (enemy.hp <= 0) {
      this.endCombat(true);
    } else {
      this.combat.playerTurn = false;
      setTimeout(() => this.enemyAttack(), 1000);
    }
    
    this.renderMenu();
  }

  /**
   * Enemy attacks player
   */
  enemyAttack() {
    if (!this.combat.inCombat) return;
    
    const enemy = this.combat.enemy;
    const damage = Math.max(1, Math.floor(Math.random() * enemy.attack) + 1);
    this.player.takeDamage(damage);
    
    logger.log(`${enemy.name} deals ${damage} damage to you!`);
    
    // Award Defense XP when taking damage (like RuneScape)
    this.player.addSkillXp('Defense', damage * 4);
    
    this.renderVitals();
    this.renderStats();
    
    if (!this.player.isAlive()) {
      this.endCombat(false);
    } else {
      this.combat.playerTurn = true;
    }
    
    this.renderMenu();
  }

  /**
   * End combat encounter
   */
  endCombat(victory) {
    if (victory) {
      logger.log(`You defeated the ${this.combat.enemy.name}!`);
      
      // Award loot
      const loot = this.combat.enemy.loot || [];
      loot.forEach(lootItem => {
        if (Math.random() < lootItem.chance) {
          this.player.addItem(lootItem.id, lootItem.name, 1);
          logger.log(`You received 1x ${lootItem.name}!`);
        }
      });
      
      this.renderInventory();
    } else {
      logger.log('You have been defeated! Respawning at Lumbridge...');
      this.player.hp = this.player.maxHp;
      this.currentLocation = 'lumbridge';
      this.renderLocationLabel();
      this.renderVitals();
    }
    
    this.combat.inCombat = false;
    this.combat.enemy = null;
    this.combat.playerTurn = true;
    this.renderMenu();
  }

  /**
   * Flee from combat
   */
  fleeCombat() {
    if (!this.combat.inCombat) return;
    
    logger.log('You fled from combat!');
    this.combat.inCombat = false;
    this.combat.enemy = null;
    this.combat.playerTurn = true;
    this.exitLocation();
  }

  /**
   * Deposit item into bank
   */
  depositItem(itemId, quantity) {
    const playerItem = this.player.inventory.find(i => i.id === itemId);
    if (!playerItem) {
      logger.log('Item not found in inventory!');
      return;
    }
    
    const amountToDeposit = Math.min(quantity, playerItem.quantity);
    
    // Remove from player inventory
    this.player.removeItem(itemId, amountToDeposit);
    
    // Add to bank
    const bankItem = this.bank.items.find(i => i.id === itemId);
    if (bankItem) {
      bankItem.quantity += amountToDeposit;
    } else {
      this.bank.items.push({ id: itemId, name: playerItem.name, quantity: amountToDeposit });
    }
    
    logger.log(`Deposited ${amountToDeposit}x ${playerItem.name} to bank.`);
    this.renderInventory();
    this.renderMenu();
    this.saveGame(); // Save immediately after bank transaction
  }

  /**
   * Withdraw item from bank
   */
  withdrawItem(itemId, quantity) {
    const bankItem = this.bank.items.find(i => i.id === itemId);
    if (!bankItem) {
      logger.log('Item not found in bank!');
      return;
    }
    
    if (!this.player.hasInventorySpace()) {
      logger.log('Inventory is full!');
      return;
    }
    
    const amountToWithdraw = Math.min(quantity, bankItem.quantity);
    
    // Add to player inventory
    this.player.addItem(bankItem.id, bankItem.name, amountToWithdraw);
    
    // Remove from bank
    bankItem.quantity -= amountToWithdraw;
    if (bankItem.quantity <= 0) {
      this.bank.items = this.bank.items.filter(i => i.id !== itemId);
    }
    
    logger.log(`Withdrew ${amountToWithdraw}x ${bankItem.name} from bank.`);
    this.renderInventory();
    this.renderMenu();
    this.saveGame(); // Save immediately after bank transaction
  }

  /**
   * Deposit gold into bank
   */
  depositGold(amount) {
    // Convert to number if string
    const numAmount = Number(amount);
    
    if (this.player.gold <= 0) {
      logger.log('You have no gold to deposit!');
      return;
    }
    
    const amountToDeposit = Math.min(numAmount, this.player.gold);
    
    this.player.gold -= amountToDeposit;
    this.bank.gold += amountToDeposit;
    
    logger.log(`Deposited ${amountToDeposit} gold to bank.`);
    this.renderVitals();
    this.renderMenu();
    this.saveGame(); // Save immediately after bank transaction
  }

  /**
   * Withdraw gold from bank
   */
  withdrawGold(amount) {
    // Convert to number if string
    const numAmount = Number(amount);
    
    if (this.bank.gold <= 0) {
      logger.log('No gold in bank to withdraw!');
      return;
    }
    
    const amountToWithdraw = Math.min(numAmount, this.bank.gold);
    
    this.player.gold += amountToWithdraw;
    this.bank.gold -= amountToWithdraw;
    
    logger.log(`Withdrew ${amountToWithdraw} gold from bank.`);
    this.renderVitals();
    this.renderMenu();
    this.saveGame(); // Save immediately after bank transaction
  }

  /**
   * Start mining an ore
   */
  startMining(oreId) {
    const ore = GameData.ORES.find(o => o.id === oreId);
    if (!ore) {
      logger.log(`Ore ${oreId} not found!`);
      return;
    }
    
    const miningSkill = this.player.getSkill('Mining');
    if (miningSkill.level < ore.levelReq) {
      logger.log(`You need Mining level ${ore.levelReq} to mine ${ore.name}.`);
      return;
    }
    
    // Start mining
    this.mining.isMining = true;
    this.mining.oreId = oreId;
    this.mining.progress = 0;
    this.mining.totalTime = ore.baseTime;
    
    logger.log(`Started mining ${ore.name}...`);
    this.renderMenu();
  }

  /**
   * Update mining progress
   */
  updateMining(deltaMs) {
    if (!this.mining.isMining) return;
    
    this.mining.progress += deltaMs / this.mining.totalTime;
    
    if (this.mining.progress >= 1.0) {
      // Mining complete!
      const ore = GameData.ORES.find(o => o.id === this.mining.oreId);
      if (ore) {
        this.player.addItem(ore.id, ore.name, 1);
        this.player.addSkillXp('Mining', ore.xp);
        logger.log(`Mined 1x ${ore.name}! (+${ore.xp} Mining XP)`);
      }
      
      // Stop mining after one ore (user must click again)
      this.mining.isMining = false;
      this.mining.oreId = null;
      this.mining.progress = 0;
      
      this.renderInventory();
      this.renderStats();
      this.renderMenu();
    } else {
      // Update menu to show progress
      this.renderMenu();
    }
  }

  /**
   * Update smelting progress
   */
  updateSmelting(deltaMs) {
    // Placeholder - will be implemented in SmeltingManager
  }

  /**
   * Update crafting progress
   */
  updateCrafting(deltaMs) {
    // Placeholder - will be implemented in CraftingManager
  }

  /**
   * Update travel progress
   */
  updateTravel(deltaMs) {
    const travel = this.travel;
    if (!travel.lastTick) travel.lastTick = performance.now();
    
    travel.progress += deltaMs / travel.travelTime;
    
    if (travel.progress >= 1) {
      // Travel complete - award Agility XP based on BASE travel time (distance)
      const baseTravelTimeSeconds = (travel.baseTravelTime || travel.travelTime) / 1000;
      const agilityXp = Math.floor(baseTravelTimeSeconds * 2); // 2 XP per second of base travel distance
      if (agilityXp > 0) {
        this.player.addSkillXp('Agility', agilityXp);
        logger.log(`You gained ${agilityXp} Agility XP from traveling.`);
      }
      
      this.currentLocation = travel.destination;
      travel.isTraveling = false;
      travel.destination = null;
      travel.progress = 0;
      travel.baseTravelTime = 0;
      travel.travelTime = 0;
      travel.lastTick = null;
      
      const loc = this.locations[this.currentLocation];
      logger.log(`You arrive at ${loc ? loc.name : this.currentLocation}.`);
      this.renderStats(); // Update UI to show new Agility XP
      this.renderLocationLabel();
      this.renderMenu();
    } else {
      // Update travel UI every frame
      this.renderMenu();
    }
  }

  /**
   * Save game
   */
  saveGame() {
    const saveData = {
      version: 1,
      timeMinutes: this.timeMinutes,
      currentLocation: this.currentLocation,
      currentMenu: this.currentMenu,
      player: this.player.toJSON(),
      bank: this.bank,
      mining: { activeOreId: this.mining.activeOreId },
      smelting: { activeIngotId: this.smelting.activeIngotId },
      armory: { activeRecipeId: this.armory.activeRecipeId, search: this.armory.search },
      combat: { inCombat: this.combat.inCombat }
    };
    
    console.log('Saving game with player gold:', this.player.gold);
    console.log('Full save data:', saveData);
    storage.save(saveData);
    logger.log('Game saved.');
  }

  /**
   * Load game
   */
  loadGame() {
    const saveData = storage.load();
    if (!saveData) {
      console.log('No save data found');
      return;
    }
    
    try {
      console.log('Loading game, save data:', saveData);
      console.log('Player data from save:', saveData.player);
      this.timeMinutes = saveData.timeMinutes || 0;
      this.currentLocation = saveData.currentLocation || 'lumbridge';
      this.currentMenu = saveData.currentMenu || 'main';
      this.player = Player.fromJSON(saveData.player);
      console.log('Loaded player gold:', this.player.gold);
      this.bank = saveData.bank || { gold: 0, items: [] };
      
      if (saveData.mining) {
        this.mining.activeOreId = saveData.mining.activeOreId;
      }
      if (saveData.smelting) {
        this.smelting.activeIngotId = saveData.smelting.activeIngotId;
      }
      if (saveData.armory) {
        this.armory.activeRecipeId = saveData.armory.activeRecipeId;
        this.armory.search = saveData.armory.search || '';
      }
      
      logger.log('Game loaded.');
    } catch (error) {
      console.error('Failed to load game:', error);
      logger.log('Failed to load saved game. Starting fresh.');
    }
  }

  /**
   * Reset game
   */
  resetGame() {
    storage.deleteSave();
    location.reload();
  }
}

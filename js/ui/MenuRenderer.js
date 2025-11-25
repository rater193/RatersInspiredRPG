import { escapeHtml } from '../utils/helpers.js';
import * as GameData from '../data/gameData.js';

/**
 * MenuRenderer - Handles all menu rendering based on location
 * Now uses Location objects directly for data-driven rendering
 */
export class MenuRenderer {
  constructor(game) {
    this.game = game;
    this.menuContainer = document.getElementById('menu-container');
  }

  /**
   * Render menu based on current location - uses Location objects directly
   */
  render() {
    // Check traveling state FIRST
    if (this.game.travel.isTraveling) {
      this.renderTravel();
      return;
    }
    
    // Check if in combat (overrides location rendering)
    if (this.game.combat.inCombat) {
      const location = this.game.locations[this.game.currentLocation];
      this.renderCombat(location || { emoji: '⚔️', name: 'Combat', description: 'You are in combat!' });
      return;
    }
    
    const location = this.game.locations[this.game.currentLocation];
    
    if (!location) {
      this.renderDefault();
      return;
    }
    
    // Check for custom render function
    if (location.customRender) {
      location.customRender(this);
      return;
    }
    
    // Render based on location type and actions
    if (location.hasAction('mine')) {
      this.renderMine(location);
    } else if (location.hasAction('bank')) {
      this.renderBank(location);
    } else if (location.hasAction('smelt')) {
      this.renderFurnace(location);
    } else if (location.hasAction('craft')) {
      this.renderCraftingGuild(location);
    } else if (location.hasAction('combat')) {
      this.renderCombat(location);
    } else {
      // Default location render (travel hub)
      this.renderLocationHub(location);
    }
  }

  /**
   * Generic location hub renderer - works for any travel hub location
   */
  renderLocationHub(location) {
    const connections = location.getConnections();
    
    // Build travel buttons
    let connectionsHTML = '';
    if (connections.length > 0) {
      const buttonsList = connections.map(destId => {
        const dest = this.game.locations[destId];
        if (!dest) return '';
        return `<button class="btn" onclick="game.travelTo('${destId}')">${dest.emoji} ${dest.name}</button>`;
      }).filter(btn => btn).join('\n          ');
      
      connectionsHTML = `
        <div class="menu-section-title" style="margin-top:12px">Travel</div>
        <div class="inline-controls">
          ${buttonsList}
        </div>`;
    }
    
    // Add special action buttons (like combat at swamp)
    let actionsHTML = '';
    if (location.id === 'lumbridge_swamp') {
      actionsHTML = `
        <div class="menu-section-title" style="margin-top:12px">Actions</div>
        <div class="inline-controls">
          <button class="btn btn-primary" onclick="game.startCombat()">⚔️ Fight Swamp Creatures</button>
        </div>`;
    }
    
    // Add back button if location has parent
    let backButton = '';
    if (location.parent) {
      const parent = this.game.locations[location.parent];
      if (parent) {
        backButton = `
        <div class="menu-section-title" style="margin-top:12px">Navigate</div>
        <div class="inline-controls">
          <button class="btn" onclick="game.travelTo('${location.parent}')">&larr; ${parent.name}</button>
        </div>`;
      }
    }
    
    this.menuContainer.innerHTML = `
      <div class="menu-section">
        <div class="menu-section-title">${location.emoji} ${location.name}</div>
        <div class="menu-description">${escapeHtml(location.description)}</div>
        ${connectionsHTML}
        ${actionsHTML}
        ${backButton}
      </div>
    `;
  }

  /**
   * Render Mine - uses location data with configurable mining options
   */
  renderMine(location) {
    // Get available ores from location
    const miningOptions = location.miningOptions || [];
    
    // Build mining buttons
    let miningHTML = '';
    if (miningOptions.length > 0) {
      const ores = GameData.ORES.filter(ore => miningOptions.includes(ore.id));
      
      const oreButtons = ores.map(ore => {
        const isMining = this.game.mining.isMining && this.game.mining.oreId === ore.id;
        const btnClass = isMining ? 'btn btn-primary' : 'btn';
        const btnText = isMining ? `⛏️ Mining ${ore.name}...` : `⛏️ Mine ${ore.name}`;
        const levelReq = ore.levelReq > 1 ? ` (Lvl ${ore.levelReq})` : '';
        
        return `<button class="${btnClass}" onclick="game.startMining('${ore.id}')">${btnText}${levelReq}</button>`;
      }).join('\n          ');
      
      miningHTML = `
        <div class="menu-section-title" style="margin-top:12px">Available Ores</div>
        <div class="inline-controls">
          ${oreButtons}
        </div>`;
    } else {
      miningHTML = '<div class="tiny-muted">No ores available at this location.</div>';
    }
    
    // Show mining progress if currently mining
    let progressHTML = '';
    if (this.game.mining.isMining) {
      const progressPct = (this.game.mining.progress * 100).toFixed(1);
      progressHTML = `
        <div class="menu-section-title" style="margin-top:12px">Mining Progress</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${progressPct}%"></div>
        </div>
        <div class="tiny-muted">${progressPct}% complete</div>`;
    }
    
    // Back button
    let backButton = '';
    if (location.parent) {
      const parent = this.game.locations[location.parent];
      if (parent) {
        backButton = `
        <div class="menu-section-title" style="margin-top:12px">Navigate</div>
        <div class="inline-controls">
          <button class="btn" onclick="game.travelTo('${location.parent}')">&larr; Leave Mine</button>
        </div>`;
      }
    }
    
    this.menuContainer.innerHTML = `
      <div class="menu-section">
        <div class="menu-section-title">${location.emoji} ${location.name}</div>
        <div class="menu-description">${escapeHtml(location.description)}</div>
        ${miningHTML}
        ${progressHTML}
        ${backButton}
      </div>
    `;
  }

  /**
   * Render Furnace - uses location data
   */
  renderFurnace(location) {
    let backButton = '';
    if (location.parent) {
      const parent = this.game.locations[location.parent];
      if (parent) {
        backButton = `<button class="btn" onclick="game.travelTo('${location.parent}')">&larr; Leave Furnace</button>`;
      }
    }
    
    this.menuContainer.innerHTML = `
      <div class="menu-section">
        <div class="menu-section-title">${location.emoji} ${location.name}</div>
        <div class="menu-description">${escapeHtml(location.description)}</div>
        <div class="tiny-muted">Smelting will be implemented in SmeltingManager...</div>
        ${backButton}
      </div>
    `;
  }

  /**
   * Render Crafting Guild - uses location data
   */
  renderCraftingGuild(location) {
    let backButton = '';
    if (location.parent) {
      const parent = this.game.locations[location.parent];
      if (parent) {
        backButton = `<button class="btn" onclick="game.travelTo('${location.parent}')">&larr; Leave Crafting Guild</button>`;
      }
    }
    
    this.menuContainer.innerHTML = `
      <div class="menu-section">
        <div class="menu-section-title">${location.emoji} ${location.name}</div>
        <div class="menu-description">${escapeHtml(location.description)}</div>
        <div class="tiny-muted">Crafting will be implemented in CraftingManager...</div>
        ${backButton}
      </div>
    `;
  }

  /**
   * Render Bank - uses location data
   */
  renderBank(location) {
    const player = this.game.player;
    const bank = this.game.bank;
    
    // Build inventory items list (for depositing)
    let inventoryHTML = '';
    if (player.inventory.length === 0) {
      inventoryHTML = '<div class="tiny-muted">Your inventory is empty</div>';
    } else {
      const inventoryItems = player.inventory.map(item => {
        return `
          <div class="bank-item-card">
            <div class="bank-item-name">${item.name}</div>
            <div class="bank-item-quantity">x${item.quantity}</div>
            <div class="bank-item-actions">
              <button class="btn btn-small" onclick="game.depositItem('${item.id}', 1)">Deposit 1</button>
              <button class="btn btn-small" onclick="game.depositItem('${item.id}', ${item.quantity})">All</button>
            </div>
          </div>`;
      }).join('');
      inventoryHTML = `<div class="bank-grid">${inventoryItems}</div>`;
    }
    
    // Build bank items list (for withdrawing)
    let bankHTML = '';
    if (bank.items.length === 0) {
      bankHTML = '<div class="tiny-muted">Your bank is empty</div>';
    } else {
      const bankItems = bank.items.map(item => {
        return `
          <div class="bank-item-card">
            <div class="bank-item-name">${item.name}</div>
            <div class="bank-item-quantity">x${item.quantity}</div>
            <div class="bank-item-actions">
              <button class="btn btn-small" onclick="game.withdrawItem('${item.id}', 1)">Withdraw 1</button>
              <button class="btn btn-small" onclick="game.withdrawItem('${item.id}', ${item.quantity})">All</button>
            </div>
          </div>`;
      }).join('');
      bankHTML = `<div class="bank-grid">${bankItems}</div>`;
    }
    
    // Gold management
    const goldHTML = `
      <div class="menu-section-title" style="margin-top:12px">Gold Management</div>
      <div class="currency-display">
        <div>💰 Inventory: ${player.gold} gold</div>
        <div>🏦 Banked: ${bank.gold} gold</div>
      </div>
      <div class="inline-controls">
        <button class="btn" onclick="game.depositGold(100)">Deposit 100g</button>
        <button class="btn" onclick="game.depositGold(${player.gold})">Deposit All</button>
        <button class="btn" onclick="game.withdrawGold(100)">Withdraw 100g</button>
        <button class="btn" onclick="game.withdrawGold(${bank.gold})">Withdraw All</button>
      </div>`;
    
    // Back button
    let backButton = '';
    if (location.parent) {
      const parent = this.game.locations[location.parent];
      if (parent) {
        backButton = `
        <div class="menu-section-title" style="margin-top:12px">Navigate</div>
        <div class="inline-controls">
          <button class="btn" onclick="game.travelTo('${location.parent}')">&larr; Leave Bank</button>
        </div>`;
      }
    }
    
    this.menuContainer.innerHTML = `
      <div class="menu-section">
        <div class="menu-section-title">${location.emoji} ${location.name}</div>
        <div class="menu-description">${escapeHtml(location.description)}</div>
        
        <div class="menu-section-title" style="margin-top:12px">Your Inventory</div>
        ${inventoryHTML}
        
        <div class="menu-section-title" style="margin-top:12px">Bank Storage</div>
        ${bankHTML}
        
        ${goldHTML}
        ${backButton}
      </div>
    `;
  }

  /**
   * Render Combat - uses location data
   */
  renderCombat(location) {
    const combat = this.game.combat;
    
    if (!combat.inCombat) {
      // Not in combat - show location with combat option
      this.menuContainer.innerHTML = `
        <div class="menu-section">
          <div class="menu-section-title">${location.emoji} ${location.name}</div>
          <div class="menu-description">${escapeHtml(location.description)}</div>
          <div class="inline-controls">
            <button class="btn btn-primary" onclick="game.startCombat()">⚔️ Start Combat</button>
            <button class="btn" onclick="game.exitLocation()">&larr; Leave</button>
          </div>
        </div>
      `;
    } else {
      // In combat - show combat interface
      const enemy = combat.enemy;
      const player = this.game.player;
      const enemyHpPercent = (enemy.hp / enemy.maxHp * 100).toFixed(1);
      
      this.menuContainer.innerHTML = `
        <div class="menu-section">
          <div class="menu-section-title">⚔️ Combat</div>
          
          <div class="combat-panel">
            <div class="combat-row">
              <div class="combat-entity">
                <div class="entity-name">You</div>
                <div class="entity-stat">HP: ${player.hp} / ${player.maxHp}</div>
              </div>
              <div class="combat-entity">
                <div class="entity-name">${enemy.name}</div>
                <div class="entity-stat">HP: ${enemy.hp} / ${enemy.maxHp}</div>
                <div class="progress-bar" style="margin-top:4px">
                  <div class="progress-fill" style="width:${enemyHpPercent}%"></div>
                </div>
              </div>
            </div>
            
            <div class="menu-section-title" style="margin-top:12px">Combat Stance</div>
            <div class="inline-controls">
              <button class="btn ${combat.stance === 'accurate' ? 'btn-primary' : ''}" onclick="game.setCombatStance('accurate')">
                🎯 Accurate (Attack)
              </button>
              <button class="btn ${combat.stance === 'aggressive' ? 'btn-primary' : ''}" onclick="game.setCombatStance('aggressive')">
                💪 Aggressive (Strength)
              </button>
              <button class="btn ${combat.stance === 'defensive' ? 'btn-primary' : ''}" onclick="game.setCombatStance('defensive')">
                🛡️ Defensive (Defense)
              </button>
              <button class="btn ${combat.stance === 'controlled' ? 'btn-primary' : ''}" onclick="game.setCombatStance('controlled')">
                ⚖️ Controlled (Shared)
              </button>
            </div>
            
            <div class="menu-section-title" style="margin-top:12px">Actions</div>
            <div class="inline-controls">
              <button class="btn btn-primary" onclick="game.playerAttack()" ${!combat.playerTurn ? 'disabled' : ''}>
                ⚔️ Attack
              </button>
              <button class="btn" onclick="game.fleeCombat()">🏃 Flee</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  /**
   * Render Travel menu
   */
  renderTravel() {
    const travel = this.game.travel;
    const destLoc = this.game.locations[travel.destination];
    const progressPct = (travel.progress * 100).toFixed(1);
    
    this.menuContainer.innerHTML = `
      <div class="menu-section">
        <div class="menu-section-title">Traveling...</div>
        <div class="menu-description">You are traveling to ${destLoc ? destLoc.name : travel.destination}.</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${progressPct}%"></div>
        </div>
        <div class="tiny-muted">${progressPct}% complete</div>
      </div>
    `;
  }

  /**
   * Render default/unknown location
   */
  renderDefault() {
    const loc = this.game.locations[this.game.currentLocation];
    this.menuContainer.innerHTML = `
      <div class="menu-section">
        <div class="menu-section-title">${loc ? loc.name : 'Unknown Location'}</div>
        <div class="menu-description">This location is under development.</div>
        <div class="tiny-muted">Current location ID: ${this.game.currentLocation}</div>
      </div>
    `;
  }
}

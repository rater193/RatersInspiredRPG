/**
 * Game data configuration - All recipes, enemies, locations
 */

export const ORES = [
  { id: "copper_ore", name: "Copper Ore", baseTime: 4000, levelReq: 1, xp: 5 },
  { id: "tin_ore", name: "Tin Ore", baseTime: 4500, levelReq: 1, xp: 6 },
  { id: "iron_ore", name: "Iron Ore", baseTime: 6500, levelReq: 15, xp: 15 },
  { id: "coal", name: "Coal", baseTime: 7000, levelReq: 30, xp: 25 }
];

export const INGOTS = [
  { 
    id: "copper_ingot", name: "Copper Ingot", baseTime: 3500, levelReq: 1, xp: 8,
    ingredients: [{ id: "copper_ore", name: "Copper Ore", qty: 1 }]
  },
  { 
    id: "bronze_ingot", name: "Bronze Ingot", baseTime: 4500, levelReq: 1, xp: 12,
    ingredients: [{ id: "copper_ore", name: "Copper Ore", qty: 1 }, { id: "tin_ore", name: "Tin Ore", qty: 1 }]
  },
  { 
    id: "iron_ingot", name: "Iron Ingot", baseTime: 5500, levelReq: 15, xp: 20,
    ingredients: [{ id: "iron_ore", name: "Iron Ore", qty: 1 }],
    successChance: 0.5
  },
  { 
    id: "steel_ingot", name: "Steel Ingot", baseTime: 7000, levelReq: 30, xp: 35,
    ingredients: [{ id: "iron_ore", name: "Iron Ore", qty: 1 }, { id: "coal", name: "Coal", qty: 2 }]
  }
];

export const CRAFTING_RECIPES = [
  // Copper tier
  { id: "copper_dagger", name: "Copper Dagger", tier: "Copper", ingotId: "copper_ingot", ingots: 1, levelReq: 1, xp: 5, type: "Weapon", baseTime: 3000 },
  { id: "copper_sword", name: "Copper Sword", tier: "Copper", ingotId: "copper_ingot", ingots: 2, levelReq: 3, xp: 10, type: "Weapon", baseTime: 4000 },
  { id: "copper_helm", name: "Copper Helm", tier: "Copper", ingotId: "copper_ingot", ingots: 2, levelReq: 4, xp: 12, type: "Armor", baseTime: 4500 },
  { id: "copper_chainbody", name: "Copper Chainbody", tier: "Copper", ingotId: "copper_ingot", ingots: 3, levelReq: 6, xp: 18, type: "Armor", baseTime: 5500 },
  { id: "copper_platelegs", name: "Copper Platelegs", tier: "Copper", ingotId: "copper_ingot", ingots: 2, levelReq: 5, xp: 14, type: "Armor", baseTime: 5000 },
  { id: "copper_kiteshield", name: "Copper Kiteshield", tier: "Copper", ingotId: "copper_ingot", ingots: 3, levelReq: 7, xp: 20, type: "Shield", baseTime: 6000 },
  { id: "copper_boots", name: "Copper Boots", tier: "Copper", ingotId: "copper_ingot", ingots: 1, levelReq: 2, xp: 6, type: "Armor", baseTime: 3500 },
  // Bronze tier
  { id: "bronze_dagger", name: "Bronze Dagger", tier: "Bronze", ingotId: "bronze_ingot", ingots: 1, levelReq: 5, xp: 12, type: "Weapon", baseTime: 4000 },
  { id: "bronze_sword", name: "Bronze Sword", tier: "Bronze", ingotId: "bronze_ingot", ingots: 2, levelReq: 8, xp: 18, type: "Weapon", baseTime: 5000 },
  { id: "bronze_helm", name: "Bronze Helm", tier: "Bronze", ingotId: "bronze_ingot", ingots: 2, levelReq: 9, xp: 20, type: "Armor", baseTime: 5500 },
  { id: "bronze_chainbody", name: "Bronze Chainbody", tier: "Bronze", ingotId: "bronze_ingot", ingots: 3, levelReq: 11, xp: 26, type: "Armor", baseTime: 6500 },
  { id: "bronze_platelegs", name: "Bronze Platelegs", tier: "Bronze", ingotId: "bronze_ingot", ingots: 2, levelReq: 10, xp: 22, type: "Armor", baseTime: 6000 },
  { id: "bronze_kiteshield", name: "Bronze Kiteshield", tier: "Bronze", ingotId: "bronze_ingot", ingots: 3, levelReq: 12, xp: 28, type: "Shield", baseTime: 7000 },
  { id: "bronze_boots", name: "Bronze Boots", tier: "Bronze", ingotId: "bronze_ingot", ingots: 1, levelReq: 6, xp: 14, type: "Armor", baseTime: 4500 },
  // Iron tier
  { id: "iron_dagger", name: "Iron Dagger", tier: "Iron", ingotId: "iron_ingot", ingots: 1, levelReq: 15, xp: 30, type: "Weapon", baseTime: 5500 },
  { id: "iron_sword", name: "Iron Sword", tier: "Iron", ingotId: "iron_ingot", ingots: 2, levelReq: 18, xp: 40, type: "Weapon", baseTime: 6500 },
  { id: "iron_helm", name: "Iron Helm", tier: "Iron", ingotId: "iron_ingot", ingots: 2, levelReq: 19, xp: 42, type: "Armor", baseTime: 7000 },
  { id: "iron_chainbody", name: "Iron Chainbody", tier: "Iron", ingotId: "iron_ingot", ingots: 3, levelReq: 21, xp: 50, type: "Armor", baseTime: 8000 },
  { id: "iron_platelegs", name: "Iron Platelegs", tier: "Iron", ingotId: "iron_ingot", ingots: 2, levelReq: 20, xp: 46, type: "Armor", baseTime: 7500 },
  { id: "iron_kiteshield", name: "Iron Kiteshield", tier: "Iron", ingotId: "iron_ingot", ingots: 3, levelReq: 23, xp: 55, type: "Shield", baseTime: 8500 },
  { id: "iron_boots", name: "Iron Boots", tier: "Iron", ingotId: "iron_ingot", ingots: 1, levelReq: 16, xp: 32, type: "Armor", baseTime: 6000 },
  // Steel tier
  { id: "steel_dagger", name: "Steel Dagger", tier: "Steel", ingotId: "steel_ingot", ingots: 1, levelReq: 30, xp: 60, type: "Weapon", baseTime: 7000 },
  { id: "steel_sword", name: "Steel Sword", tier: "Steel", ingotId: "steel_ingot", ingots: 2, levelReq: 33, xp: 72, type: "Weapon", baseTime: 8000 },
  { id: "steel_helm", name: "Steel Helm", tier: "Steel", ingotId: "steel_ingot", ingots: 2, levelReq: 34, xp: 75, type: "Armor", baseTime: 8500 },
  { id: "steel_chainbody", name: "Steel Chainbody", tier: "Steel", ingotId: "steel_ingot", ingots: 3, levelReq: 36, xp: 84, type: "Armor", baseTime: 9500 },
  { id: "steel_platelegs", name: "Steel Platelegs", tier: "Steel", ingotId: "steel_ingot", ingots: 2, levelReq: 35, xp: 80, type: "Armor", baseTime: 9000 },
  { id: "steel_kiteshield", name: "Steel Kiteshield", tier: "Steel", ingotId: "steel_ingot", ingots: 3, levelReq: 38, xp: 90, type: "Shield", baseTime: 10000 },
  { id: "steel_boots", name: "Steel Boots", tier: "Steel", ingotId: "steel_ingot", ingots: 1, levelReq: 31, xp: 64, type: "Armor", baseTime: 7500 },
  // Boxes
  { 
    id: "box_copper", name: "Copper Box", tier: "Copper", levelReq: 1, xp: 3, type: "Box", baseTime: 2500,
    ingredients: [{ id: "copper_ingot", name: "Copper Ingot", qty: 1 }, { id: "leather", name: "Leather", qty: 1 }]
  },
  { 
    id: "box_tin", name: "Tin Box", tier: "Tin", levelReq: 2, xp: 3, type: "Box", baseTime: 2500,
    ingredients: [{ id: "tin_ore", name: "Tin Ore", qty: 2 }, { id: "leather", name: "Leather", qty: 1 }]
  },
  { 
    id: "box_bronze", name: "Bronze Box", tier: "Bronze", levelReq: 5, xp: 6, type: "Box", baseTime: 3000,
    ingredients: [{ id: "bronze_ingot", name: "Bronze Ingot", qty: 1 }, { id: "leather", name: "Leather", qty: 1 }]
  },
  { 
    id: "box_iron", name: "Iron Box", tier: "Iron", levelReq: 15, xp: 12, type: "Box", baseTime: 4000,
    ingredients: [{ id: "iron_ingot", name: "Iron Ingot", qty: 1 }, { id: "leather", name: "Leather", qty: 2 }]
  },
  { 
    id: "box_steel", name: "Steel Box", tier: "Steel", levelReq: 30, xp: 20, type: "Box", baseTime: 5000,
    ingredients: [{ id: "steel_ingot", name: "Steel Ingot", qty: 1 }, { id: "leather", name: "Leather", qty: 3 }]
  }
];

// LOCATIONS and TRAVEL_ROUTES removed - now in locations.js with proper Location class structure

export const ENEMIES = {
  'goblin': {
    name: "Goblin",
    maxHp: 20,
    attack: 3,
    defense: 2,
    loot: [
      { id: "copper_ore", name: "Copper Ore", chance: 0.3 }
    ]
  },
  'swamp_creature': {
    name: "Swamp Creature",
    maxHp: 25,
    attack: 4,
    defense: 3,
    loot: [
      { id: "tin_ore", name: "Tin Ore", chance: 0.25 }
    ]
  },
  'mad_cow': {
    name: "Mad Cow",
    maxHp: 30,
    attack: 5,
    defense: 2,
    loot: [
      { id: "leather", name: "Leather", chance: 0.5 }
    ]
  },
  'small_rat': {
    name: "Small Rat",
    maxHp: 5,
    attack: 1,
    defense: 0,
    loot: [ ]
  }
};

export const BOX_CAPTURE_CHANCES = {
  'box_copper': 0.2,
  'box_tin': 0.25,
  'box_bronze': 0.3,
  'box_iron': 0.4,
  'box_steel': 0.5
};

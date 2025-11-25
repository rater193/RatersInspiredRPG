import { Location } from '../classes/GameEntities.js';

/**
 * Location definitions - Each location is a fully configured object
 */

export const LOCATION_DEFINITIONS = {
  // === LUMBRIDGE AREA ===
  lumbridge: {
    id: 'lumbridge',
    name: 'Lumbridge',
    type: 'city',
    emoji: '🏘️',
    description: 'A peaceful castle town by a winding river. Many adventurers start their journey here under the watchful eye of Duke Horacio.',
    connections: {
      'lumbridge_castle': 1500,
      'lumbridge_swamp': 4000,
      'al_kharid': 3000,
      'draynor_village': 8000,
      'varrock': 15000
    },
    actions: []
  },

  lumbridge_castle: {
    id: 'lumbridge_castle',
    name: 'Lumbridge Castle',
    type: 'castle',
    emoji: '🏰',
    description: 'The grand stone castle of Duke Horacio. Banners hang from the walls, and guards stand watch at every corner.',
    parent: 'lumbridge',
    connections: {
      'lumbridge': 1500,
      'lumbridge_castle_bank': 1000
    },
    actions: []
  },

  lumbridge_castle_bank: {
    id: 'lumbridge_castle_bank',
    name: 'Lumbridge Castle Bank',
    type: 'bank',
    emoji: '🏦',
    description: 'A quiet clerk watches over rows of lockboxes. Store items and coins.',
    parent: 'lumbridge_castle',
    connections: {
      'lumbridge_castle': 1000
    },
    actions: ['bank']
  },

  lumbridge_swamp: {
    id: 'lumbridge_swamp',
    name: 'Lumbridge Swamp',
    type: 'hub',
    emoji: '🐸',
    description: 'Murky waters and twisted trees. Frogs croak, and more dangerous creatures lurk in the shadows.',
    parent: 'lumbridge',
    connections: {
      'lumbridge': 4000,
      'lumbridge_swamp_mine': 3000,
      'draynor_manor': 5000,
      'draynor_village': 6000
    },
    actions: [],
    encounters: [
      { enemyId: 'swamp_creature', weight: 10 },
      { enemyId: 'small_rat', weight: 50 }
    ]
  },

  lumbridge_swamp_mine: {
    id: 'lumbridge_swamp_mine',
    name: 'Lumbridge Swamp Mine',
    type: 'mine',
    emoji: '⛏️',
    description: 'Rock walls echo with the sound of pickaxes. Ore veins glitter in the torchlight.',
    parent: 'lumbridge_swamp',
    connections: {
      'lumbridge_swamp': 3000
    },
    actions: ['mine'],
    miningOptions: ['copper_ore', 'tin_ore'] // Beginner ores
  },

  // === VARROCK AREA ===
  varrock: {
    id: 'varrock',
    name: 'Varrock',
    type: 'city',
    emoji: '🏰',
    description: 'The bustling capital city with markets, guards, and adventure around every corner.',
    connections: {
      'grand_exchange': 3000,
      'varrock_west_bank': 2000,
      'varrock_east_mine': 4000,
      'varrock_palace': 2500,
      'edgeville': 8000,
      'lumbridge': 15000,
      'barbarian_village': 10000
    },
    actions: []
  },

  varrock_east_mine: {
    id: 'varrock_east_mine',
    name: 'Varrock East Mine',
    type: 'mine',
    emoji: '⛏️',
    description: 'Rock walls echo with the sound of pickaxes. Ore veins glitter in the torchlight.',
    parent: 'varrock',
    connections: {
      'varrock': 4000
    },
    actions: ['mine'],
    miningOptions: ['iron_ore', 'coal'] // Mid-level ores
  },

  varrock_west_bank: {
    id: 'varrock_west_bank',
    name: 'Varrock West Bank',
    type: 'bank',
    emoji: '🏦',
    description: 'A quiet clerk watches over rows of lockboxes. Store items and coins.',
    parent: 'varrock',
    connections: {
      'varrock': 2000
    },
    actions: ['bank']
  },

  varrock_palace: {
    id: 'varrock_palace',
    name: 'Varrock Palace',
    type: 'palace',
    emoji: '👑',
    description: 'The grand palace where King Roald rules over Varrock.',
    parent: 'varrock',
    connections: {
      'varrock': 2500
    },
    actions: []
  },

  grand_exchange: {
    id: 'grand_exchange',
    name: 'Grand Exchange',
    type: 'shop',
    emoji: '💰',
    description: 'The bustling marketplace where merchants trade goods from across Gielinor.',
    parent: 'varrock',
    connections: {
      'varrock': 3000
    },
    actions: ['shop']
  },

  // === FALADOR AREA ===
  falador: {
    id: 'falador',
    name: 'Falador',
    type: 'city',
    emoji: '🛡️',
    description: 'The majestic white walls of Falador rise before you. Knights patrol the streets, and the gleaming castle towers above the bustling city square.',
    connections: {
      'falador_bank': 1500,
      'falador_mine': 3000,
      'crafting_guild': 8000,
      'barbarian_village': 12000,
      'port_sarim': 12000,
      'rimmington': 10000,
      'edgeville': 15000
    },
    actions: []
  },

  falador_mine: {
    id: 'falador_mine',
    name: 'Falador Mine',
    type: 'mine',
    emoji: '⛏️',
    description: 'Rock walls echo with the sound of pickaxes. Ore veins glitter in the torchlight.',
    parent: 'falador',
    connections: {
      'falador': 3000
    },
    actions: ['mine'],
    miningOptions: ['copper_ore', 'tin_ore', 'iron_ore', 'coal'] // All ores
  },

  falador_bank: {
    id: 'falador_bank',
    name: 'Falador East Bank',
    type: 'bank',
    emoji: '🏦',
    description: 'A quiet clerk watches over rows of lockboxes. Store items and coins.',
    parent: 'falador',
    connections: {
      'falador': 1500
    },
    actions: ['bank']
  },

  crafting_guild: {
    id: 'crafting_guild',
    name: 'Crafting Guild',
    type: 'guild',
    emoji: '🔨',
    description: 'Anvils line the walls, each scarred from use. Hammer bars into gear or craft boxes to capture creatures.',
    parent: 'falador',
    connections: {
      'falador': 8000
    },
    actions: ['craft']
  },

  // === EDGEVILLE & WILDERNESS ===
  edgeville: {
    id: 'edgeville',
    name: 'Edgeville',
    type: 'city',
    emoji: '🏘️',
    description: 'A small town on the edge of civilization. The Wilderness looms to the north.',
    connections: {
      'edgeville_furnace': 1500,
      'wilderness': 2000,
      'varrock': 8000,
      'barbarian_village': 5000,
      'falador': 15000
    },
    actions: []
  },

  edgeville_furnace: {
    id: 'edgeville_furnace',
    name: 'Edgeville Furnace',
    type: 'furnace',
    emoji: '🔥',
    description: 'Intense heat radiates from the furnace. This is where ores become ingots.',
    parent: 'edgeville',
    connections: {
      'edgeville': 1500
    },
    actions: ['smelt']
  },

  wilderness: {
    id: 'wilderness',
    name: 'Wilderness',
    type: 'combat',
    emoji: '⚔️',
    description: 'A dangerous wasteland where outlaws and monsters roam freely.',
    parent: 'edgeville',
    connections: {
      'edgeville': 2000
    },
    actions: ['combat'],
    encounters: [
      { enemyId: 'goblin', weight: 5 },
      { enemyId: 'swamp_creature', weight: 3 },
      { enemyId: 'mad_cow', weight: 2 }
    ]
  },

  barbarian_village: {
    id: 'barbarian_village',
    name: 'Barbarian Village',
    type: 'village',
    emoji: '🪓',
    description: 'A rough settlement of fierce warriors. Longhouses dot the landscape.',
    connections: {
      'edgeville': 5000,
      'varrock': 10000,
      'falador': 12000
    },
    actions: [],
    encounters: [
      { enemyId: 'mad_cow', weight: 10 }
    ]
  },

  // === AL KHARID ===
  al_kharid: {
    id: 'al_kharid',
    name: 'Al Kharid',
    type: 'city',
    emoji: '🏜️',
    description: 'Golden dunes surround this desert palace. The heat is intense, and guards watch the palace gates carefully.',
    connections: {
      'al_kharid_mine': 3000,
      'lumbridge': 3000
    },
    actions: []
  },

  al_kharid_mine: {
    id: 'al_kharid_mine',
    name: 'Al Kharid Mine',
    type: 'mine',
    emoji: '⛏️',
    description: 'Rock walls echo with the sound of pickaxes. Ore veins glitter in the torchlight.',
    parent: 'al_kharid',
    connections: {
      'al_kharid': 3000
    },
    actions: ['mine'],
    miningOptions: ['copper_ore', 'tin_ore', 'iron_ore'] // Desert mine ores
  },

  // === DRAYNOR AREA ===
  draynor_village: {
    id: 'draynor_village',
    name: 'Draynor Village',
    type: 'village',
    emoji: '🏘️',
    description: 'A quiet village with a dark reputation. Strange things happen here at night.',
    connections: {
      'draynor_manor': 5000,
      'wizards_tower': 6000,
      'port_sarim': 7000,
      'lumbridge_swamp': 6000,
      'lumbridge': 8000
    },
    actions: []
  },

  draynor_manor: {
    id: 'draynor_manor',
    name: 'Draynor Manor',
    type: 'combat',
    emoji: '🏚️',
    description: 'An eerie mansion that seems to watch you. Dark magic lingers in the air.',
    parent: 'draynor_village',
    connections: {
      'draynor_village': 5000,
      'lumbridge_swamp': 5000
    },
    actions: ['combat'],
    encounters: [
      { enemyId: 'goblin', weight: 10 }
    ]
  },

  wizards_tower: {
    id: 'wizards_tower',
    name: "Wizards' Tower",
    type: 'tower',
    emoji: '🔮',
    description: 'A tall tower where wizards study arcane magic. Strange lights flicker in the windows.',
    parent: 'draynor_village',
    connections: {
      'draynor_village': 6000
    },
    actions: []
  },

  // === PORT SARIM & RIMMINGTON ===
  port_sarim: {
    id: 'port_sarim',
    name: 'Port Sarim',
    type: 'port',
    emoji: '⛵',
    description: 'A busy port town with ships coming and going. The smell of salt and fish fills the air.',
    connections: {
      'draynor_village': 7000,
      'falador': 12000,
      'rimmington': 8000
    },
    actions: []
  },

  rimmington: {
    id: 'rimmington',
    name: 'Rimmington',
    type: 'village',
    emoji: '🏘️',
    description: 'A small mining village near the coast. Quiet and peaceful.',
    connections: {
      'port_sarim': 8000,
      'falador': 10000
    },
    actions: []
  }
};

/**
 * Create Location instances from definitions
 */
export function createLocations() {
  const locations = {};
  
  for (const [id, config] of Object.entries(LOCATION_DEFINITIONS)) {
    locations[id] = new Location(config);
  }
  
  return locations;
}

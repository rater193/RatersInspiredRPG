# Idle RPG - Professional Refactored Structure

## Project Overview
A RuneScape-inspired idle RPG game with mining, smithing, combat, and exploration mechanics.

## Directory Structure

```
thegame/
├── index.html              # Main HTML entry point (modern HTML5)
├── game.html              # Original single-file version (backup)
├── game copy.html         # Backup
│
├── css/                   # Stylesheets (separated by concern)
│   ├── variables.css      # CSS custom properties
│   ├── base.css          # Base styles and layout
│   ├── layout.css        # Panel and menu layout
│   ├── components.css    # Buttons, progress bars, HP bar
│   ├── player.css        # Stats, inventory, log
│   ├── game-features.css # Bank, combat, boxes
│   └── crafting.css      # Mining/smithing/crafting cards
│
├── js/                    # JavaScript modules (ES6)
│   ├── main.js           # Entry point (TO BE CREATED)
│   ├── Game.js           # Main game class (TO BE CREATED)
│   │
│   ├── classes/          # Core game entities
│   │   ├── Item.js       # Item and Skill classes ✓
│   │   ├── Player.js     # Player class with inventory/skills ✓
│   │   └── GameEntities.js # Location, Recipe, Enemy classes ✓
│   │
│   ├── managers/         # Game system managers (TO BE CREATED)
│   │   ├── InventoryManager.js
│   │   ├── BankManager.js
│   │   ├── MiningManager.js
│   │   ├── SmeltingManager.js
│   │   ├── CraftingManager.js
│   │   ├── CombatManager.js
│   │   ├── TravelManager.js
│   │   └── SkillManager.js
│   │
│   ├── ui/               # UI rendering (TO BE CREATED)
│   │   ├── UIRenderer.js
│   │   ├── PlayerUI.js
│   │   └── MenuRenderer.js
│   │
│   ├── utils/            # Utility functions
│   │   ├── logger.js     # Action log system ✓
│   │   ├── storage.js    # Save/load localStorage ✓
│   │   └── helpers.js    # Helper functions ✓
│   │
│   └── data/             # Game configuration data
│       └── gameData.js   # All recipes, enemies, locations ✓
│
└── assets/               # Future: images, sounds, etc.
```

## Architecture Design

### Class-Based OOP Structure
- **Player**: Manages HP, gold, inventory, skills
- **Item**: Represents items with id, name, quantity
- **Skill**: Manages level, XP, progression
- **Location**: Defines game world locations
- **Recipe**: Base class for crafting recipes
- **Enemy**: Combat enemies with stats and loot

### Manager Classes (Separation of Concerns)
- **InventoryManager**: Add/remove items, check space
- **BankManager**: Deposit/withdraw items and gold
- **MiningManager**: Handle mining actions and progress
- **SmeltingManager**: Handle smelting with success chances
- **CraftingManager**: Handle smithing/crafting
- **CombatManager**: Turn-based combat system
- **TravelManager**: Travel between locations with timers
- **SkillManager**: XP and leveling logic

### UI Rendering (View Layer)
- **UIRenderer**: Master renderer coordinating all UI
- **PlayerUI**: Renders HP, stats, inventory, log
- **MenuRenderer**: Renders location-specific menus

### Utilities
- **Logger**: Centralized logging system
- **StorageManager**: localStorage save/load
- **Helpers**: formatTime, calculateDamage, etc.

## Current Status

### ✅ Completed
1. Directory structure created
2. CSS separated into 7 modular files
3. Core classes created:
   - Item, Skill (Item.js)
   - Player with full inventory/skill management (Player.js)
   - Location, Recipe, Enemy classes (GameEntities.js)
4. Utility modules created:
   - Logger with singleton (logger.js)
   - StorageManager with save/load (storage.js)
   - Helper functions (helpers.js)
5. Game data config (gameData.js) with all recipes, enemies, locations
6. Modern index.html with semantic HTML5

### 🚧 To Be Completed

#### High Priority
1. **Main Game Class** (`js/Game.js`)
   - Orchestrate all managers
   - Game loop with requestAnimationFrame
   - Auto-save every 30 seconds
   - Time progression

2. **Manager Classes** (`js/managers/`)
   - Each manager handles one game system
   - Progress tracking for mining/smelting/crafting
   - Travel system with routes
   - Combat turn-based system

3. **UI Renderers** (`js/ui/`)
   - PlayerUI: Render stats, inventory, log
   - MenuRenderer: Location-based menu routing
   - Event handler binding

4. **Entry Point** (`js/main.js`)
   - Initialize game
   - Set up event listeners
   - Start game loop

#### Medium Priority
5. **Save/Load Integration**
   - Connect storage to all managers
   - Validate loaded data
   - Migration for old saves

6. **Testing**
   - Verify all features work
   - Test save/load
   - Check all locations/travel

## Implementation Notes

### Converting from Monolithic to Modular
The original `game.html` is a single 1400+ line file. The refactor separates:

1. **Styles**: 7 CSS files by component type
2. **Data**: Recipe/enemy configs in gameData.js
3. **Logic**: Classes for entities, managers for systems
4. **View**: UI renderers separate from game logic
5. **State**: Centralized in Game class

### ES6 Module System
- All files use `export` for public APIs
- `import` statements load dependencies
- `type="module"` in index.html enables ES6

### Key Design Patterns
- **Singleton**: Logger, StorageManager
- **Factory**: Loading players/items from JSON
- **Observer**: Event-based UI updates (future)
- **Manager**: Separate concerns into focused classes

## How to Continue Development

### Next Steps
1. Create `js/main.js` - Initialize game, set up DOM references
2. Create `js/Game.js` - Main game class with update loop
3. Create managers in `js/managers/` - One feature at a time
4. Create UI renderers in `js/ui/` - Connect to DOM
5. Test thoroughly - Verify parity with original game.html

### Testing the Refactored Version
1. Open `index.html` in a browser
2. Check console for errors
3. Test each feature:
   - Mining at various locations
   - Smelting ingots
   - Crafting items
   - Combat encounters
   - Travel between locations
   - Save/load game
   - Bank deposits/withdrawals

### Maintaining Code Quality
- Keep classes focused (Single Responsibility)
- Use clear naming conventions
- Comment complex logic
- Keep functions small and testable
- Use TypeScript for type safety (future upgrade)

## Benefits of New Structure

1. **Maintainability**: Easy to find and fix bugs
2. **Scalability**: Add new features without touching other code
3. **Testability**: Each class can be unit tested
4. **Readability**: Clear separation of concerns
5. **Performance**: CSS files can be cached separately
6. **Collaboration**: Multiple developers can work simultaneously
7. **Modern Standards**: ES6 modules, class syntax, proper HTML5

## Future Enhancements
- TypeScript migration for type safety
- Webpack/Vite build system for bundling
- Unit tests with Jest
- E2E tests with Playwright
- CI/CD pipeline
- Progressive Web App (PWA) features
- Asset optimization and lazy loading

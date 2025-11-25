/**
 * Main entry point for the game
 */
import { Game } from './Game.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Create and initialize the game
  const game = new Game();
  game.init();
  
  // Expose game instance to window for debugging
  window.game = game;
  
  console.log('Game initialized successfully!');
  console.log('Access game instance via window.game');
});

/**
 * Archivo principal que inicializa el juego
 */
import GameController from './game-controller.js';
import SettingsController from './settings-controller.js';
import configManager from './config.js';

// Cuando el DOM esté listo
window.addEventListener('load', () => {
    // Crear e inicializar el controlador de ajustes
    const settingsController = new SettingsController();
    
    // Crear e inicializar el controlador del juego
    const gameController = new GameController({
        config: configManager.getConfig()
    });
    gameController.setupGame();
    
    // Escuchar cambios en la configuración
    document.addEventListener('configUpdated', (event) => {
        gameController.updateConfig(event.detail);
    });
}); 
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
    
    // Asignar la referencia del controlador de ajustes al controlador del juego
    gameController.settingsController = settingsController;
    
    // Inicializar el juego
    gameController.setupGame();
    
    // Escuchar cambios en la configuración
    document.addEventListener('configUpdated', (event) => {
        gameController.updateConfig(event.detail);
    });
}); 
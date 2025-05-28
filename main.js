/**
 * Archivo principal que inicializa el juego
 */
import GameController from './game-controller.js';
import SettingsController from './settings-controller.js';
import configManager from './config.js';
import { UserManager } from './user-manager.js';

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

class Game {
    constructor() {
        this.userManager = new UserManager();
        // ... existing code ...
    }

    endGame(result) {
        // ... existing code ...

        // Actualizar estadísticas si no es modo invitado
        if (this.username !== 'guest') {
            const gameResult = {
                prize: this.currentPrize,
                correctAnswers: this.correctAnswers,
                wrongAnswers: this.wrongAnswers,
                highestLevelReached: this.currentLevel,
                date: new Date().toISOString(),
                lifelines: this.lifelinesUsed,
                timePerQuestion: this.timePerQuestion,
                fastestAnswer: Math.min(...this.timePerQuestion),
                withTimer: this.timerEnabled
            };
            
            this.userManager.updateStats(gameResult);
        }

        // ... rest of existing code ...
    }
    // ... existing code ...
} 
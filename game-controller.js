/**
 * Controlador principal del juego que coordina todos los componentes
 */
import UserManager from './users.js';
import TimerManager from './timer-manager.js';
import LifelineManager from './lifeline-manager.js';
import UIController from './ui-controller.js';
import AudioManager from './audio-manager.js';
import SpeechManager from './speech-manager.js';
import questions from './questions.js';
import configManager from './config.js';

class GameController {
    /**
     * @param {Object} options - Opciones de configuración
     */
    constructor(options = {}) {
        // Cargar configuración
        this.config = options.config || configManager.getConfig();
        
        // Estado del juego
        this.currentLevel = 1;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.currentPrize = 0;
        this.questions = [...questions]; // Copiar las preguntas para poder barajarlas
        
        // Inicializar managers
        this.userManager = new UserManager();
        this.uiController = new UIController({
            onAnswerSelected: this.handleAnswer.bind(this),
            onLifelineSelected: this.useLifeline.bind(this),
            onUserModeSelected: this.handleUserMode.bind(this),
            onGuestModeSelected: this.handleGuestMode.bind(this),
            onStartGame: this.startGame.bind(this),
            onExitGame: this.handleExitGame.bind(this),
            onOpenSettings: this.handleOpenSettings.bind(this)
        });
        
        this.timerManager = new TimerManager({
            duration: this.config.timer.duration,
            onTimeUp: this.handleTimeUp.bind(this),
            onTick: (timeLeft) => {
                if (timeLeft <= 5) {
                    this.audioManager.playSound('tick');
                }
            }
        });
        
        this.audioManager = new AudioManager({
            effectsVolume: this.config.sounds.effectsVolume,
            musicVolume: this.config.sounds.musicVolume
        });
        
        this.speechManager = new SpeechManager({
            enabled: this.config.sounds.enableSpeech
        });
        
        this.lifelineManager = new LifelineManager({
            onLifelineUsed: this.handleLifelineUsed.bind(this)
        });
        
        // Referencia al settingsController (se asignará en main.js)
        this.settingsController = null;
    }

    /**
     * Actualiza la configuración del juego
     * @param {Object} newConfig - Nueva configuración
     */
    updateConfig(newConfig) {
        this.config = newConfig;
        
        // Actualizar temporizador
        if (this.timerManager) {
            this.timerManager.setDuration(this.config.timer.duration);
        }
        
        // Actualizar audio
        if (this.audioManager) {
            this.audioManager.setVolumes(
                this.config.sounds.effectsVolume,
                this.config.sounds.musicVolume
            );
        }
        
        // Actualizar síntesis de voz
        if (this.speechManager) {
            this.speechManager.setEnabled(this.config.sounds.enableSpeech);
        }
        
        // Actualizar árbol de premios en la UI
        this.updateMoneyTreeDisplay();
    }

    /**
     * Actualiza la visualización del árbol de premios
     */
    updateMoneyTreeDisplay() {
        if (this.uiController && this.uiController.elements.moneyLevels) {
            this.uiController.elements.moneyLevels.forEach(level => {
                const levelNumber = parseInt(level.dataset.level);
                if (levelNumber && this.config.prizes[levelNumber]) {
                    level.textContent = `${this.config.prizes[levelNumber].toLocaleString()} €`;
                }
            });
        }
    }

    /**
     * Inicializa el juego
     */
    init() {
        // Inicializar cada controlador
        this.uiController.init();
        this.audioManager.init();
        
        // Configurar el proveedor de preguntas para comodines
        this.lifelineManager.setQuestionProvider(() => {
            return this.getCurrentQuestion();
        });
        
        // Configurar síntesis de voz para comodines
        this.lifelineManager.setSpeechSynthesis(this.speechManager);
        
        // Configurar sonidos para comodines
        this.lifelineManager.sounds = this.audioManager.getSounds();
        
        // Actualizar árbol de premios con valores de configuración
        this.updateMoneyTreeDisplay();
    }

    /**
     * Configura el juego después de que el DOM esté cargado
     */
    setupGame() {
        // Inicializar el juego
        this.init();
        
        // Inicializar referencias a elementos DOM en los managers
        this.timerManager.init(document.querySelector('.timer'));
        
        this.lifelineManager.init({
            fifty: document.getElementById('fifty'),
            audience: document.getElementById('audience'),
            phone: document.getElementById('phone'),
            phoneMessageContainer: document.getElementById('phoneMessageContainer'),
            audienceChart: document.getElementById('audienceChart')
        });
    }

    /**
     * Maneja el modo usuario
     */
    handleUserMode() {
        // Esta función se llama cuando se selecciona el modo usuario
        // La UI ya mostrará el modal de nombre de usuario
    }

    /**
     * Maneja el modo invitado
     */
    handleGuestMode() {
        const guestId = this.userManager.createGuestUser();
        this.startGame();
    }

    /**
     * Inicia el juego
     * @param {string} username - Nombre de usuario (opcional, para modo usuario)
     */
    startGame(username) {
        // Si se proporciona nombre de usuario, crear usuario
        if (username) {
            this.userManager.createUser(username);
        }
        
        // Asegurarse de que cualquier modal esté cerrado
        if (this.settingsController) {
            this.settingsController.closeSettingsModal();
        }
        
        // Mostrar el contenedor del juego
        this.uiController.showGameContainer();
        
        // Reiniciar estado
        this.resetGame();
        
        // Cargar primera pregunta
        this.loadQuestion();
        
        // Ya no iniciamos la música de fondo para evitar la superposición
        // this.audioManager.startBackgroundMusic();
    }

    /**
     * Reinicia el juego a su estado inicial
     */
    resetGame() {
        this.currentLevel = 1;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.currentPrize = 0;
        
        // Barajar preguntas
        this.questions = this.shuffleArray([...questions]);
        
        // Actualizar árbol de premios
        this.uiController.updateMoneyTree(this.currentLevel);
        
        // Reiniciar comodines
        this.lifelineManager.resetLifelines();
        
        // Detener y limpiar temporizador
        if (this.timerManager) {
            this.timerManager.stop();
            this.timerManager.reset();
        }
    }

    /**
     * Carga la pregunta actual
     */
    loadQuestion() {
        const currentQuestion = this.getCurrentQuestion();
        
        // Actualizar UI con la pregunta
        this.uiController.updateQuestion(currentQuestion);
        
        // Ocultar elementos auxiliares (gráfica público, mensaje llamada)
        this.uiController.hideHelperElements();
        
        // Iniciar temporizador
        this.timerManager.start();
        
        // Reproducir música adecuada para el nivel
        this.audioManager.playLevelMusic(this.currentLevel);
    }

    /**
     * Devuelve la pregunta actual según el nivel
     * @returns {Object} Pregunta actual
     */
    getCurrentQuestion() {
        return this.questions[this.currentLevel - 1];
    }

    /**
     * Maneja la selección de una respuesta
     * @param {HTMLElement} selectedButton - Botón seleccionado
     */
    handleAnswer(selectedButton) {
        // Detener temporizador
        this.timerManager.stop();
        
        const selectedOption = selectedButton.dataset.option;
        const currentQuestion = this.getCurrentQuestion();
        
        // Deshabilitar todos los botones
        this.uiController.disableAllAnswers();
        
        // Resaltar la respuesta seleccionada
        this.uiController.highlightSelectedAnswer(selectedButton);
        this.audioManager.playSound('tick');
        
        // Comprobar respuesta después de un tiempo
        setTimeout(() => {
            // Marcar la respuesta correcta
            const correctButton = Array.from(this.uiController.elements.answerButtons)
                .find(button => button.dataset.option === currentQuestion.correct);
            
            // Aplicamos la clase correct inmediatamente, no después de 2 segundos
            if (correctButton) {
                correctButton.classList.add('correct');
            }
            
            if (selectedOption === currentQuestion.correct) {
                // Respuesta correcta
                this.correctAnswers++;
                this.audioManager.playCorrectAnswerSound(this.currentLevel);
                
                setTimeout(() => {
                    // Niveles asegurados (5, 10)
                    if (this.currentLevel === 5 || this.currentLevel === 10) {
                        setTimeout(() => {
                            this.audioManager.playGuaranteedPrizeSound(() => {
                                this.advanceToNextLevel();
                            });
                        }, 1000);
                    } else {
                        this.advanceToNextLevel();
                    }
                }, 2000);
            } else {
                // Respuesta incorrecta - marcar el botón como incorrecto
                selectedButton.classList.add('wrong');
                this.wrongAnswers++;
                this.audioManager.playWrongAnswerSound();
                
                setTimeout(() => {
                    this.endGame(false);
                }, 2000);
            }
        }, 3000);
    }

    /**
     * Avanza al siguiente nivel
     */
    advanceToNextLevel() {
        this.currentLevel++;
        this.updatePrize();
        
        if (this.currentLevel <= this.questions.length) {
            // Resetear botones de respuesta
            this.uiController.resetAnswerButtons();
            
            // Actualizar árbol de premios
            this.uiController.updateMoneyTree(this.currentLevel);
            
            // Cargar siguiente pregunta
            this.loadQuestion();
        } else {
            // Final del juego (victoria)
            this.endGame(true);
        }
    }

    /**
     * Maneja cuando se acaba el tiempo
     */
    handleTimeUp() {
        // Detener la música actual
        this.audioManager.stopSound('suspense');
        this.audioManager.stopSound('firstQuestions');
        this.audioManager.stopSound('midGame');
        
        // Final del juego (derrota por tiempo)
        this.endGame(false);
    }

    /**
     * Termina el juego
     * @param {boolean} isWin - Indica si el juego se ganó
     */
    endGame(isWin) {
        const gameResult = {
            correctAnswers: this.correctAnswers,
            wrongAnswers: this.wrongAnswers,
            prize: isWin ? this.currentPrize : this.calculateGuaranteedPrize()
        };
        
        // Actualizar estadísticas del usuario
        this.userManager.updateStats(gameResult);
        
        // Mostrar mensaje
        if (isWin) {
            this.uiController.showAlert('¡Felicidades! ¡Has ganado!');
        } else {
            this.uiController.showAlert('¡Juego terminado! Respuesta incorrecta.');
        }
        
        // Reiniciar el juego
        this.resetGame();
    }

    /**
     * Calcula el premio garantizado según el nivel alcanzado
     * @returns {number} Premio garantizado
     */
    calculateGuaranteedPrize() {
        // Usar los niveles de seguro de la configuración
        for (let i = this.config.safeLevels.length - 1; i >= 0; i--) {
            const safeLevel = this.config.safeLevels[i];
            if (this.currentLevel > safeLevel) {
                return this.config.prizes[safeLevel];
            }
        }
        return 0;
    }

    /**
     * Actualiza el premio actual
     */
    updatePrize() {
        this.currentPrize = this.config.prizes[this.currentLevel] || 0;
    }

    /**
     * Maneja el uso de un comodín
     * @param {string} lifelineName - Nombre del comodín
     */
    useLifeline(lifelineName) {
        switch (lifelineName) {
            case 'fifty':
                this.lifelineManager.useFiftyFifty([...this.uiController.elements.answerButtons]);
                break;
            case 'audience':
                this.lifelineManager.useAudienceHelp();
                break;
            case 'phone':
                this.lifelineManager.usePhoneFriend();
                break;
        }
    }

    /**
     * Maneja eventos después de usar un comodín
     * @param {string} lifelineName - Nombre del comodín usado
     */
    handleLifelineUsed(lifelineName) {
        // Este método puede usarse para efectos adicionales después de usar un comodín
        console.log(`Comodín ${lifelineName} usado`);
    }

    /**
     * Mezcla un array aleatoriamente
     * @param {Array} array - Array a mezclar
     * @returns {Array} Array mezclado
     */
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    /**
     * Maneja la acción de salir del juego
     */
    handleExitGame() {
        // Detener temporizador
        if (this.timerManager) {
            this.timerManager.stop();
        }
        
        // Detener todos los sonidos
        if (this.audioManager) {
            // Detener todos los sonidos
            const sounds = this.audioManager.getSounds();
            for (const key in sounds) {
                if (sounds[key]) {
                    this.audioManager.stopSound(key);
                }
            }
        }
        
        // Cancelar cualquier síntesis de voz en curso
        if (this.speechManager) {
            this.speechManager.cancel();
        }
        
        // Reiniciar el estado del juego
        this.resetGame();
        
        console.log('Juego finalizado y volviendo al menú principal');
    }

    /**
     * Maneja la apertura de ajustes desde el juego
     */
    handleOpenSettings() {
        // Pausar el juego (detener temporizador)
        if (this.timerManager && !this.timerManager.isStopped) {
            this.timerManager.stop();
            
            // Bajar volumen de la música temporalmente
            if (this.audioManager) {
                this.audioManager.lowerMusicVolume(0.8);
            }
        }
        
        // Mostrar modal de ajustes
        if (this.settingsController) {
            this.settingsController.openSettingsModal();
            
            // Agregar listener una vez para cuando se cierre el modal
            const onSettingsClosed = () => {
                // Restaurar volumen
                if (this.audioManager) {
                    this.audioManager.restoreMusicVolume();
                }
                
                // Aplicar nuevos ajustes si han cambiado
                this.updateConfig(configManager.getConfig());
                
                document.removeEventListener('settingsClosed', onSettingsClosed);
            };
            
            document.addEventListener('settingsClosed', onSettingsClosed);
        }
    }
}

export default GameController; 
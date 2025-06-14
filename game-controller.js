/**
 * Controlador principal del juego que coordina todos los componentes
 */
import UserManager from './users.js';
import TimerManager from './timer-manager.js';
import LifelineManager from './lifeline-manager.js';
import UIController from './ui-controller.js';
import AudioManager from './audio-manager.js';
import SpeechManager from './speech-manager.js';
import { questionsBase } from './questions.js';
import configManager from './config.js';

export default class GameController {
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
        this.questions = [...questionsBase]; // Copiar las preguntas para poder barajarlas
        
        // Inicializar managers
        this.userManager = new UserManager();
        this.uiController = new UIController({
            onAnswerSelected: this.handleAnswer.bind(this),
            onLifelineSelected: this.useLifeline.bind(this),
            onUserModeSelected: this.handleUserMode.bind(this),
            onGuestModeSelected: this.handleGuestMode.bind(this),
            onStartGame: this.startGame.bind(this),
            onExitGame: this.handleExitGame.bind(this),
            onOpenSettings: this.handleOpenSettings.bind(this),
            onStartTimer: this.handleStartTimer.bind(this)
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
        
        this.timePerQuestion = [];
        this.lifelinesUsed = {
            fifty: false,
            audience: false,
            phone: false
        };
        this.username = null;
        this.timerEnabled = true;
        this.setupGame();
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
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Escuchar eventos del juego
        document.addEventListener('questionAnswered', (event) => {
            const { correct, time } = event.detail;
            this.timePerQuestion.push(time);
            
            if (correct) {
                this.correctAnswers++;
                this.currentPrize = this.getPrizeForLevel(this.currentLevel);
                this.currentLevel++;
            } else {
                this.wrongAnswers++;
                this.endGame('wrong');
            }
        });

        document.addEventListener('lifelineUsed', (event) => {
            const { lifeline } = event.detail;
            this.lifelinesUsed[lifeline] = true;
        });

        document.addEventListener('gameQuit', () => {
            this.endGame('quit');
        });

        document.addEventListener('gameWon', () => {
            this.endGame('won');
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
        this.timePerQuestion = [];
        this.lifelinesUsed = {
            fifty: false,
            audience: false,
            phone: false
        };
        
        // Cargar y agrupar las preguntas por dificultad
        const allQuestions = [...questionsBase];
        
        // Crear un registro para las preguntas usadas recientemente (entre sesiones)
        if (!window.recentlyUsedQuestions) {
            window.recentlyUsedQuestions = [];
        }
        
        // Limitar el tamaño del historial de preguntas recientes (mantener solo las últimas 30)
        if (window.recentlyUsedQuestions.length > 30) {
            window.recentlyUsedQuestions = window.recentlyUsedQuestions.slice(-30);
        }
        
        // Filtrar preguntas para excluir las usadas recientemente
        const availableQuestions = allQuestions.filter(q => 
            !window.recentlyUsedQuestions.some(usedQ => 
                usedQ.question === q.question
            )
        );
        
        // Si quedan muy pocas preguntas disponibles, reiniciar el historial
        if (availableQuestions.length < 20) {
            window.recentlyUsedQuestions = [];
        }
        
        // Agrupar las preguntas disponibles por dificultad
        this.questionsByDifficulty = {
            1: availableQuestions.filter(q => q.difficulty === 1),
            2: availableQuestions.filter(q => q.difficulty === 2),
            3: availableQuestions.filter(q => q.difficulty === 3)
        };
        
        // Barajar cada grupo de preguntas usando el algoritmo Fisher-Yates con más entropía
        for (let difficulty in this.questionsByDifficulty) {
            this.questionsByDifficulty[difficulty] = this.shuffleArrayEnhanced([...this.questionsByDifficulty[difficulty]]);
        }
        
        // Preparar el array final de preguntas
        this.questions = [];
        
        // Función para obtener una pregunta aleatoria de una dificultad específica
        const getRandomQuestion = (difficulty) => {
            const questions = this.questionsByDifficulty[difficulty];
            if (questions.length === 0) return null;
            
            // Usar un índice verdaderamente aleatorio
            const randomIndex = Math.floor(Math.random() * questions.length);
            const selected = questions[randomIndex];
            
            // Registrar esta pregunta como usada recientemente
            if (selected && !window.recentlyUsedQuestions.some(q => q.question === selected.question)) {
                window.recentlyUsedQuestions.push(selected);
            }
            
            return selected;
        };
        
        // Función para remover una pregunta de su grupo de dificultad
        const removeQuestion = (question, difficulty) => {
            const index = this.questionsByDifficulty[difficulty].indexOf(question);
            if (index > -1) {
                this.questionsByDifficulty[difficulty].splice(index, 1);
            }
        };
        
        // Llenar con preguntas según el nivel
        for (let i = 1; i <= 15; i++) {
            let selectedQuestion = null;
            
            if (i <= 4) {
                // Para niveles 1-4, usar dificultad 1
                selectedQuestion = getRandomQuestion(1);
                if (selectedQuestion) {
                    removeQuestion(selectedQuestion, 1);
                } else {
                    // Si no hay más preguntas de dificultad 1, usar una aleatoria de dificultad 2
                    selectedQuestion = getRandomQuestion(2);
                    if (selectedQuestion) {
                        removeQuestion(selectedQuestion, 2);
                    } else {
                        // Si no hay de dificultad 2, intentar con dificultad 3
                        selectedQuestion = getRandomQuestion(3);
                        if (selectedQuestion) {
                            removeQuestion(selectedQuestion, 3);
                        }
                    }
                }
            } else if (i >= 5 && i <= 9) {
                // Para niveles 5-9, usar dificultad 2
                selectedQuestion = getRandomQuestion(2);
                if (selectedQuestion) {
                    removeQuestion(selectedQuestion, 2);
                } else {
                    // Si no hay más preguntas de dificultad 2, probar con 1 o 3
                    selectedQuestion = getRandomQuestion(1) || getRandomQuestion(3);
                    if (selectedQuestion) {
                        const difficulty = selectedQuestion.difficulty;
                        removeQuestion(selectedQuestion, difficulty);
                    }
                }
            } else if (i >= 10) {
                // Para niveles 10-15, usar dificultad 3
                selectedQuestion = getRandomQuestion(3);
                if (selectedQuestion) {
                    removeQuestion(selectedQuestion, 3);
                } else {
                    // Si no hay más preguntas de dificultad 3, probar con 2 o 1
                    selectedQuestion = getRandomQuestion(2) || getRandomQuestion(1);
                    if (selectedQuestion) {
                        const difficulty = selectedQuestion.difficulty;
                        removeQuestion(selectedQuestion, difficulty);
                    }
                }
            }
            
            // Si aún no hay pregunta seleccionada, usar cualquier pregunta disponible de questionsBase
            if (!selectedQuestion) {
                const availableQuestions = allQuestions.filter(q => !this.questions.includes(q));
                if (availableQuestions.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
                    selectedQuestion = availableQuestions[randomIndex];
                }
            }
            
            if (selectedQuestion) {
                this.questions.push(selectedQuestion);
            }
        }
        
        // Asegurarse de que no haya preguntas repetidas en la misma partida
        const uniqueQuestions = [...new Set(this.questions.map(q => q.question))];
        if (uniqueQuestions.length !== this.questions.length) {
            console.warn('Se detectaron preguntas repetidas, realizando segundo barajado');
            this.resetGame(); // Intentar de nuevo
            return;
        }
        
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
     * Carga una nueva pregunta
     */
    loadQuestion() {
        // Obtener pregunta actual
        const currentQuestion = this.questions[this.currentLevel - 1];
        
        if (!currentQuestion) {
            console.error('No hay más preguntas disponibles');
            return;
        }
        
        // Mostrar la pregunta y opciones - usar updateQuestion en lugar de displayQuestion
        this.uiController.updateQuestion(currentQuestion);
        
        // Resaltar el nivel actual en el árbol de premios
        this.uiController.updateMoneyTree(this.currentLevel);
        
        // Actualizar premio actual
        this.updatePrize();
        
        // Inicializar temporizador (no lo iniciamos automáticamente)
        this.timerManager.reset();
        
        // Reproducir la música correspondiente según el nivel
        this.playLevelAppropriateMusic();
        
        // Ocultar elementos auxiliares (gráfica público, mensaje llamada)
        this.uiController.hideHelperElements();
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
                
                // Avanzar automáticamente después de un tiempo
                setTimeout(() => {
                    // Niveles asegurados (5, 10)
                    if (this.currentLevel === 5 || this.currentLevel === 10) {
                        this.audioManager.playGuaranteedPrizeSound(() => {
                            this.advanceToNextLevel();
                        });
                    } else {
                        this.advanceToNextLevel();
                    }
                }, 3000); // Esperar 3 segundos antes de avanzar
                
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
     * Maneja la acción cuando el tiempo se acaba
     */
    handleTimeUp() {
        // Detener la música actual
        this.audioManager.stopSound('suspense');
        this.audioManager.stopSound('firstQuestions');
        this.audioManager.stopSound('midGame');
        
        // NO se muestra ninguna alerta ni se termina el juego cuando se acaba el tiempo
    }

    /**
     * Termina el juego
     * @param {boolean} isWin - Indica si el juego se ganó
     */
    endGame(isWin) {
        const gameResult = {
            correctAnswers: this.correctAnswers,
            wrongAnswers: this.wrongAnswers,
            prize: isWin ? this.currentPrize : this.calculateGuaranteedPrize(),
            highestLevelReached: this.currentLevel,
            date: new Date().toISOString(),
            lifelines: this.lifelinesUsed,
            timePerQuestion: this.timePerQuestion,
            maxPossiblePrize: this.getPrizeForLevel(15),
            withTimer: this.timerEnabled
        };
        
        // Actualizar estadísticas del usuario
        this.userManager.updateStats(this.username, gameResult);
        
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
                // Detener el temporizador mientras se usa el comodín de la llamada
                if (this.timerManager && !this.timerManager.isStopped) {
                    this.timerManager.stop();
                    
                    // Reiniciar el temporizador después de que termine la llamada (aproximadamente 12 segundos)
                    setTimeout(() => {
                        // Solo reiniciar si el juego aún está activo (no ha terminado)
                        if (this.uiController.isGameVisible()) {
                            this.timerManager.start();
                        }
                    }, 12000); // 3s para iniciar llamada + 9s para mensaje
                }
                
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
     * Mezcla un array aleatoriamente con mayor entropía
     * @param {Array} array - Array a mezclar
     * @returns {Array} Array mezclado
     */
    shuffleArrayEnhanced(array) {
        const newArray = [...array];
        // Implementación de Fisher-Yates con más aleatoriedad
        for (let i = newArray.length - 1; i > 0; i--) {
            // Usar una fuente de aleatoriedad diferente
            let j;
            if (window.crypto && window.crypto.getRandomValues) {
                const randArray = new Uint32Array(1);
                window.crypto.getRandomValues(randArray);
                j = Math.floor((randArray[0] / (0xffffffff + 1)) * (i + 1));
            } else {
                // Fallback a Math.random() con timestamp adicional
                const timestamp = new Date().getTime() % 1000 / 1000;
                j = Math.floor(((Math.random() + timestamp) / 2) * (i + 1));
            }
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    /**
     * Mezcla un array aleatoriamente
     * @param {Array} array - Array a mezclar
     * @returns {Array} Array mezclado
     */
    shuffleArray(array) {
        return this.shuffleArrayEnhanced(array); // Usar la versión mejorada
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

    /**
     * Maneja el inicio del temporizador
     */
    handleStartTimer() {
        // Solo iniciar si el temporizador está detenido
        if (this.timerManager && this.timerManager.isStopped) {
            this.timerManager.start();
        }
    }

    /**
     * Método para reproducir la música adecuada según el nivel
     */
    playLevelAppropriateMusic() {
        // Determinar qué música reproducir según el nivel
        if (this.currentLevel < 5) {
            // Para los primeros 4 niveles, reproducir la música de preguntas iniciales
            this.audioManager.playSound('firstQuestions');
        } else if (this.currentLevel >= 5 && this.currentLevel <= 10) {
            // Para niveles 5-10, reproducir música de nivel medio
            this.audioManager.playSound('midGame');
        } else {
            // Para niveles 11-15, reproducir música de nivel alto
            this.audioManager.playSound('suspense');
        }
    }

    getPrizeForLevel(level) {
        const prizes = {
            1: 100,
            2: 250,
            3: 500,
            4: 750,
            5: 1500,
            6: 2500,
            7: 5000,
            8: 10000,
            9: 15000,
            10: 20000,
            11: 30000,
            12: 50000,
            13: 100000,
            14: 300000,
            15: 1000000
        };
        return prizes[level] || 0;
    }

    setUsername(username) {
        this.username = username;
    }

    setTimerEnabled(enabled) {
        this.timerEnabled = enabled;
    }
} 
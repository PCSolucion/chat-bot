/**
 * Clase para gestionar la interfaz de usuario del juego
 */
class UIController {
    /**
     * @param {Object} options - Opciones de configuración
     */
    constructor(options = {}) {
        // Referencias a elementos DOM
        this.elements = {
            // Menús
            startMenu: null,
            usernameModal: null,
            gameContainer: null,
            
            // Secciones principales
            questionSection: null,
            moneyTree: null,
            
            // Elementos específicos
            questionElement: null,
            answerButtons: [],
            moneyLevels: [],
            lifelineButtons: {},
            timerElement: null,
            audienceChart: null,
            phoneMessageContainer: null,
            
            // Botones del menú
            userModeButton: null,
            guestModeButton: null,
            startGameButton: null,
            usernameInput: null,
            exitGameButton: null,
            gameSettingsButton: null,
            startTimerButton: null
        };
        
        // Callbacks
        this.callbacks = {
            onAnswerSelected: options.onAnswerSelected || (() => {}),
            onLifelineSelected: options.onLifelineSelected || (() => {}),
            onUserModeSelected: options.onUserModeSelected || (() => {}),
            onGuestModeSelected: options.onGuestModeSelected || (() => {}),
            onStartGame: options.onStartGame || (() => {}),
            onExitGame: options.onExitGame || (() => {}),
            onOpenSettings: options.onOpenSettings || (() => {}),
            onStartTimer: options.onStartTimer || (() => {})
        };
    }

    /**
     * Inicializa el controlador UI
     */
    init() {
        this.findElements();
        this.setupEventListeners();
        this.setupLightBeams();
    }

    /**
     * Busca y almacena referencias a elementos DOM
     */
    findElements() {
        // Menús
        this.elements.startMenu = document.getElementById('startMenu');
        this.elements.usernameModal = document.getElementById('usernameModal');
        this.elements.gameContainer = document.querySelector('.game-container');
        
        // Secciones principales
        this.elements.questionSection = document.querySelector('.question-section');
        this.elements.moneyTree = document.querySelector('.money-tree');
        
        // Elementos específicos
        this.elements.questionElement = document.getElementById('question');
        this.elements.answerButtons = document.querySelectorAll('.answer-btn');
        this.elements.moneyLevels = document.querySelectorAll('.money-level');
        this.elements.timerElement = document.querySelector('.timer');
        this.elements.audienceChart = document.getElementById('audienceChart');
        this.elements.phoneMessageContainer = document.getElementById('phoneMessageContainer');
        
        // Botones de comodín
        this.elements.lifelineButtons = {
            fifty: document.getElementById('fifty'),
            audience: document.getElementById('audience'),
            phone: document.getElementById('phone')
        };
        
        // Botones del menú
        this.elements.userModeButton = document.getElementById('userMode');
        this.elements.guestModeButton = document.getElementById('guestMode');
        this.elements.startGameButton = document.getElementById('startGame');
        this.elements.usernameInput = document.getElementById('usernameInput');
        this.elements.exitGameButton = document.getElementById('exitGameBtn');
        this.elements.gameSettingsButton = document.getElementById('gameSettingsBtn');
        this.elements.startTimerButton = document.getElementById('startTimerBtn');
    }

    /**
     * Configura los listeners de eventos
     */
    setupEventListeners() {
        // Listeners para botones de respuesta
        this.elements.answerButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.callbacks.onAnswerSelected(button);
            });
        });

        // Listeners para comodines
        Object.entries(this.elements.lifelineButtons).forEach(([name, button]) => {
            if (button) {
                button.addEventListener('click', () => {
                    this.callbacks.onLifelineSelected(name);
                });
            }
        });

        // Listeners para el menú principal
        if (this.elements.userModeButton) {
            this.elements.userModeButton.addEventListener('click', () => {
                this.showUsernameModal();
                this.callbacks.onUserModeSelected();
            });
        }

        if (this.elements.guestModeButton) {
            this.elements.guestModeButton.addEventListener('click', () => {
                this.hideStartMenu();
                // Iniciar juego directamente sin video de introducción
                this.callbacks.onGuestModeSelected();
            });
        }

        // Botón para volver al menú principal desde el modal de usuario
        const backToMenuBtn = document.getElementById('backToMenuBtn');
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => {
                this.hideUsernameModal();
                this.showStartMenu();
            });
        }

        if (this.elements.startGameButton) {
            this.elements.startGameButton.addEventListener('click', () => {
                const username = this.elements.usernameInput.value.trim();
                if (username) {
                    this.hideUsernameModal();
                    // Iniciar juego directamente sin video de introducción
                    this.callbacks.onStartGame(username);
                } else {
                    alert('Por favor, ingresa un nombre de usuario');
                }
            });
        }
        
        // Listener para el botón de salir (sin confirmación)
        if (this.elements.exitGameButton) {
            this.elements.exitGameButton.addEventListener('click', () => {
                this.hideGameContainer();
                this.showStartMenu();
                this.callbacks.onExitGame();
            });
        }
        
        // Listener para el botón de ajustes en el juego
        if (this.elements.gameSettingsButton) {
            this.elements.gameSettingsButton.addEventListener('click', () => {
                this.callbacks.onOpenSettings();
            });
        }
        
        // Listener para el botón de inicio de temporizador
        if (this.elements.startTimerButton) {
            this.elements.startTimerButton.addEventListener('click', () => {
                this.callbacks.onStartTimer();
            });
        }
    }

    /**
     * Configura los efectos de luz
     */
    setupLightBeams() {
        const beams = document.querySelectorAll('.light-beam');
        beams.forEach(beam => {
            const duration = 5 + Math.random() * 10;
            beam.style.animation = `moveLight ${duration}s infinite ease-in-out`;
            const height = 100 + Math.random() * 200;
            beam.style.height = `${height}%`;
        });
    }

    /**
     * Muestra el modal para ingresar nombre de usuario
     */
    showUsernameModal() {
        this.hideStartMenu();
        
        // Esperar a que termine la transición para mostrar el modal
        setTimeout(() => {
            if (this.elements.usernameModal) {
                this.elements.usernameModal.classList.add('visible');
            }
        }, 500);
    }

    /**
     * Oculta el menú principal con transición
     */
    hideStartMenu() {
        if (this.elements.startMenu) {
            this.elements.startMenu.classList.add('hidden');
            
            // Asegurarnos de que las propiedades se apliquen correctamente
            this.elements.startMenu.style.opacity = '0';
            this.elements.startMenu.style.visibility = 'hidden';
            
            // Limpiar cualquier estilo inline residual del juego
            if (this.elements.gameContainer) {
                this.elements.gameContainer.style.opacity = '1';
                this.elements.gameContainer.style.visibility = 'visible';
            }
        }
    }

    /**
     * Oculta el modal de nombre de usuario
     */
    hideUsernameModal() {
        if (this.elements.usernameModal) {
            this.elements.usernameModal.classList.remove('visible');
        }
    }

    /**
     * Muestra el contenedor principal del juego
     */
    showGameContainer() {
        if (this.elements.gameContainer) {
            // Asegurarnos de que el contenedor esté visible
            this.elements.gameContainer.style.display = 'flex';
            
            // Restablecer visibilidad de elementos internos
            if (this.elements.questionSection) {
                this.elements.questionSection.style.display = 'flex';
            }
            
            if (this.elements.moneyTree) {
                this.elements.moneyTree.style.display = 'flex';
            }
            
            // Si hay otros elementos ocultos, mostrarlos
            const gameContent = this.elements.gameContainer.querySelector('.game-content');
            if (gameContent) {
                gameContent.style.display = 'flex';
            }
        }
    }

    /**
     * Actualiza el texto de la pregunta y las opciones
     * @param {Object} question - Objeto de pregunta actual
     */
    updateQuestion(question) {
        if (!this.elements.questionElement) return;
        
        this.elements.questionElement.textContent = question.question;
        
        this.elements.answerButtons.forEach(button => {
            const option = button.dataset.option;
            const answerText = button.querySelector('.answer-text');
            if (answerText) {
                answerText.textContent = question.options[option];
            }
            button.classList.remove('correct', 'wrong');
            button.disabled = false;
            button.style.visibility = 'visible';
            button.style.backgroundColor = '';
            button.style.color = '';
        });
        
        // Efecto de pulso para la pregunta
        this.pulseQuestion();
    }

    /**
     * Aplica efecto de pulso a la pregunta
     */
    pulseQuestion() {
        if (!this.elements.questionElement) return;
        
        this.elements.questionElement.style.animation = 'none';
        setTimeout(() => {
            this.elements.questionElement.style.animation = 'pulse 1.5s ease-in-out';
        }, 10);
    }

    /**
     * Actualiza el árbol de dinero según el nivel actual
     * @param {number} currentLevel - Nivel actual del juego
     */
    updateMoneyTree(currentLevel) {
        this.elements.moneyLevels.forEach(level => {
            level.classList.remove('active', 'completed');
            const levelNumber = parseInt(level.dataset.level);
            
            if (levelNumber === currentLevel) {
                level.classList.add('active');
                level.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (levelNumber < currentLevel) {
                level.classList.add('completed');
            }
        });
    }

    /**
     * Marca un botón de respuesta como correcto
     * @param {HTMLElement} button - Botón a marcar
     */
    markAnswerCorrect(button) {
        if (!button) return;
        button.classList.add('correct');
    }

    /**
     * Marca un botón de respuesta como incorrecto
     * @param {HTMLElement} button - Botón a marcar
     */
    markAnswerWrong(button) {
        if (!button) return;
        button.classList.add('wrong');
    }

    /**
     * Destaca un botón temporalmente antes de mostrar el resultado
     * @param {HTMLElement} button - Botón a destacar
     */
    highlightSelectedAnswer(button) {
        if (!button) return;
        
        const innerDiv = button.querySelector('div');
        if (innerDiv) {
            innerDiv.style.background = '#ffd700';
            button.style.backgroundColor = '';
            button.style.color = '#000';
        }
        
        // Restaurar estado después de la animación
        setTimeout(() => {
            if (innerDiv) {
                innerDiv.style.background = '';
            }
        }, 3000); // 3 segundos
    }

    /**
     * Deshabilita todos los botones de respuesta
     */
    disableAllAnswers() {
        this.elements.answerButtons.forEach(button => {
            button.disabled = true;
        });
    }

    /**
     * Resetea los estilos de todos los botones de respuesta
     */
    resetAnswerButtons() {
        this.elements.answerButtons.forEach(button => {
            // Eliminar clases de estado
            button.classList.remove('correct', 'wrong');
            
            // Resetear todos los estilos inline
            button.style.backgroundColor = '';
            button.style.color = '';
            button.style.boxShadow = '';
            button.style.animation = '';
            button.style.transform = '';
            
            // Habilitar y hacer visible
            button.disabled = false;
            button.style.visibility = 'visible';
            
            // Resetear también el div interno
            const innerDiv = button.querySelector('div');
            if (innerDiv) {
                innerDiv.style.background = '';
                innerDiv.style.backgroundColor = '';
            }
            
            // Resetear el texto
            const textSpan = button.querySelector('.answer-text');
            if (textSpan) {
                textSpan.style.color = '';
            }
        });
    }

    /**
     * Oculta la gráfica del público y el mensaje de llamada
     */
    hideHelperElements() {
        if (this.elements.audienceChart) {
            this.elements.audienceChart.style.display = 'none';
        }
        
        if (this.elements.phoneMessageContainer) {
            this.elements.phoneMessageContainer.classList.remove('visible');
            this.elements.phoneMessageContainer.style.display = 'none';
        }
    }
    
    /**
     * Muestra un mensaje de alerta personalizado
     * @param {string} message - Mensaje a mostrar
     */
    showAlert(message) {
        alert(message);
    }

    /**
     * Oculta el contenedor principal del juego
     */
    hideGameContainer() {
        if (this.elements.gameContainer) {
            this.elements.gameContainer.style.display = 'none';
        }
    }
    
    /**
     * Muestra el menú principal
     */
    showStartMenu() {
        if (this.elements.startMenu) {
            this.elements.startMenu.classList.remove('hidden');
            this.elements.startMenu.style.opacity = '1';
            this.elements.startMenu.style.visibility = 'visible';
        }
    }

    /**
     * Revisa si el juego está visible actualmente
     * @returns {boolean} true si el juego está visible
     */
    isGameVisible() {
        return this.elements.gameContainer && 
               this.elements.gameContainer.style.display !== 'none';
    }

    
}

export default UIController; 
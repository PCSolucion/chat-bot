/**
 * Clase para gestionar el temporizador del juego
 */
class TimerManager {
    /**
     * @param {Object} options - Opciones de configuración
     * @param {number} options.duration - Duración en segundos
     * @param {Function} options.onTimeUp - Callback cuando se acaba el tiempo
     * @param {Function} options.onTick - Callback para cada tick del temporizador
     */
    constructor(options = {}) {
        this.duration = options.duration || 45;
        this.timeLeft = this.duration;
        this.timerInterval = null;
        this.timerElement = null;
        this.onTimeUp = options.onTimeUp || (() => {});
        this.onTick = options.onTick || (() => {});
        this.isStopped = true;
    }

    /**
     * Inicializa el temporizador con un elemento del DOM
     * @param {HTMLElement} timerElement - Elemento donde mostrar el temporizador
     */
    init(timerElement) {
        this.timerElement = timerElement;
        this.reset();
    }

    /**
     * Inicia o reinicia el temporizador
     * @param {number} duration - Duración opcional para sobrescribir la predeterminada
     */
    start(duration) {
        if (duration) {
            this.duration = duration;
        }
        
        this.reset();
        this.isStopped = false;

        // Establecer estado inicial
        if (this.timerElement) {
            this.timerElement.textContent = this.timeLeft;
            this.timerElement.style.color = '#fff';
            const initialProgress = 100;
            this.timerElement.style.setProperty('--progress', `${initialProgress}%`);
        }

        // Limpiar intervalo anterior si existe
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        // Iniciar nuevo intervalo
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            
            // Actualizar elemento del DOM
            if (this.timerElement) {
                this.timerElement.textContent = this.timeLeft;
                const progress = (this.timeLeft / this.duration) * 100;
                this.timerElement.style.setProperty('--progress', `${progress}%`);

                // Cambiar color según el tiempo restante
                if (this.timeLeft <= 10) {
                    this.timerElement.style.color = '#ff9900';
                }
                if (this.timeLeft <= 5) {
                    this.timerElement.style.color = '#ff0000';
                }
            }

            // Llamar al callback en cada tick
            this.onTick(this.timeLeft);

            // Comprobar si se acabó el tiempo
            if (this.timeLeft <= 0) {
                this.stop();
                if (this.timerElement) {
                    this.timerElement.textContent = '0';
                    this.timerElement.style.color = '#ff0000';
                }
                this.onTimeUp();
            }
        }, 1000);
    }

    /**
     * Detiene el temporizador
     */
    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.isStopped = true;
    }

    /**
     * Restablece el temporizador a su valor inicial
     */
    reset() {
        this.timeLeft = this.duration;
        if (this.timerElement) {
            this.timerElement.textContent = this.timeLeft;
        }
    }

    /**
     * Devuelve el tiempo restante
     * @returns {number} Tiempo restante en segundos
     */
    getTimeLeft() {
        return this.timeLeft;
    }
    
    /**
     * Establece una nueva duración para el temporizador
     * @param {number} duration - Nueva duración en segundos
     */
    setDuration(duration) {
        if (duration && duration > 0) {
            this.duration = duration;
            if (this.isStopped) {
                this.reset();
            }
        }
    }
}

export default TimerManager; 
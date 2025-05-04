/**
 * Clase para gestionar todos los audios del juego
 */
class AudioManager {
    /**
     * @param {Object} options - Opciones de configuración
     */
    constructor(options = {}) {
        // Referencias a elementos de audio
        this.sounds = {
            tick: null,
            correct: null,
            wrong: null,
            background: null,
            suspense: null,
            firstQuestions: null,
            wrongAnswerMusic: null,
            correctAnswerMusic: null,
            phoneCall: null,
            midGame: null,
            win1000: null
        };
        
        // Configuración de volumen
        this.volume = {
            effects: options.effectsVolume || 0.7,
            music: options.musicVolume || 0.5
        };
    }

    /**
     * Inicializa el gestor de audio
     */
    init() {
        this.loadSounds();
        this.setInitialVolumes();
    }

    /**
     * Carga todas las referencias a los elementos de audio
     */
    loadSounds() {
        this.sounds.tick = document.getElementById('tickSound');
        this.sounds.correct = document.getElementById('correctSound');
        this.sounds.wrong = document.getElementById('wrongSound');
        this.sounds.background = document.getElementById('backgroundMusic');
        this.sounds.suspense = document.getElementById('suspenseMusic');
        this.sounds.firstQuestions = document.getElementById('firstQuestionsMusic');
        this.sounds.wrongAnswerMusic = document.getElementById('wrongAnswerMusic');
        this.sounds.correctAnswerMusic = document.getElementById('correctAnswerMusic');
        this.sounds.phoneCall = document.getElementById('phoneCallSound');
        this.sounds.midGame = document.getElementById('midGameMusic');
        this.sounds.win1000 = document.getElementById('win1000Music');
    }

    /**
     * Configura los volúmenes iniciales
     */
    setInitialVolumes() {
        Object.values(this.sounds).forEach(sound => {
            if (!sound) return;
            
            if (sound.id === 'backgroundMusic' || 
                sound.id === 'suspenseMusic' || 
                sound.id === 'firstQuestionsMusic' || 
                sound.id === 'midGameMusic') {
                sound.volume = this.volume.music;
            } else {
                sound.volume = this.volume.effects;
            }
        });
    }
    
    /**
     * Actualiza los volúmenes de audio
     * @param {number} effectsVolume - Volumen para efectos de sonido
     * @param {number} musicVolume - Volumen para música
     */
    setVolumes(effectsVolume, musicVolume) {
        if (effectsVolume !== undefined) {
            this.volume.effects = Math.max(0, Math.min(1, effectsVolume));
        }
        
        if (musicVolume !== undefined) {
            this.volume.music = Math.max(0, Math.min(1, musicVolume));
        }
        
        // Aplicar nuevos volúmenes a los sonidos existentes
        this.setInitialVolumes();
    }

    /**
     * Obtiene todas las referencias a los sonidos
     * @returns {Object} Objeto con todas las referencias a los sonidos
     */
    getSounds() {
        return this.sounds;
    }

    /**
     * Reproduce un efecto de sonido
     * @param {string} soundName - Nombre del sonido a reproducir
     * @param {Object} options - Opciones adicionales (loop, volume)
     */
    playSound(soundName, options = {}) {
        const sound = this.sounds[soundName];
        if (!sound) return;
        
        // Restablecer posición de reproducción
        sound.currentTime = options.currentTime || 0;
        
        // Configurar opciones de reproducción
        if (options.volume !== undefined) {
            sound.volume = options.volume;
        }
        
        // Reproducir el sonido
        sound.play().catch(error => {
            console.error(`Error al reproducir ${soundName}:`, error);
        });
        
        // Configurar callback para cuando termine
        if (options.onEnded) {
            sound.onended = options.onEnded;
        }
    }

    /**
     * Detiene un sonido
     * @param {string} soundName - Nombre del sonido a detener
     */
    stopSound(soundName) {
        const sound = this.sounds[soundName];
        if (!sound) return;
        
        sound.pause();
        sound.currentTime = 0;
    }

    /**
     * Pausa un sonido
     * @param {string} soundName - Nombre del sonido a pausar
     */
    pauseSound(soundName) {
        const sound = this.sounds[soundName];
        if (!sound) return;
        
        sound.pause();
    }

    /**
     * Ajusta el volumen de un sonido
     * @param {string} soundName - Nombre del sonido
     * @param {number} volume - Volumen (0-1)
     */
    setVolume(soundName, volume) {
        const sound = this.sounds[soundName];
        if (!sound) return;
        
        sound.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Inicia la música de fondo
     */
    startBackgroundMusic() {
        if (!this.sounds.background) return;
        
        this.sounds.background.loop = true;
        this.sounds.background.volume = this.volume.music;
        this.sounds.background.play().catch(() => {
            console.log('La reproducción automática de audio está deshabilitada');
        });
    }

    /**
     * Elige y reproduce la música adecuada para el nivel actual
     * @param {number} level - Nivel actual del juego
     */
    playLevelMusic(level) {
        // Detener cualquier música anterior, incluida la de fondo
        this.stopSound('background');
        this.stopSound('suspense');
        this.stopSound('firstQuestions');
        this.stopSound('midGame');
        
        // Elegir música según el nivel
        let musicToPlay = null;
        
        if (level >= 6) {
            musicToPlay = 'midGame';
        } else if (level >= 1 && level <= 4) {
            musicToPlay = 'firstQuestions';
        } else {
            musicToPlay = 'suspense';
        }
        
        // Reproducir la música seleccionada
        this.playSound(musicToPlay, {
            volume: this.volume.music
        });
    }

    /**
     * Reproduce el sonido de respuesta correcta
     * @param {number} level - Nivel actual para determinar el sonido a usar
     */
    playCorrectAnswerSound(level) {
        // Detener músicas de preguntas
        this.stopSound('background');
        this.stopSound('suspense');
        this.stopSound('firstQuestions');
        this.stopSound('midGame');
        
        // Para niveles importantes (5, 10) reproducir sonido especial
        if (level === 5 || level === 10) {
            // Se reproducirá después con win1000
        } else {
            this.playSound('correctAnswerMusic');
            
            // Detener el sonido después de 5 segundos
            setTimeout(() => {
                this.stopSound('correctAnswerMusic');
            }, 5000);
        }
    }

    /**
     * Reproduce el sonido de respuesta incorrecta
     */
    playWrongAnswerSound() {
        // Detener músicas de preguntas
        this.stopSound('background');
        this.stopSound('suspense');
        this.stopSound('firstQuestions');
        this.stopSound('midGame');
        
        this.playSound('wrongAnswerMusic');
    }

    /**
     * Reproduce el sonido de premio asegurado (1.500€ o 20.000€)
     * @param {Function} callback - Función a ejecutar cuando termine el sonido
     */
    playGuaranteedPrizeSound(callback) {
        this.playSound('win1000', {
            onEnded: callback
        });
    }

    /**
     * Baja temporalmente el volumen de la música para un efecto
     * @param {number} reduction - Cantidad a reducir (0-1)
     */
    lowerMusicVolume(reduction = 0.7) {
        ['background', 'suspense', 'firstQuestions', 'midGame'].forEach(musicName => {
            const music = this.sounds[musicName];
            if (music && !music.paused) {
                const originalVolume = music.volume;
                music.volume = Math.max(0, originalVolume - reduction);
            }
        });
    }

    /**
     * Restaura el volumen original de la música
     */
    restoreMusicVolume() {
        ['background', 'suspense', 'firstQuestions', 'midGame'].forEach(musicName => {
            const music = this.sounds[musicName];
            if (music && !music.paused) {
                music.volume = this.volume.music;
            }
        });
    }
}

export default AudioManager; 
/**
 * Clase para gestionar la síntesis de voz
 */
class SpeechManager {
    /**
     * @param {Object} options - Opciones de configuración
     */
    constructor(options = {}) {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.selectedSpanishVoice = null;
        this.speechRate = options.rate || 0.8;  // Velocidad del habla (más lento = 0.8)
        this.pitch = options.pitch || 1.0;      // Tono de voz
        this.volume = options.volume || 1.0;    // Volumen
        this.enabled = options.enabled !== false; // Habilitar/deshabilitar síntesis de voz
        
        // Cargar voces disponibles
        this.loadVoices();
        
        // El evento 'voiceschanged' puede tardar en dispararse, así que lo escuchamos
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = this.loadVoices.bind(this);
        }
    }

    /**
     * Carga las voces disponibles y selecciona una voz en español
     */
    loadVoices() {
        this.voices = this.synth.getVoices();
        console.log("Voces disponibles:", this.voices);

        // Intentar encontrar una voz masculina en español (puede fallar)
        this.selectedSpanishVoice = this.voices.find(voice => 
            voice.lang === 'es-ES' && voice.name.toLowerCase().includes('male')
        );
        
        // Si no hay voz masculina en español, buscar cualquier voz en español
        if (!this.selectedSpanishVoice) {
            this.selectedSpanishVoice = this.voices.find(voice => 
                voice.lang.startsWith('es-') && voice.name.toLowerCase().includes('male')
            );
        }
        
        if (!this.selectedSpanishVoice) {
            this.selectedSpanishVoice = this.voices.find(voice => 
                voice.lang === 'es-ES'
            );
        }
        
        if (!this.selectedSpanishVoice) {
            this.selectedSpanishVoice = this.voices.find(voice => 
                voice.lang.startsWith('es-')
            );
        }
        
        console.log("Voz española seleccionada:", 
            this.selectedSpanishVoice ? this.selectedSpanishVoice.name : "(Voz por defecto)");
    }

    /**
     * Habla un texto con la voz seleccionada
     * @param {string} text - Texto a hablar
     * @param {Function} onEndCallback - Función a ejecutar cuando termine de hablar
     */
    speak(text, onEndCallback = null) {
        // Si la síntesis de voz está deshabilitada, solo ejecutar el callback
        if (!this.enabled) {
            if (onEndCallback) {
                setTimeout(onEndCallback, 100);
            }
            return;
        }
        
        if (this.synth.speaking) {
            console.warn('SpeechSynthesis ya estaba hablando. Cancelando y reintentando.');
            this.synth.cancel();
            setTimeout(() => this.speakInternal(text, onEndCallback), 150);
            return;
        }
        this.speakInternal(text, onEndCallback);
    }

    /**
     * Método interno para hablar un texto
     * @param {string} text - Texto a hablar
     * @param {Function} onEndCallback - Función a ejecutar cuando termine de hablar
     */
    speakInternal(text, onEndCallback) {
        // Limpiar cualquier etiqueta HTML
        const cleanText = text.replace(/<[^>]*>/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Configurar eventos
        utterance.onend = () => {
            console.log("SpeechSynthesisUtterance.onend");
            if (onEndCallback) {
                onEndCallback();
            }
        };
        
        utterance.onerror = (event) => {
            console.error(`SpeechSynthesisUtterance.onerror: ${event.error}`);
            if (onEndCallback) {
                onEndCallback();
            }
        };

        // Configurar voz en español
        if (this.selectedSpanishVoice) {
            utterance.voice = this.selectedSpanishVoice;
        } else {
            utterance.lang = 'es-ES';
        }
        
        // Configurar parámetros de voz
        utterance.rate = this.speechRate;
        utterance.pitch = this.pitch;
        utterance.volume = this.volume;

        // Si no se han cargado las voces, intentar cargarlas de nuevo
        if (this.voices.length === 0) {
            this.loadVoices();
        }

        console.log("Intentando hablar:", cleanText);
        setTimeout(() => {
            this.synth.speak(utterance);
        }, 50);
    }

    /**
     * Cancela la síntesis de voz actual
     */
    cancel() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
    }

    /**
     * Pausa la síntesis de voz
     */
    pause() {
        this.synth.pause();
    }

    /**
     * Reanuda la síntesis de voz
     */
    resume() {
        this.synth.resume();
    }

    /**
     * Ajusta la velocidad del habla
     * @param {number} rate - Velocidad (0.1-10)
     */
    setRate(rate) {
        this.speechRate = Math.max(0.1, Math.min(10, rate));
    }

    /**
     * Ajusta el tono de voz
     * @param {number} pitch - Tono (0-2)
     */
    setPitch(pitch) {
        this.pitch = Math.max(0, Math.min(2, pitch));
    }

    /**
     * Ajusta el volumen
     * @param {number} volume - Volumen (0-1)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
    
    /**
     * Habilita o deshabilita la síntesis de voz
     * @param {boolean} enabled - true para habilitar, false para deshabilitar
     */
    setEnabled(enabled) {
        this.enabled = !!enabled;
        
        // Si se deshabilita y estaba hablando, cancelar
        if (!this.enabled && this.synth.speaking) {
            this.cancel();
        }
    }

    /**
     * Devuelve si el sintetizador está hablando
     * @returns {boolean} - true si está hablando
     */
    isSpeaking() {
        return this.synth.speaking;
    }

    /**
     * Devuelve si el sintetizador está pausado
     * @returns {boolean} - true si está pausado
     */
    isPaused() {
        return this.synth.paused;
    }
    
    /**
     * Devuelve si la síntesis de voz está habilitada
     * @returns {boolean} - true si está habilitada
     */
    isEnabled() {
        return this.enabled;
    }

    /**
     * Devuelve todas las voces disponibles
     * @returns {Array} - Array de voces
     */
    getVoices() {
        return this.voices;
    }

    /**
     * Devuelve la voz seleccionada
     * @returns {SpeechSynthesisVoice} - Voz seleccionada
     */
    getSelectedVoice() {
        return this.selectedSpanishVoice;
    }
}

export default SpeechManager; 
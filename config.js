/**
 * Configuración global del juego
 */
const DEFAULT_CONFIG = {
    // Temporizador
    timer: {
        duration: 45,          // Duración en segundos
        showTimer: true        // Mostrar/ocultar temporizador
    },
    
    // Premios por nivel
    prizes: {
        1: 100,
        2: 250,
        3: 500,
        4: 750,
        5: 1500,       // Primer seguro
        6: 2500,
        7: 5000,
        8: 10000,
        9: 15000,
        10: 20000,     // Segundo seguro
        11: 30000,
        12: 50000,
        13: 100000,
        14: 300000,
        15: 1000000    // Premio final
    },
    
    // Niveles de seguro (donde el jugador no pierde todo)
    safeLevels: [5, 10],
    
    // Sonidos
    sounds: {
        effectsVolume: 0.7,
        musicVolume: 0.5,
        enableSpeech: true
    }
};

/**
 * Clase para gestionar la configuración del juego
 */
class ConfigManager {
    constructor() {
        this.loadConfig();
    }
    
    /**
     * Carga la configuración desde localStorage o utiliza los valores predeterminados
     */
    loadConfig() {
        const savedConfig = localStorage.getItem('gameConfig');
        
        if (savedConfig) {
            try {
                this.config = JSON.parse(savedConfig);
                // Asegurar que todas las propiedades existan
                this.config = this.mergeWithDefaults(this.config, DEFAULT_CONFIG);
            } catch (e) {
                console.error('Error al cargar la configuración:', e);
                this.config = {...DEFAULT_CONFIG};
            }
        } else {
            this.config = {...DEFAULT_CONFIG};
        }
    }
    
    /**
     * Combina el objeto de configuración con los valores predeterminados
     * para asegurar que todas las propiedades necesarias existan
     */
    mergeWithDefaults(config, defaults) {
        const result = {...defaults};
        
        for (const key in config) {
            if (typeof defaults[key] === 'object' && !Array.isArray(defaults[key])) {
                result[key] = this.mergeWithDefaults(config[key], defaults[key]);
            } else {
                result[key] = config[key];
            }
        }
        
        return result;
    }
    
    /**
     * Guarda la configuración actual en localStorage
     */
    saveConfig() {
        localStorage.setItem('gameConfig', JSON.stringify(this.config));
    }
    
    /**
     * Actualiza una sección específica de la configuración
     * @param {string} section - Sección a actualizar (timer, prizes, etc.)
     * @param {Object} values - Nuevos valores
     */
    updateConfig(section, values) {
        if (this.config[section]) {
            this.config[section] = {...this.config[section], ...values};
            this.saveConfig();
        }
    }
    
    /**
     * Actualiza una propiedad específica de la configuración
     * @param {string} key - Clave a actualizar (pueden ser rutas como 'timer.duration')
     * @param {any} value - Nuevo valor
     */
    updateValue(key, value) {
        const parts = key.split('.');
        let current = this.config;
        
        for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) {
                current[parts[i]] = {};
            }
            current = current[parts[i]];
        }
        
        current[parts[parts.length - 1]] = value;
        this.saveConfig();
    }
    
    /**
     * Obtiene toda la configuración
     * @returns {Object} - Configuración completa
     */
    getConfig() {
        return this.config;
    }
    
    /**
     * Obtiene una sección específica de la configuración
     * @param {string} section - Sección a obtener
     * @returns {Object} - Sección de configuración
     */
    getSection(section) {
        return this.config[section] || {};
    }
    
    /**
     * Obtiene una propiedad específica de la configuración
     * @param {string} key - Clave a obtener (pueden ser rutas como 'timer.duration')
     * @param {any} defaultValue - Valor por defecto si no existe
     * @returns {any} - Valor de la propiedad
     */
    getValue(key, defaultValue) {
        const parts = key.split('.');
        let current = this.config;
        
        for (const part of parts) {
            if (current === undefined || current === null) {
                return defaultValue;
            }
            current = current[part];
        }
        
        return current !== undefined ? current : defaultValue;
    }
    
    /**
     * Restablece toda la configuración a los valores predeterminados
     */
    resetConfig() {
        this.config = {...DEFAULT_CONFIG};
        this.saveConfig();
    }
}

export default new ConfigManager(); 
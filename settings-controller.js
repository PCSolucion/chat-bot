/**
 * Controlador para manejar los ajustes del juego
 */
import configManager from './config.js';

class SettingsController {
    constructor() {
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeSettings = document.getElementById('closeSettings');
        this.saveSettings = document.getElementById('saveSettings');
        this.resetSettings = document.getElementById('resetSettings');
        
        // Elementos del formulario
        this.timerDuration = document.getElementById('timerDuration');
        this.showTimer = document.getElementById('showTimer');
        
        // Elementos de sonido
        this.effectsVolume = document.getElementById('effectsVolume');
        this.musicVolume = document.getElementById('musicVolume');
        this.enableSpeech = document.getElementById('enableSpeech');
        
        // Campos de premios
        this.prizeInputs = {};
        for (let i = 1; i <= 15; i++) {
            this.prizeInputs[i] = document.getElementById(`prize${i}`);
        }
        
        this.setupEventListeners();
        this.setupVolumeControls();
    }
    
    /**
     * Configura los listeners de eventos
     */
    setupEventListeners() {
        // Botón para abrir el modal de ajustes
        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', () => this.openSettingsModal());
        }
        
        // Botón para cerrar el modal
        if (this.closeSettings) {
            this.closeSettings.addEventListener('click', () => this.closeSettingsModal());
        }
        
        // Botón para guardar los ajustes
        if (this.saveSettings) {
            this.saveSettings.addEventListener('click', () => this.saveAllSettings());
        }
        
        // Botón para restablecer los ajustes
        if (this.resetSettings) {
            this.resetSettings.addEventListener('click', () => this.resetAllSettings());
        }
        
        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (event) => {
            if (event.target === this.settingsModal) {
                this.closeSettingsModal();
            }
        });
    }
    
    /**
     * Configura los controles de volumen
     */
    setupVolumeControls() {
        const updateVolumeValue = (slider) => {
            const valueSpan = slider.parentElement.querySelector('.volume-value');
            if (valueSpan) {
                valueSpan.textContent = `${slider.value}%`;
            }
        };

        if (this.effectsVolume) {
            this.effectsVolume.addEventListener('input', () => {
                updateVolumeValue(this.effectsVolume);
            });
        }

        if (this.musicVolume) {
            this.musicVolume.addEventListener('input', () => {
                updateVolumeValue(this.musicVolume);
            });
        }
    }
    
    /**
     * Abre el modal de ajustes y carga la configuración actual
     */
    openSettingsModal() {
        this.loadCurrentSettings();
        if (this.settingsModal) {
            this.settingsModal.style.display = 'flex';
        }
    }
    
    /**
     * Cierra el modal de ajustes
     */
    closeSettingsModal() {
        if (this.settingsModal) {
            this.settingsModal.style.display = 'none';
            
            // Disparar evento para notificar que se cerró el modal
            document.dispatchEvent(new CustomEvent('settingsClosed'));
        }
    }
    
    /**
     * Carga la configuración actual en el formulario
     */
    loadCurrentSettings() {
        const config = configManager.getConfig();
        
        // Cargar configuración del temporizador
        if (this.timerDuration) {
            this.timerDuration.value = config.timer.duration || 45;
        }
        
        if (this.showTimer) {
            this.showTimer.checked = config.timer.showTimer !== false;
        }

        // Cargar configuración de sonido
        if (this.effectsVolume) {
            this.effectsVolume.value = (config.sounds.effectsVolume * 100) || 70;
            const effectsValueSpan = this.effectsVolume.parentElement.querySelector('.volume-value');
            if (effectsValueSpan) {
                effectsValueSpan.textContent = `${this.effectsVolume.value}%`;
            }
        }

        if (this.musicVolume) {
            this.musicVolume.value = (config.sounds.musicVolume * 100) || 50;
            const musicValueSpan = this.musicVolume.parentElement.querySelector('.volume-value');
            if (musicValueSpan) {
                musicValueSpan.textContent = `${this.musicVolume.value}%`;
            }
        }

        if (this.enableSpeech) {
            this.enableSpeech.checked = config.sounds.enableSpeech !== false;
        }
        
        // Cargar configuración de premios
        for (let i = 1; i <= 15; i++) {
            if (this.prizeInputs[i]) {
                this.prizeInputs[i].value = config.prizes[i] || 0;
            }
        }
    }
    
    /**
     * Guarda todos los ajustes
     */
    saveAllSettings() {
        // Guardar configuración del temporizador
        const timerConfig = {
            duration: parseInt(this.timerDuration.value, 10) || 45,
            showTimer: this.showTimer.checked
        };
        configManager.updateConfig('timer', timerConfig);

        // Guardar configuración de sonido
        const soundsConfig = {
            effectsVolume: parseFloat(this.effectsVolume.value) / 100 || 0.7,
            musicVolume: parseFloat(this.musicVolume.value) / 100 || 0.5,
            enableSpeech: this.enableSpeech.checked
        };
        configManager.updateConfig('sounds', soundsConfig);
        
        // Guardar configuración de premios
        const prizesConfig = {};
        for (let i = 1; i <= 15; i++) {
            if (this.prizeInputs[i]) {
                prizesConfig[i] = parseInt(this.prizeInputs[i].value, 10) || 0;
            }
        }
        configManager.updateConfig('prizes', prizesConfig);
        
        // Mostrar mensaje de confirmación
        alert('Los ajustes se han guardado correctamente.');
        
        // Cerrar el modal
        this.closeSettingsModal();
        
        // Actualizar la interfaz si es necesario
        this.updateGameInterface();
    }
    
    /**
     * Restablece todos los ajustes a los valores predeterminados
     */
    resetAllSettings() {
        if (confirm('¿Estás seguro de que deseas restablecer todos los ajustes a los valores predeterminados?')) {
            configManager.resetConfig();
            this.loadCurrentSettings();
            alert('Los ajustes se han restablecido correctamente.');
            
            // Actualizar la interfaz si es necesario
            this.updateGameInterface();
        }
    }
    
    /**
     * Actualiza la interfaz del juego con los nuevos ajustes
     */
    updateGameInterface() {
        // Actualizar árbol de premios
        const config = configManager.getConfig();
        const moneyLevels = document.querySelectorAll('.money-level');
        
        moneyLevels.forEach(level => {
            const levelNumber = parseInt(level.dataset.level);
            if (levelNumber && config.prizes[levelNumber]) {
                level.textContent = `${config.prizes[levelNumber].toLocaleString()} €`;
            }
        });
        
        // Actualizar temporizador
        const timerElement = document.querySelector('.timer');
        if (timerElement && config.timer) {
            timerElement.style.display = config.timer.showTimer ? 'flex' : 'none';
        }
        
        // Enviar evento personalizado para notificar a otros componentes
        const event = new CustomEvent('configUpdated', { detail: config });
        document.dispatchEvent(event);
    }
}

export default SettingsController; 
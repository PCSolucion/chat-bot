/**
 * Clase para gestionar los comodines del juego
 */
class LifelineManager {
    /**
     * @param {Object} options - Opciones de configuración
     * @param {Object} options.sounds - Sonidos del juego
     * @param {Object} options.onLifelineUsed - Callback cuando se usa un comodín
     */
    constructor(options = {}) {
        this.sounds = options.sounds || {};
        this.onLifelineUsed = options.onLifelineUsed || (() => {});
        
        // Estado de los comodines
        this.lifelines = {
            fifty: true,
            audience: true,
            phone: true
        };

        // Referencias a los elementos DOM de los comodines
        this.buttons = {
            fifty: null,
            audience: null,
            phone: null
        };

        // Referencias a funciones de integración
        this.questionProvider = null;
        this.phoneMessageContainer = null;
        this.audienceChartElement = null;
        this.speechSynthesis = null;
    }

    /**
     * Inicializa los comodines con elementos DOM
     * @param {Object} elements - Elementos DOM de los comodines
     */
    init(elements) {
        this.buttons.fifty = elements.fifty;
        this.buttons.audience = elements.audience;
        this.buttons.phone = elements.phone;
        this.phoneMessageContainer = elements.phoneMessageContainer;
        this.audienceChartElement = elements.audienceChart;
    }

    /**
     * Establece el proveedor de preguntas
     * @param {Function} provider - Función que devuelve la pregunta actual
     */
    setQuestionProvider(provider) {
        this.questionProvider = provider;
    }

    /**
     * Establece el sintetizador de voz
     * @param {Object} speechSynthesis - Objeto con métodos para síntesis de voz
     */
    setSpeechSynthesis(speechSynthesis) {
        this.speechSynthesis = speechSynthesis;
    }

    /**
     * Restablece todos los comodines para una nueva partida
     */
    resetLifelines() {
        this.lifelines = {
            fifty: true,
            audience: true,
            phone: true
        };

        Object.keys(this.buttons).forEach(key => {
            if (this.buttons[key]) {
                this.buttons[key].disabled = false;
                this.buttons[key].classList.remove('lifeline-used');
            }
        });
    }

    /**
     * Usa el comodín 50:50
     * @param {Array} answerButtons - Botones de respuesta
     * @returns {boolean} - true si el comodín estaba disponible y se usó
     */
    useFiftyFifty(answerButtons) {
        if (!this.lifelines.fifty || !this.questionProvider) return false;
        
        const currentQuestion = this.questionProvider();
        if (!currentQuestion) return false;

        const correctOption = currentQuestion.correct;
        let wrongOptions = Object.keys(currentQuestion.options).filter(opt => opt !== correctOption);
        wrongOptions = this.shuffleArray(wrongOptions).slice(0, 2);
        
        wrongOptions.forEach(option => {
            const button = answerButtons.find(btn => btn.dataset.option === option);
            if (button) {
                button.disabled = true;
                button.style.visibility = 'hidden';
            }
        });
        
        this.lifelines.fifty = false;
        this.markLifelineAsUsed('fifty');
        this.onLifelineUsed('fifty');
        return true;
    }

    /**
     * Usa el comodín de la ayuda del público
     * @returns {boolean} - true si el comodín estaba disponible y se usó
     */
    useAudienceHelp() {
        if (!this.lifelines.audience || !this.questionProvider || !this.audienceChartElement) return false;
        
        const currentQuestion = this.questionProvider();
        if (!currentQuestion) return false;

        const correctOption = currentQuestion.correct;
        const percentages = { A: 0, B: 0, C: 0, D: 0 };
        
        // Dar al correctOption un porcentaje alto (50-80%)
        percentages[correctOption] = Math.floor(Math.random() * 30) + 50;
        
        // Distribuir el resto entre las otras opciones
        const remaining = 100 - percentages[correctOption];
        const otherOptions = Object.keys(percentages).filter(opt => opt !== correctOption);
        let rem = remaining;
        
        otherOptions.forEach((opt, index) => {
            if (index === otherOptions.length - 1) {
                percentages[opt] = rem;
            } else {
                const value = Math.floor(Math.random() * (rem / (otherOptions.length - index)));
                percentages[opt] = value;
                rem -= value;
            }
        });
        
        this.showAudienceChart(percentages);
        this.lifelines.audience = false;
        this.markLifelineAsUsed('audience');
        this.onLifelineUsed('audience');
        return true;
    }

    /**
     * Muestra el gráfico de resultados de la ayuda del público
     * @param {Object} percentages - Porcentajes para cada opción
     */
    showAudienceChart(percentages) {
        const chart = this.audienceChartElement;
        chart.innerHTML = '';
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'audience-icon';
        chart.appendChild(iconDiv);

        const percentagesDiv = document.createElement('div');
        percentagesDiv.className = 'audience-percentages';
        chart.appendChild(percentagesDiv);

        const barsDiv = document.createElement('div');
        barsDiv.className = 'audience-bars';
        chart.appendChild(barsDiv);

        const valueElements = [];
        const barElements = [];

        ['A', 'B', 'C', 'D'].forEach(option => {
            const percentageValueDiv = document.createElement('div');
            percentageValueDiv.className = 'audience-percentage-value';
            percentageValueDiv.textContent = `${percentages[option]}%`;
            percentageValueDiv.style.opacity = '0';
            percentagesDiv.appendChild(percentageValueDiv);
            valueElements.push(percentageValueDiv);

            const barContainer = document.createElement('div');
            barContainer.className = 'audience-bar-container';

            const barDiv = document.createElement('div');
            barDiv.className = 'audience-bar';
            barDiv.style.setProperty('--final-height', `${percentages[option]}px`);
            barContainer.appendChild(barDiv);
            barElements.push(barDiv);

            const labelDiv = document.createElement('div');
            labelDiv.className = 'audience-bar-label';
            labelDiv.textContent = option;
            barContainer.appendChild(labelDiv);
            
            barsDiv.appendChild(barContainer);
        });

        chart.style.display = 'flex';

        requestAnimationFrame(() => {
            setTimeout(() => {
                barElements.forEach(bar => bar.classList.add('animate'));
            }, 20);
        });
       
        setTimeout(() => {
            valueElements.forEach(el => el.style.opacity = '1');
        }, 5000);
    }

    /**
     * Usa el comodín de la llamada a un amigo
     * @returns {boolean} - true si el comodín estaba disponible y se usó
     */
    usePhoneFriend() {
        if (!this.lifelines.phone || !this.questionProvider || !this.phoneMessageContainer) return false;
        
        // Desactivar comodín inmediatamente
        this.lifelines.phone = false;
        this.markLifelineAsUsed('phone');
        this.onLifelineUsed('phone');
        
        // Cancelar habla anterior si está hablando
        if (this.speechSynthesis && this.speechSynthesis.cancel) {
            this.speechSynthesis.cancel();
        }
        
        // Reproducir sonido de llamada
        if (this.sounds && this.sounds.phoneCall) {
            this.sounds.phoneCall.currentTime = 0;
            this.sounds.phoneCall.play().catch(e => console.error("Error al reproducir sonido de llamada:", e));
        }
        
        // Simular llamada después de 3 segundos
        setTimeout(() => {
            // Detener sonido de llamada
            if (this.sounds && this.sounds.phoneCall) {
                this.sounds.phoneCall.pause();
            }
            
            // Generar respuesta del amigo
            this.generatePhoneFriendResponse();
        }, 3000);
        
        return true;
    }

    /**
     * Genera y muestra la respuesta del amigo para el comodín
     */
    generatePhoneFriendResponse() {
        const currentQuestion = this.questionProvider();
        if (!currentQuestion) return;

        const correctOption = currentQuestion.correct;
        const confidence = Math.random();
        let message;
        let textToSpeak;
        
        // Frases para cuando el amigo no está seguro
        const unsurePhrases = [
            "Uff, me pillas en el baño... diría que... ¿la A? No sé.",
            "¡Ay! Justo estaba viendo un TikTok... ¿Qué preguntaste? Creo que es la C.",
            "Mi gato se acaba de subir al teclado y ha marcado la B. ¡Hazle caso a él!",
            "Mmm, eso me suena... ¿Era de un anuncio? Prueba con la D, ¡a lo loco!",
            "Estoy 99% seguro de que no es la A... o sí... ¡Qué lío!",
            // ... (más frases)
        ];

        if (confidence > 0.7) {
            // El amigo está bastante seguro (70% del tiempo da la respuesta correcta)
            const baseMessage = `Estoy ${Math.floor(confidence * 90) + 10}% seguro de que la respuesta es ${correctOption}`;
            const displayMessage = `📞 Amigo: Estoy ${Math.floor(confidence * 90) + 10}% seguro de que la respuesta es <b>${correctOption}</b>`;
            
            if (Math.random() < 0.33) {
                const scotLanePart = "Scot Lane me lo confirmó, jeje";
                textToSpeak = `${baseMessage}. ${scotLanePart}`;
                message = `${displayMessage}. ${scotLanePart} 😉`;
            } else {
                textToSpeak = baseMessage;
                message = displayMessage;
            }
        } else {
            // El amigo no está seguro (respuesta aleatoria con frases graciosas)
            const phrase = unsurePhrases[Math.floor(Math.random() * unsurePhrases.length)];
            textToSpeak = phrase;
            message = `📞 Amigo: ${phrase}`;
        }

        // Mostrar mensaje en el div
        if (message !== undefined) {
            this.phoneMessageContainer.innerHTML = message;
            this.phoneMessageContainer.style.display = 'block';
            setTimeout(() => this.phoneMessageContainer.classList.add('visible'), 10);
        }

        // Atenuar música y hablar
        if (textToSpeak !== undefined && this.speechSynthesis && this.speechSynthesis.speak) {
            // Ya no intentamos bajar el volumen de la música de fondo, ya que no debe estar reproduciéndose
            this.speechSynthesis.speak(textToSpeak);
        }

        // Ocultar mensaje después de un tiempo
        setTimeout(() => {
            this.phoneMessageContainer.classList.remove('visible');
            setTimeout(() => this.phoneMessageContainer.style.display = 'none', 500);
        }, 9000);
    }

    /**
     * Marca un comodín como usado en la interfaz
     * @param {string} lifelineName - Nombre del comodín (fifty, audience, phone)
     */
    markLifelineAsUsed(lifelineName) {
        const button = this.buttons[lifelineName];
        if (button) {
            button.disabled = true;
            button.classList.add('lifeline-used');
        }
    }

    /**
     * Devuelve si un comodín está disponible
     * @param {string} lifelineName - Nombre del comodín
     * @returns {boolean} - true si está disponible
     */
    isLifelineAvailable(lifelineName) {
        return this.lifelines[lifelineName] === true;
    }

    /**
     * Mezcla un array aleatoriamente (algoritmo Fisher-Yates)
     * @param {Array} array - Array a mezclar
     * @returns {Array} - Array mezclado
     */
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}

export default LifelineManager; 
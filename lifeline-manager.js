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

        const barsDiv = document.createElement('div');
        barsDiv.className = 'audience-bars';
        chart.appendChild(barsDiv);

        const barElements = [];

        ['A', 'B', 'C', 'D'].forEach(option => {
            const barContainer = document.createElement('div');
            barContainer.className = 'audience-bar-container';

            const barWrapper = document.createElement('div');
            barWrapper.className = 'audience-bar-wrapper';
            
            const barDiv = document.createElement('div');
            barDiv.className = 'audience-bar';
            barDiv.style.setProperty('--final-height', `${percentages[option]}%`);
            barElements.push(barDiv);
            
            const labelDiv = document.createElement('div');
            labelDiv.className = 'audience-bar-label';
            labelDiv.textContent = option;
            
            const percentageDiv = document.createElement('div');
            percentageDiv.className = 'audience-percentage-value';
            percentageDiv.textContent = `${percentages[option]}%`;
            percentageDiv.style.opacity = '0';

            barWrapper.appendChild(barDiv);
            barContainer.appendChild(barWrapper);
            barContainer.appendChild(labelDiv);
            barContainer.appendChild(percentageDiv);
            barsDiv.appendChild(barContainer);
        });

        chart.style.display = 'flex';

        requestAnimationFrame(() => {
            setTimeout(() => {
                barElements.forEach(bar => bar.classList.add('animate'));
            }, 20);
        });
       
        setTimeout(() => {
            chart.querySelectorAll('.audience-percentage-value').forEach(el => {
                el.style.opacity = '1';
            });
        }, 1500);
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
        
        // Frases para cuando el amigo está seguro
        const confidentPhrases = [
            `Estoy ${Math.floor(confidence * 90) + 10}% seguro de que la respuesta es ${correctOption}`,
            `¡Sin duda! La respuesta es ${correctOption} se lo escuché a Yisus en un directo`,
            `Me lo ha confirmado Scot Lane, es ${correctOption}`,
            `¡La tengo! Acabo de preguntarle a Takeru. Es ${correctOption}, seguro seguro`,
            `Esa me la sé desde la época de Cabolo en New World, es ${correctOption}`,
            `¡Esa me la sé! Es ${correctOption}`,
            `No tengo ninguna duda, es ${correctOption}`,
            `¡La ${correctOption}! ¡La ${correctOption}! ¡La ${correctOption}!`
        ];

        // Frases para cuando el amigo no está seguro
        const unsurePhrases = [
            "Uff, me pillas en el baño... diría que... ¿la A? No sé.",
            "¡Ay! Justo estaba viendo un TikTok... ¿Qué preguntaste? Creo que es la C.",
            "Mi gato se acaba de subir al teclado y ha marcado la B. ¡Hazle caso a él!",
            "Mmm, eso me suena... ¿Era de un anuncio? Prueba con la D, ¡a lo loco!",
            "Estoy 99% seguro de que no es la A... o sí... ¡Qué lío!",
            "Diría que la C, pero mi conexión es malísima, igual entendí otra cosa.",
            "¡Buf! Ni idea. Lanza una moneda, ¡es más fiable que yo ahora mismo!",
            "Espera que le pregunto a Google... Ah, no, ¡que eso no vale! Pues ni idea.",
            "¿Seguro que esa pregunta no la ha puesto ChatGPT? Suena rara... Quizás la D.",
            "Justo me estaba echando la siesta, todavía estoy medio dormido... ¿la B?",
            "Creo que vi la respuesta en un meme el otro día... pero no me acuerdo. ¿La A?",
            "Me suena a chino mandarín... ¿Has probado a usar el comodín del público?",
            "Le preguntaría a mi cuñado, que lo sabe todo, pero ahora no está. Yo diría la C.",
            "¡Esa me la sabía! Pero se me acaba de olvidar... Qué rabia. Prueba la D.",
            "¿No tendrás por ahí la respuesta oculta? Es que no me suena de nada. ¿La B?",
            "Mi bola de cristal dice... 'error 404, respuesta no encontrada'. Lo siento.",
            "Si aciertas, me debes una cena. Yo apuesto por la A.",
            "Déjame pensar... Pienso que... ¡mejor no pienses lo que pienso! Ni idea.",
            "La B de 'Bonita pregunta, pero ni idea'.",
            "Podría ser la D... o la C... o la A... ¡Vaya lío!",
            "¿Has considerado que todas podrían ser incorrectas? Es broma... creo. ¿La C?",
            "Justo estaba jugando al Wordle y me has desconcentrado. Diría la A.",
            "Si te digo la B y fallas, ¿me echas la culpa?",
            "Me suena de haberlo estudiado en el colegio, pero de eso hace mucho... ¿La D?",
            "¿No puedes cambiar de pregunta? Esta es muy difícil. Venga, la C.",
            "Estoy entre la A y la D... pero mi perro acaba de ladrar, ¡así que la A!",
            "¿Scot Lane no te dio una pista antes? Jeje. Ni idea, la verdad.",
            "Creo que la respuesta está en mi corazón... pero no la encuentro. ¿La B?",
            "Suena a respuesta trampa... Ten cuidado. Yo me la jugaría con la D.",
            "¿Te vale si te digo que me suena muchísimo? Porque saberla, no la sé. ¿La C?",
            "El 50:50 te vendría bien ahora, ¿eh? Yo diría la A.",
            "¡Qué difícil! Casi prefiero enfrentarme a un jefe final. Prueba la B.",
            "Estoy consultando con mis fuentes... y mis fuentes dicen que no tienen ni idea.",
            "Si esto fuera un examen, la dejaba en blanco. Pero como no lo es... ¡la D!",
            "¿No es la misma pregunta de la semana pasada? Qué memoria tengo... Ah, no. Ni idea.",
            "Mi cerebro acaba de hacer 'pantallazo azul'. Reiniciando... mientras tanto, ¿la A?",
            "Esa es de cultura general... y yo soy más de cultura 'particular'. Ni idea.",
            "Podría buscarla en mi enciclopedia... si estuviéramos en 1998. Prueba la B.",
            "Teléfono equivocado, prueba a llamar a un concursante de verdad. ¿La C?",
            "Mmm... ¿No será una de esas preguntas con doble sentido? Yo diría la D.",
            "Justo estaba haciendo la compra online... ¿Necesitas algo? Ah, la respuesta... la A.",
            "Si digo la B, ¿me das un comodín a mí para la próxima?",
            "¡La C! Seguro. Bueno, seguro seguro... tampoco. Pero tiene buena pinta.",
            "Esa pregunta es más vieja que Internet Explorer. No me acuerdo. ¿La D?",
            "¿Te has fijado en la cara que ha puesto el presentador? Yo creo que es la A.",
            "Me pica la nariz... dicen que eso significa que es la B. ¡O que tengo alergia!",
            "Estoy viendo la respuesta en mi sopa de letras... ¡Ah, no, son fideos! La C.",
            "Podría ser la D... pero no pongas la mano en el fuego por mí.",
            "Si tuviera que apostar mi colección de chapas, diría la A.",
            "¿Has probado a tararear la pregunta? A veces funciona. Mientras, la B.",
            "¡La C! Me lo ha chivado un pajarito... o igual era el vecino gritando.",
            "Esa pregunta ofende mi inteligencia... porque no tengo ni idea. ¿La D?",
            "Podría ser la A, pero no te fíes, que hoy no he tomado café.",
            "La B suena bien, ¿verdad? Pues eso.",
            "¿No hay opción E: 'Ninguna de las anteriores'? Vaya... Pues la C.",
            "Me suena a nombre de grupo de música indie. ¿La D?",
            "Si aciertas con la A, prométeme que no dirás que te ayudé.",
            "¡La B! Y si no es, hacemos como si no hubiera llamado.",
            "Estoy viendo el futuro... y veo... que necesitas otro comodín. ¿La C?",
            "¿No te sabes esa? ¡Pero si es súper fácil!... para el que la sepa. Ni idea. ¿La D?",
            "Diría la A, pero solo porque empieza por A de 'A ver si aciertas'.",
            "La B suena bien, ¿verdad? Pues eso.",
            "Me la juego: ¡La C! Si fallo, mala suerte. Culpa del healer",
            "¿Y si llamas a tu madre? Las madres lo saben todo. Yo, mientras, digo la D.",
            "Creo que la respuesta correcta es... ¡seguir tu instinto! El mío no funciona hoy."
        ];

        // Seleccionar respuesta basada en la confianza
        if (confidence > 0.7) {
            // El amigo está bastante seguro (70% del tiempo da la respuesta correcta)
            const phrase = confidentPhrases[Math.floor(Math.random() * confidentPhrases.length)];
            textToSpeak = phrase;
            message = `📞 Amigo: ${phrase}`;
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

        // Hablar
        if (textToSpeak !== undefined && this.speechSynthesis && this.speechSynthesis.speak) {
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
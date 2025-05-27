// Importar las preguntas desde el archivo questions.js
import questions from './questions.js';
import UserManager from './users.js';

class MillionaireGame {
    constructor() {
        this.userManager = new UserManager();
        this.currentLevel = 1;
        this.timeLeft = 30;
        this.timerInterval = null;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.currentPrize = 0;
        this.questions = questions; // Usar las preguntas importadas
        
        this.lifelines = {
            fifty: true,
            audience: true,
            phone: true
        };

        // Inicializar sonidos
        this.sounds = {
            tick: document.getElementById('tickSound'),
            correct: document.getElementById('correctSound'),
            wrong: document.getElementById('wrongSound'),
            background: document.getElementById('backgroundMusic'),
            suspense: document.getElementById('suspenseMusic'),
            firstQuestions: document.getElementById('firstQuestionsMusic'),
            wrongAnswerMusic: document.getElementById('wrongAnswerMusic'),
            correctAnswerMusic: document.getElementById('correctAnswerMusic'),
            phoneCall: document.getElementById('phoneCallSound'),
            midGame: document.getElementById('midGameMusic')
        };
        
        this.phoneMessageContainer = document.getElementById('phoneMessageContainer'); // Obtener referencia al nuevo div
        
        // --- Speech Synthesis Setup ---
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.selectedSpanishVoice = null;
        this.loadVoices();
        // El evento 'voiceschanged' puede tardar en dispararse, así que lo escuchamos
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = this.loadVoices.bind(this);
        }
        // --- End Speech Synthesis Setup ---

        this.setupStartMenu();
    }

    setupStartMenu() {
        const startMenuElement = document.getElementById('startMenu');
        const usernameModalElement = document.getElementById('usernameModal');
        const gameContainerElement = document.querySelector('.game-container');

        document.getElementById('userMode').addEventListener('click', () => {
            startMenuElement.classList.add('hidden'); // Ocultar menú con transición
            // Esperar a que termine la transición para mostrar el modal
            setTimeout(() => {
                usernameModalElement.classList.add('visible');
            }, 500); // 500ms coincide con la duración de la transición CSS
        });

        document.getElementById('guestMode').addEventListener('click', () => {
            this.userManager.createGuestUser();
            startMenuElement.classList.add('hidden'); // Ocultar menú con transición
            // Esperar a que termine la transición para iniciar juego
            setTimeout(() => {
                this.startGame();
            }, 500);
        });

        document.getElementById('startGame').addEventListener('click', () => {
            const username = document.getElementById('usernameInput').value.trim();
            if (username) {
                this.userManager.createUser(username);
                usernameModalElement.classList.remove('visible');
                // Aquí no ocultamos el menú principal porque ya está oculto
                this.startGame(); 
            } else {
                alert('Por favor, ingresa un nombre de usuario');
            }
        });
    }

    startGame() {
        // Asegurarse de que el menú principal esté oculto (sin transición si ya lo estaba)
        document.getElementById('startMenu').style.opacity = '0';
        document.getElementById('startMenu').style.visibility = 'hidden';
        
        document.querySelector('.game-container').style.display = 'flex';
        this.initializeGame();
        this.setupLightBeams();
    }

    initializeGame() {
        this.questionElement = document.getElementById('question');
        this.answerButtons = document.querySelectorAll('.answer-btn');
        this.moneyLevels = document.querySelectorAll('.money-level');
        this.lifelineButtons = document.querySelectorAll('.lifeline-btn');
        this.timerElement = document.querySelector('.timer');

        // Barajar las preguntas al inicio del juego
        this.questions = this.shuffleArray([...this.questions]);

        this.setupEventListeners();
        this.updateMoneyTree();
        this.loadQuestion();
        this.startBackgroundMusic();
    }

    setupEventListeners() {
        this.answerButtons.forEach(button => {
            button.addEventListener('click', () => this.handleAnswer(button));
        });

        document.getElementById('fifty').addEventListener('click', () => this.useFiftyFifty());
        document.getElementById('audience').addEventListener('click', () => this.useAudienceHelp());
        document.getElementById('phone').addEventListener('click', () => this.usePhoneFriend());
    }

    setupLightBeams() {
        const beams = document.querySelectorAll('.light-beam');
        beams.forEach(beam => {
            const duration = 5 + Math.random() * 10;
            beam.style.animation = `moveLight ${duration}s infinite ease-in-out`;
            const height = 100 + Math.random() * 200;
            beam.style.height = `${height}%`;
        });
    }

    startBackgroundMusic() {
        // Elimina o comenta esta función para que no suene la música de fondo
        // this.sounds.background.volume = 0.3;
        // this.sounds.background.play().catch(() => {
        //     console.log('La reproducción automática de audio está deshabilitada');
        // });
    }

    startTimer() {
        this.timeLeft = 45;
        this.timerElement = document.getElementById('timer');
        this.timerElement.textContent = this.timeLeft;
        this.timerElement.style.color = '#fff';
        
        const initialProgress = 100;
        this.timerElement.style.setProperty('--progress', `${initialProgress}%`);

        // --- Selección de Música de Fondo --- 
        // Parar todas las músicas específicas de pregunta antes de empezar
        this.sounds.suspense.pause();
        this.sounds.suspense.currentTime = 0;
        if (this.sounds.firstQuestions) {
            this.sounds.firstQuestions.pause();
            this.sounds.firstQuestions.currentTime = 0;
        }
        if (this.sounds.midGame) {
            this.sounds.midGame.pause();
            this.sounds.midGame.currentTime = 0;
        }

        let musicToPlay = null;
        // Elegir música según el nivel
        if (this.currentLevel >= 6) {
            musicToPlay = this.sounds.midGame;
        } else if (this.currentLevel >= 1 && this.currentLevel <= 4) {
            musicToPlay = this.sounds.firstQuestions;
        } else { // Nivel 5 (u otros casos si se añaden más músicas)
             musicToPlay = this.sounds.suspense; // Usar suspense para nivel 5 por defecto
        }
        
        // Reproducir la música seleccionada
        if (musicToPlay) {
            musicToPlay.currentTime = 0;
            musicToPlay.volume = 0.5; // Ajustar volumen si es necesario
            musicToPlay.play().catch(e => console.error("Error al reproducir música de pregunta:", e));
        }
        // --- Fin Selección Música ---

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft;
            
            const progress = (this.timeLeft / 45) * 100;
            this.timerElement.style.setProperty('--progress', `${progress}%`);

            if (this.timeLeft <= 10) {
                this.timerElement.style.color = '#ff9900';
            }

            if (this.timeLeft <= 5) {
                this.timerElement.style.color = '#ff0000';
                this.sounds.tick.play();
            }

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                // Parar la música que estuviera sonando al terminar el tiempo
                if (musicToPlay) musicToPlay.pause();
                
                this.timerElement.textContent = '0';
                this.timerElement.style.color = '#ff0000';
            }
        }, 1000);
    }

    handleTimeUp() {
        // Esta función ya no se llama, pero la dejamos vacía por si acaso
        // para no romper posibles referencias desde otras partes del código
    }

    loadQuestion() {
        const currentQuestion = this.questions[this.currentLevel - 1];
        this.questionElement.textContent = currentQuestion.question;

        this.answerButtons.forEach(button => {
            const option = button.dataset.option;
            const answerText = button.querySelector('.answer-text');
            answerText.textContent = currentQuestion.options[option];
            button.classList.remove('correct', 'wrong');
            button.disabled = false;
            button.style.visibility = 'visible';
            button.style.backgroundColor = '';
            button.style.color = '';
        });

        // Ocultar la gráfica del público y el mensaje de llamada al cargar nueva pregunta
        const audienceChart = document.getElementById('audienceChart');
        if (audienceChart) audienceChart.style.display = 'none';
        if (this.phoneMessageContainer) { // Ocultar mensaje de llamada
            this.phoneMessageContainer.classList.remove('visible');
            this.phoneMessageContainer.style.display = 'none'; 
        }

        this.startTimer();
        this.pulseQuestion();
    }

    pulseQuestion() {
        this.questionElement.style.animation = 'none';
        setTimeout(() => {
            this.questionElement.style.animation = 'pulse 1.5s ease-in-out';
        }, 10);
    }

    handleAnswer(selectedButton) {
        clearInterval(this.timerInterval);
        
        // --- Detener Música de Pregunta Actual --- 
        let currentMusic = null;
        if (this.currentLevel >= 6) {
             currentMusic = this.sounds.midGame;
        } else if (this.currentLevel >= 1 && this.currentLevel <= 4) {
             currentMusic = this.sounds.firstQuestions;
        } else {
             currentMusic = this.sounds.suspense;
        }
        if (currentMusic) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
        }
        // --- Fin Detener Música ---
        
        const selectedOption = selectedButton.dataset.option;
        const currentQuestion = this.questions[this.currentLevel - 1];

        this.answerButtons.forEach(button => {
            button.disabled = true;
            if (button.dataset.option === currentQuestion.correct) {
                setTimeout(() => {
                    button.classList.add('correct');
                }, 2000);
            }
        });

        const innerDiv = selectedButton.querySelector('div');
        innerDiv.style.background = '#ffd700';
        selectedButton.style.backgroundColor = '';
        selectedButton.style.color = '#000';
        this.sounds.tick.play();

        setTimeout(() => {
            innerDiv.style.background = '';
            if (selectedOption === currentQuestion.correct) {
                this.correctAnswers++;
                selectedButton.classList.add('correct');
                if (this.currentLevel !== 5 && this.currentLevel !== 10) {
                    const correctAudio = this.sounds.correctAnswerMusic;
                    correctAudio.currentTime = 0;
                    correctAudio.play().catch(() => {});
                    setTimeout(() => {
                        correctAudio.pause();
                        correctAudio.currentTime = 0;
                    }, 5000);
                }
                setTimeout(() => {
                    if (this.currentLevel === 5 || this.currentLevel === 10) {
                        setTimeout(() => {
                            const win1000 = document.getElementById('win1000Music');
                            win1000.currentTime = 0;
                            win1000.play().catch(() => {});
                            win1000.onended = () => {
                                this.currentLevel++;
                                this.updatePrize();
                                if (this.currentLevel <= this.questions.length) {
                                    this.answerButtons.forEach(button => {
                                        button.classList.remove('correct', 'wrong');
                                        button.style.backgroundColor = '';
                                        button.style.color = '';
                                        button.querySelector('div').style.background = '';
                                    });
                                    this.updateMoneyTree();
                                    this.loadQuestion();
                                } else {
                                    this.endGame(true);
                                }
                            };
                        }, 1000);
                    } else {
                        this.currentLevel++;
                        this.updatePrize();
                        if (this.currentLevel <= this.questions.length) {
                            this.answerButtons.forEach(button => {
                                button.classList.remove('correct', 'wrong');
                                button.style.backgroundColor = '';
                                button.style.color = '';
                                button.querySelector('div').style.background = '';
                            });
                            this.updateMoneyTree();
                            this.loadQuestion();
                        } else {
                            this.endGame(true);
                        }
                    }
                }, 2000);
            } else {
                this.wrongAnswers++;
                selectedButton.classList.add('wrong');
                this.sounds.suspense.pause();
                this.sounds.suspense.currentTime = 0;
                if (this.sounds.firstQuestions) {
                    this.sounds.firstQuestions.pause();
                    this.sounds.firstQuestions.currentTime = 0;
                }
                this.sounds.wrongAnswerMusic.currentTime = 0;
                this.sounds.wrongAnswerMusic.play().catch(() => {});
                setTimeout(() => {
                    this.endGame(false);
                }, 2000);
            }
        }, 3000);
    }

    updateMoneyTree() {
        this.moneyLevels.forEach(level => {
            level.classList.remove('active', 'completed');
            const levelNumber = parseInt(level.dataset.level);
            if (levelNumber === this.currentLevel) {
                level.classList.add('active');
                level.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (levelNumber < this.currentLevel) {
                level.classList.add('completed');
            }
        });
    }

    useFiftyFifty() {
        if (!this.lifelines.fifty) return;
        const currentQuestion = this.questions[this.currentLevel - 1];
        const correctOption = currentQuestion.correct;
        let wrongOptions = Object.keys(currentQuestion.options).filter(opt => opt !== correctOption);
        wrongOptions = this.shuffleArray(wrongOptions).slice(0, 2);
        wrongOptions.forEach(option => {
            const button = document.querySelector(`[data-option="${option}"]`);
            button.disabled = true;
            button.style.visibility = 'hidden';
        });
        this.lifelines.fifty = false;
        const fiftyBtn = document.getElementById('fifty');
        fiftyBtn.disabled = true;
        fiftyBtn.classList.add('lifeline-used');
    }

    useAudienceHelp() {
        if (!this.lifelines.audience) return;
        const currentQuestion = this.questions[this.currentLevel - 1];
        const correctOption = currentQuestion.correct;
        const percentages = { A: 0, B: 0, C: 0, D: 0 };
        percentages[correctOption] = Math.floor(Math.random() * 30) + 50;
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
        const audienceBtn = document.getElementById('audience');
        audienceBtn.disabled = true;
        audienceBtn.classList.add('lifeline-used');
    }

    showAudienceChart(percentages) {
        const chart = document.getElementById('audienceChart');
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
        const barElements = []; // Guardar barras para animar

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
            barDiv.className = 'audience-bar'; // Sin clase 'animate' inicialmente
            barDiv.style.setProperty('--final-height', `${percentages[option]}px`);
            barContainer.appendChild(barDiv);
            barElements.push(barDiv); // Guardar barra

            const labelDiv = document.createElement('div');
            labelDiv.className = 'audience-bar-label';
            labelDiv.textContent = option;
            barContainer.appendChild(labelDiv);
            
            barsDiv.appendChild(barContainer);
        });

        chart.style.display = 'flex';

        // Forzar reflow y añadir clase 'animate' para iniciar animación
        // Usamos requestAnimationFrame para asegurar que el navegador procese el estado inicial
        requestAnimationFrame(() => {
            setTimeout(() => { // Pequeño timeout adicional por si acaso
                 barElements.forEach(bar => bar.classList.add('animate'));
            }, 20);
        });
       
        setTimeout(() => {
            valueElements.forEach(el => el.style.opacity = '1');
        }, 5000);
    }

    usePhoneFriend() {
        if (!this.lifelines.phone) return;

        // 1. Desactivar botón inmediatamente
        this.lifelines.phone = false;
        const phoneBtn = document.getElementById('phone');
        phoneBtn.disabled = true;
        phoneBtn.classList.add('lifeline-used');

        // 2. Cancelar habla anterior
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        // Opcional: Detener música de suspense si estaba sonando
        this.sounds.suspense.pause();
        this.sounds.suspense.currentTime = 0;
        if (this.sounds.firstQuestions) {
            this.sounds.firstQuestions.pause();
            this.sounds.firstQuestions.currentTime = 0;
        }

        // 3. Reproducir sonido de llamada
        this.sounds.phoneCall.currentTime = 0; // Reiniciar por si acaso
        this.sounds.phoneCall.play().catch(e => console.error("Error al reproducir sonido de llamada:", e));

        // 4. Esperar 3 segundos
        setTimeout(() => {
            // 5. Detener sonido de llamada (si sigue sonando)
            this.sounds.phoneCall.pause();

            // --- Lógica de respuesta diferida ---
            const phoneMessageDiv = this.phoneMessageContainer;
            const currentQuestion = this.questions[this.currentLevel - 1];
            const correctOption = currentQuestion.correct;
            const confidence = Math.random();
            let message;
            let textToSpeak;
            
            // *** MOVER LA DEFINICIÓN DE unsurePhrases AQUÍ DENTRO ***
            const unsurePhrases = [
                // Originales + Primeras 30 nuevas
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
                // Segundo lote de 30 nuevas
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
                "Me la juego: ¡La C! Si fallo, mala suerte.",
                "¿Y si llamas a tu madre? Las madres lo saben todo. Yo, mientras, digo la D.",
                "Creo que la respuesta correcta es... ¡seguir tu instinto! El mío no funciona hoy."
            ]; 

            if (confidence > 0.7) {
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
                // Verificar si unsurePhrases es accesible (ahora debería serlo)
                if (typeof unsurePhrases !== 'undefined' && Array.isArray(unsurePhrases) && unsurePhrases.length > 0) {
                     const phrase = unsurePhrases[Math.floor(Math.random() * unsurePhrases.length)];
                     textToSpeak = phrase;
                     message = `📞 Amigo: ${phrase}`;
                } else { // Fallback por si algo falla
                    console.error("¡Fallo al acceder a unsurePhrases dentro del timeout!");
                    textToSpeak = "Mmm, tengo problemas para pensar ahora mismo.";
                    message = `📞 Amigo: ${textToSpeak}`;
                }
            }

            // Logs para depuración
            console.log("[setTimeout callback] Mensaje a mostrar:", message);
            console.log("[setTimeout callback] Texto a hablar:", textToSpeak);

            // 6. Mostrar mensaje en el div
            if (message !== undefined) {
                 phoneMessageDiv.innerHTML = message;
                 phoneMessageDiv.style.display = 'block';
                 setTimeout(() => phoneMessageDiv.classList.add('visible'), 10);
            } else {
                console.error("¡El mensaje a mostrar es undefined!");
            }

            // 7. Atenuar música y hablar
            if (textToSpeak !== undefined) {
                const originalVolume = this.sounds.background.volume;
                if (!this.sounds.background.paused) { 
                     this.sounds.background.volume = Math.max(0, originalVolume - 0.7);
                }
                
                const restoreVolumeCallback = () => {
                     console.log("Restaurando volumen original...");
                     if (!this.sounds.background.paused) { 
                        this.sounds.background.volume = originalVolume;
                     }
                };

                this.speakText(textToSpeak, restoreVolumeCallback);
            } else {
                 console.error("¡El texto a hablar es undefined!");
            }

            // 8. Ocultar mensaje después de un tiempo
            setTimeout(() => {
                phoneMessageDiv.classList.remove('visible');
                 setTimeout(() => phoneMessageDiv.style.display = 'none', 500);
            }, 9000); // Mensaje visible por 9 segundos DESPUÉS de la espera

        }, 3000); // 3 segundos de espera
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    updatePrize() {
        const prizeLevels = {
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
        this.currentPrize = prizeLevels[this.currentLevel] || 0;
    }

    endGame(isWin) {
        const gameResult = {
            correctAnswers: this.correctAnswers,
            wrongAnswers: this.wrongAnswers,
            prize: isWin ? this.currentPrize : 0,
            highestLevelReached: this.currentLevel
        };
        
        this.userManager.updateStats(gameResult);
        
        if (isWin) {
            alert('¡Felicidades! ¡Has ganado!');
        } else {
            alert('¡Juego terminado! Respuesta incorrecta.');
        }
        
        this.resetGame();
    }

    resetGame() {
        this.currentLevel = 1;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.currentPrize = 0;
        this.lifelines = {
            fifty: true,
            audience: true,
            phone: true
        };

        this.lifelineButtons.forEach(button => {
            button.disabled = false;
            button.classList.remove('lifeline-used');
        });

        this.answerButtons.forEach(button => {
            button.style.visibility = 'visible';
            button.style.backgroundColor = '';
            button.style.color = '';
            button.classList.remove('correct', 'wrong');
        });

        this.questions = this.shuffleArray([...this.questions]);
        this.updateMoneyTree();
        this.loadQuestion();
    }

    // --- Speech Synthesis Methods ---
    loadVoices() {
        this.voices = this.synth.getVoices();
        // Log ALL available voices for debugging
        console.log("Available voices:", this.voices); 

        // Intentar encontrar una voz masculina en español (puede fallar)
        this.selectedSpanishVoice = this.voices.find(voice => voice.lang === 'es-ES' && voice.name.toLowerCase().includes('male'));
        if (!this.selectedSpanishVoice) {
            this.selectedSpanishVoice = this.voices.find(voice => voice.lang.startsWith('es-') && voice.name.toLowerCase().includes('male'));
        }
        if (!this.selectedSpanishVoice) {
             this.selectedSpanishVoice = this.voices.find(voice => voice.lang === 'es-ES');
        }
        if (!this.selectedSpanishVoice) {
            this.selectedSpanishVoice = this.voices.find(voice => voice.lang.startsWith('es-'));
        }
        console.log("Voz española seleccionada:", this.selectedSpanishVoice ? this.selectedSpanishVoice.name : "(Voz por defecto)");
    }

    // Modificado para aceptar un callback opcional
    speakText(text, onEndCallback = null) { 
        if (this.synth.speaking) {
            console.warn('SpeechSynthesis ya estaba hablando. Cancelando y reintentando.');
            this.synth.cancel();
            // Esperar un poco antes de intentar hablar de nuevo
            setTimeout(() => this.speakTextInternal(text, onEndCallback), 150); 
            return;
        }
        this.speakTextInternal(text, onEndCallback);
    }

    // Modificado para aceptar y usar el callback
    speakTextInternal(text, onEndCallback) {
        const cleanText = text.replace(/<[^>]*>/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        utterance.onend = () => {
            console.log("SpeechSynthesisUtterance.onend");
            if (onEndCallback) {
                onEndCallback(); // Ejecutar el callback si existe
            }
        };
        utterance.onerror = (event) => {
            console.error(`SpeechSynthesisUtterance.onerror: ${event.error}`);
            // Asegurarse de ejecutar el callback incluso si hay error, para restaurar volumen
            if (onEndCallback) {
                onEndCallback(); 
            }
        };

        if (this.selectedSpanishVoice) {
            utterance.voice = this.selectedSpanishVoice;
        } else {
            utterance.lang = 'es-ES'; 
        }
        
        // --- Ajustes de Voz ---
        utterance.rate = 0.8; // <-- Más lento
        // utterance.pitch = 1; 
        // utterance.volume = 1;

        if (this.voices.length === 0) {
             this.loadVoices(); 
        }

        console.log("Intentando hablar:", cleanText);
        // Pequeño delay antes de hablar puede ayudar en algunos navegadores
        setTimeout(() => { 
             this.synth.speak(utterance);
        }, 50);
    }
    // --- End Speech Synthesis Methods ---
}

// Añadir animaciones CSS
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.textContent = `
@keyframes moveLight {
    0% { transform: translateY(-100%) rotate(15deg); opacity: 0; }
    20% { opacity: 0.5; }
    80% { opacity: 0.5; }
    100% { transform: translateY(100%) rotate(15deg); opacity: 0; }
}

@keyframes pulse {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
}
`;
document.head.appendChild(styleSheet);

// Iniciar el juego cuando se carga la página
window.addEventListener('load', () => {
    new MillionaireGame();
}); 
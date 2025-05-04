class MillionaireGame {
    constructor() {
        this.userManager = new UserManager();
        this.currentLevel = 1;
        this.timeLeft = 30;
        this.timerInterval = null;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.currentPrize = 0;
        this.questions = [
            {
                question: "En New World, ¿qué arma legendaria es conocida como 'Sed insaciable'?",
                options: {
                    A: "Hacha",
                    B: "Espada",
                    C: "Arco",
                    D: "Bastón"
                },
                correct: "B"
            },
            {
                question: "¿Qué tipo de armadura es 'Abrigo ágil' en New World?",
                options: {
                    A: "Armadura ligera",
                    B: "Armadura pesada",
                    C: "Armadura media",
                    D: "Armadura de placa"
                },
                correct: "A"
            },
            {
                question: "¿Qué elemento de New World es conocido como 'Banda elemental'?",
                options: {
                    A: "Un arma",
                    B: "Un amuleto",
                    C: "Una armadura",
                    D: "Un anillo"
                },
                correct: "D"
            },
            {
                question: "¿Qué tipo de arma es 'Serenidad' en New World?",
                options: {
                    A: "Arco",
                    B: "Hacha",
                    C: "Bastón de vida",
                    D: "Espada"
                },
                correct: "C"
            },
            {
                question: "¿Cuál es el nombre de la daga legendaria en New World?",
                options: {
                    A: "Acónito",
                    B: "Puntilla",
                    C: "Ponzoña",
                    D: "Pecado"
                },
                correct: "B"
            },
            {
                question: "¿Qué objeto en New World es conocido como 'Bebesangre'?",
                options: {
                    A: "Una espada vampírica",
                    B: "Un hacha",
                    C: "Una poción",
                    D: "Un arco"
                },
                correct: "A"
            },
            {
                question: "¿Qué arma legendaria lleva el nombre 'Pecado' en New World?",
                options: {
                    A: "Martillo",
                    B: "Hacha a dos manos",
                    C: "Estoque",
                    D: "Manopla"
                },
                correct: "C"
            },
            {
                question: "¿Qué tipo de objeto es 'Acónito' en New World?",
                options: {
                    A: "Una poción",
                    B: "Un arma",
                    C: "Un recurso venenoso",
                    D: "Una armadura"
                },
                correct: "B"
            },
            {
                question: "¿Cuál de estas armas de New World está asociada con el elemento hielo?",
                options: {
                    A: "Infierno",
                    B: "Congelación",
                    C: "Pestilencia",
                    D: "Abismo"
                },
                correct: "B"
            },
            {
                question: "¿Qué pieza de armadura son las 'Calzas de cuero armónicas'?",
                options: {
                    A: "Guantes",
                    B: "Botas",
                    C: "Pantalones",
                    D: "Casco"
                },
                correct: "C"
            },
            {
                question: "¿Qué tipo de arma es 'Carnicera' en New World?",
                options: {
                    A: "Hacha",
                    B: "Espada grande",
                    C: "Mazo",
                    D: "Daga"
                },
                correct: "A"
            },
            {
                question: "¿Para qué se utiliza principalmente la 'Piedra de poder' en New World?",
                options: {
                    A: "Para mejorar armas",
                    B: "Para activar portales",
                    C: "Para crear pociones",
                    D: "Para aumentar habilidades"
                },
                correct: "A"
            },
            {
                question: "¿Qué arma especial es 'Chispa de Mjölnir' en New World?",
                options: {
                    A: "Un bastón de fuego",
                    B: "Un mazo eléctrico",
                    C: "Una espada legendaria",
                    D: "Un guantelete"
                },
                correct: "B"
            },
            {
                question: "¿Qué tipo de armadura son los 'Zapatos de cuero alados'?",
                options: {
                    A: "Armadura ligera",
                    B: "Armadura media",
                    C: "Armadura pesada",
                    D: "Armadura de tela"
                },
                correct: "A"
            },
            {
                question: "¿Qué evento en New World incluye al enemigo 'Turkulon'?",
                options: {
                    A: "Winter Convergence",
                    B: "Turkey Terror",
                    C: "Nightveil Hallow",
                    D: "Summer Medleyfaire"
                },
                correct: "B"
            },
            {
                question: "¿Qué tipo de instancia es 'Hive of Gorgons' en New World?",
                options: {
                    A: "Expedición",
                    B: "Evento PvP",
                    C: "Raid",
                    D: "Arena"
                },
                correct: "C"
            },
            {
                question: "¿Qué arma mitológica es la 'Francisca de Freya' en New World?",
                options: {
                    A: "Una espada",
                    B: "Un hacha arrojadiza",
                    C: "Un arco",
                    D: "Un bastón mágico"
                },
                correct: "B"
            },
            {
                question: "¿Qué tipo de arma es 'Ira de la Tempestad' en New World?",
                options: {
                    A: "Bastón de fuego",
                    B: "Arco",
                    C: "Bastón de hielo",
                    D: "Guantelete de relámpago"
                },
                correct: "D"
            },
            {
                question: "¿Qué jefe principal aparece durante el evento 'Nightveil Hallow' en New World?",
                options: {
                    A: "Turkulon",
                    B: "Baalphazu",
                    C: "Isabella",
                    D: "Thorpe"
                },
                correct: "B"
            },
            {
                question: "¿Qué tipo de instancia es 'Winter Rune Forge' en New World?",
                options: {
                    A: "Una expedición de 5 jugadores",
                    B: "Una raid de 20 jugadores",
                    C: "Una prueba para 10 jugadores",
                    D: "Un evento de temporada"
                },
                correct: "C"
            },
            // Nuevas preguntas sobre Hive of Gorgons basadas en la guía
            {
                question: "¿Quién es el jefe final en la raid 'Hive of Gorgons'?",
                options: {
                    A: "Echidna",
                    B: "Typhon",
                    C: "Broodmother Medusa",
                    D: "Gorgon Queen"
                },
                correct: "C"
            },
            {
                question: "¿Qué debuff puede causar que un jugador se quede dormido en la pelea contra Broodmother Medusa?",
                options: {
                    A: "Envenenamiento",
                    B: "Petrificación",
                    C: "Sueño",
                    D: "Miedo"
                },
                correct: "C"
            },
            {
                question: "¿Qué tipo de daño es predominante en la pelea contra Broodmother Medusa?",
                options: {
                    A: "Fuego",
                    B: "Hielo",
                    C: "Naturaleza",
                    D: "Arcano"
                },
                correct: "C"
            },
            {
                question: "¿Qué debe usar el grupo para limpiar los volcanes de veneno en la pelea contra Broodmother Medusa?",
                options: {
                    A: "Orbes de fuego",
                    B: "Orbes de agua purificadora",
                    C: "Orbes de hielo",
                    D: "Orbes de luz"
                },
                correct: "B"
            },
            {
                question: "¿Qué puzzle hay que resolver antes de llegar al segundo jefe en Hive of Gorgons?",
                options: {
                    A: "Puzzle de Medusa",
                    B: "Puzzle del laberinto",
                    C: "Puzzle de las estatuas",
                    D: "Puzzle de las palancas"
                },
                correct: "A"
            },
            {
                question: "¿Qué enemigos invoca Typhon durante su pelea?",
                options: {
                    A: "Arañas y serpientes",
                    B: "Gorgones y basiliscos",
                    C: "Córvidos y lobos",
                    D: "Grifos y quimeras"
                },
                correct: "C"
            },
            {
                question: "¿Qué sucede en la tercera fase de la pelea contra Typhon?",
                options: {
                    A: "Solo hay 2 pilares disponibles",
                    B: "No hay pilares disponibles",
                    C: "El jefe gana inmunidad a daño físico",
                    D: "El jefe clona a 4 jugadores"
                },
                correct: "A"
            },
            {
                question: "¿Qué funcionalidad tienen los pilares en la pelea contra Typhon?",
                options: {
                    A: "Absorben daño",
                    B: "Dan buff de daño",
                    C: "Sirven para bloquear la habilidad 'Charge'",
                    D: "Curan al grupo"
                },
                correct: "C"
            },
            {
                question: "¿Qué elemento de la pelea contra Broodmother Medusa debe ser destruido por DPS a distancia?",
                options: {
                    A: "Flores",
                    B: "Huevos",
                    C: "Estatuas",
                    D: "Cristales"
                },
                correct: "A"
            },
            {
                question: "¿Qué puzzle hay que resolver después de derrotar a Typhon?",
                options: {
                    A: "Puzzle de las estatuas",
                    B: "Puzzle de purificación",
                    C: "Puzzle del laberinto",
                    D: "Puzzle de los espejos"
                },
                correct: "B"
            },
            // Nuevas preguntas basadas en los artefactos de es.nwdb.info
            {
                question: "¿De qué tipo de armadura es el 'Toque fantasmal' en New World?",
                options: {
                    A: "Armadura ligera",
                    B: "Armadura media",
                    C: "Armadura pesada",
                    D: "Armadura de placa"
                },
                correct: "B"
            },
            {
                question: "¿Qué característica tiene el arma artefacto 'Pecado' en New World?",
                options: {
                    A: "Causa sangrado al golpe crítico",
                    B: "Reduce el tiempo de recarga de habilidades",
                    C: "Aumenta el daño básico",
                    D: "Causa daño de hielo"
                },
                correct: "A"
            },
            {
                question: "¿Qué pieza de armadura de New World se conoce como 'Corazón de hierro'?",
                options: {
                    A: "Peto",
                    B: "Guantes",
                    C: "Pantalones",
                    D: "Casco"
                },
                correct: "C"
            },
            {
                question: "¿Qué arma se conoce como 'Metralla' en New World?",
                options: {
                    A: "Rifle",
                    B: "Escopeta",
                    C: "Mosquete",
                    D: "Pistola"
                },
                correct: "C"
            },
            {
                question: "¿Qué tipo de arma es 'Trsna' en New World?",
                options: {
                    A: "Espada a dos manos",
                    B: "Martillo de guerra",
                    C: "Hacha grande",
                    D: "Lanza"
                },
                correct: "B"
            },
            {
                question: "¿Qué pieza de armadura ligera es la 'Cogulla de poder'?",
                options: {
                    A: "Casco",
                    B: "Guantes",
                    C: "Peto",
                    D: "Botas"
                },
                correct: "A"
            },
            {
                question: "¿De qué material están hechos los 'Conductores de Azoth'?",
                options: {
                    A: "Cuero",
                    B: "Metal",
                    C: "Tela",
                    D: "Piedra"
                },
                correct: "A"
            },
            {
                question: "¿Qué pieza de armadura es 'Cólera de la naturaleza'?",
                options: {
                    A: "Guantes",
                    B: "Peto",
                    C: "Pantalones",
                    D: "Botas"
                },
                correct: "B"
            },
            {
                question: "¿Qué tipo de armadura son las 'Botas del credo'?",
                options: {
                    A: "Armadura ligera",
                    B: "Armadura media",
                    C: "Armadura pesada",
                    D: "Armadura de placa"
                },
                correct: "A"
            },
            {
                question: "¿Qué característica tiene el arma artefacto 'Ira de la Tempestad'?",
                options: {
                    A: "Reducción del tiempo de enfriamiento de habilidades",
                    B: "Mejora la habilidad Torbellino",
                    C: "Cura al usuario cuando causa daño",
                    D: "Aumenta el daño de ataque pesado"
                },
                correct: "B"
            },
            {
                question: "¿Qué material principal compone las 'Manoplas de gravedad de Gilli'?",
                options: {
                    A: "Tela",
                    B: "Cuero",
                    C: "Metal",
                    D: "Madera"
                },
                correct: "C"
            },
            {
                question: "¿Qué artefacto de New World puede ser fabricado con la receta 'Doubloon Apex Artifact'?",
                options: {
                    A: "Toque fantasmal",
                    B: "Abrigo de superviviente",
                    C: "Conductores de Azoth",
                    D: "Botas del credo"
                },
                correct: "B"
            },
            {
                question: "¿Qué tipo de armadura es el 'Abrigo de superviviente'?",
                options: {
                    A: "Armadura ligera",
                    B: "Armadura media",
                    C: "Armadura pesada",
                    D: "Armadura de tela"
                },
                correct: "C"
            },
            {
                question: "¿Qué característica tiene el artefacto 'Acónito' en New World?",
                options: {
                    A: "Aumenta el daño básico",
                    B: "Reduce el tiempo de enfriamiento de habilidades",
                    C: "Causa sangrado en golpes críticos",
                    D: "Aumenta la precisión"
                },
                correct: "A"
            },
            {
                question: "¿Qué receta se necesita para fabricar el 'Toque fantasmal'?",
                options: {
                    A: "Doubloon Apex Artifact",
                    B: "Doubloon Antique Artifact",
                    C: "Ancient Recipe Scroll",
                    D: "Phantom Touch Pattern"
                },
                correct: "B"
            },
            {
                question: "¿Cuál es la rareza de los objetos artefacto en New World?",
                options: {
                    A: "Legendario",
                    B: "Mítico",
                    C: "Épico",
                    D: "Artefacto"
                },
                correct: "D"
            },
            {
                question: "¿Qué nivel de equipo (GS) tienen los artefactos en New World?",
                options: {
                    A: "600-625",
                    B: "650-675",
                    C: "700-700",
                    D: "625-650"
                },
                correct: "C"
            },
            {
                question: "¿Cuántas ranuras para gemas tienen generalmente los artefactos de New World?",
                options: {
                    A: "Ninguna",
                    B: "Una",
                    C: "Dos",
                    D: "Tres"
                },
                correct: "B"
            },
            {
                question: "¿En qué nivel (tier) se clasifican los artefactos de New World?",
                options: {
                    A: "Tier III",
                    B: "Tier IV",
                    C: "Tier V",
                    D: "Tier VI"
                },
                correct: "C"
            },
            {
                question: "¿Qué tipo de propiedad suelen tener los artefactos de armadura en New World?",
                options: {
                    A: "Defensa básica",
                    B: "Resistencia elemental",
                    C: "Velocidad de movimiento",
                    D: "Reducción de peso"
                },
                correct: "A"
            },
            // Nuevas preguntas basadas en los atributos de es.nwdb.info
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del caballero'?",
                options: {
                    A: "Constitución y fuerza",
                    B: "Fuerza y destreza",
                    C: "Inteligencia y constitución",
                    D: "Concentración y fuerza"
                },
                correct: "A"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del luchador'?",
                options: {
                    A: "Constitución y destreza",
                    B: "Fuerza y destreza",
                    C: "Inteligencia y fuerza",
                    D: "Concentración y constitución"
                },
                correct: "B"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del druida'?",
                options: {
                    A: "Fuerza y inteligencia",
                    B: "Concentración y destreza",
                    C: "Constitución e inteligencia",
                    D: "Constitución y concentración"
                },
                correct: "C"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del mago'?",
                options: {
                    A: "Inteligencia y fuerza",
                    B: "Inteligencia y concentración",
                    C: "Inteligencia y destreza",
                    D: "Inteligencia y constitución"
                },
                correct: "B"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del embaucador'?",
                options: {
                    A: "Fuerza y concentración",
                    B: "Constitución y destreza",
                    C: "Inteligencia y destreza",
                    D: "Concentración y destreza"
                },
                correct: "C"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del vigilante'?",
                options: {
                    A: "Constitución y destreza",
                    B: "Fuerza y constitución",
                    C: "Inteligencia y constitución",
                    D: "Concentración y destreza"
                },
                correct: "A"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del clérigo'?",
                options: {
                    A: "Inteligencia y concentración",
                    B: "Concentración y constitución",
                    C: "Concentración y destreza",
                    D: "Concentración y fuerza"
                },
                correct: "B"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del jinete'?",
                options: {
                    A: "Fuerza y concentración",
                    B: "Destreza y concentración",
                    C: "Destreza y fuerza",
                    D: "Destreza y constitución"
                },
                correct: "C"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del taumaturgo'?",
                options: {
                    A: "Fuerza e inteligencia",
                    B: "Inteligencia y concentración",
                    C: "Inteligencia y constitución",
                    D: "Fuerza y concentración"
                },
                correct: "A"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del duelista'?",
                options: {
                    A: "Fuerza y destreza",
                    B: "Destreza y concentración",
                    C: "Destreza y constitución",
                    D: "Destreza e inteligencia"
                },
                correct: "B"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del ocultista'?",
                options: {
                    A: "Inteligencia y destreza",
                    B: "Inteligencia y concentración",
                    C: "Inteligencia y constitución",
                    D: "Inteligencia y fuerza"
                },
                correct: "C"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del sacerdote'?",
                options: {
                    A: "Fuerza y concentración",
                    B: "Concentración e inteligencia",
                    C: "Constitución y concentración",
                    D: "Destreza y concentración"
                },
                correct: "B"
            },
            {
                question: "¿Qué atributo único mejora el 'Atributo de espada y escudo del montaraz'?",
                options: {
                    A: "Destreza",
                    B: "Fuerza",
                    C: "Constitución",
                    D: "Inteligencia"
                },
                correct: "A"
            },
            {
                question: "¿Qué atributo único mejora el 'Atributo de espada y escudo del sabio'?",
                options: {
                    A: "Inteligencia",
                    B: "Concentración",
                    C: "Constitución",
                    D: "Fuerza"
                },
                correct: "B"
            },
            {
                question: "¿Qué atributo único mejora el 'Atributo de espada y escudo del erudito'?",
                options: {
                    A: "Destreza",
                    B: "Fuerza",
                    C: "Inteligencia",
                    D: "Concentración"
                },
                correct: "C"
            },
            {
                question: "¿Qué atributo único mejora el 'Atributo de espada y escudo del centinela'?",
                options: {
                    A: "Fuerza",
                    B: "Constitución",
                    C: "Inteligencia",
                    D: "Concentración"
                },
                correct: "B"
            },
            {
                question: "¿Qué atributo único mejora el 'Atributo de espada y escudo del soldado'?",
                options: {
                    A: "Fuerza",
                    B: "Destreza",
                    C: "Constitución",
                    D: "Concentración"
                },
                correct: "A"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del monje'?",
                options: {
                    A: "Constitución y concentración",
                    B: "Fuerza y concentración",
                    C: "Destreza y concentración",
                    D: "Inteligencia y concentración"
                },
                correct: "B"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del fanático'?",
                options: {
                    A: "Destreza y concentración",
                    B: "Fuerza y destreza",
                    C: "Concentración y fuerza",
                    D: "Concentración y constitución"
                },
                correct: "C"
            },
            {
                question: "¿Qué combinación de atributos mejora el 'Atributo de espada y escudo del nómada'?",
                options: {
                    A: "Constitución y fuerza",
                    B: "Constitución y destreza",
                    C: "Constitución y concentración",
                    D: "Constitución e inteligencia"
                },
                correct: "C"
            }
        ];
        
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
            phoneCall: document.getElementById('phoneCallSound')
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
                usernameModalElement.style.display = 'flex';
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
                usernameModalElement.style.display = 'none';
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
        
        // Configurar el temporizador circular con su progreso inicial
        const initialProgress = 100;
        this.timerElement.style.setProperty('--progress', `${initialProgress}%`);

        // Parar ambas músicas antes de reproducir la que toca
        this.sounds.suspense.pause();
        this.sounds.suspense.currentTime = 0;
        if (this.sounds.firstQuestions) {
            this.sounds.firstQuestions.pause();
            this.sounds.firstQuestions.currentTime = 0;
        }

        // Si estamos en las primeras 4 preguntas, suena la música especial
        if (this.currentLevel >= 1 && this.currentLevel <= 4) {
            this.sounds.firstQuestions.currentTime = 0;
            this.sounds.firstQuestions.volume = 0.5;
            this.sounds.firstQuestions.play().catch(() => {});
        } else {
            // Si no, suena la música de suspense
            this.sounds.suspense.currentTime = 0;
            this.sounds.suspense.volume = 0.5;
            this.sounds.suspense.play().catch(() => {});
        }

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft;
            
            // Actualizar el progreso del temporizador circular
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
                // Parar ambas músicas al terminar el tiempo
                this.sounds.suspense.pause();
                this.sounds.suspense.currentTime = 0;
                if (this.sounds.firstQuestions) {
                    this.sounds.firstQuestions.pause();
                    this.sounds.firstQuestions.currentTime = 0;
                }
                
                // Mantener el temporizador en 0 y el color rojo, pero no finalizar el juego
                this.timerElement.textContent = '0';
                this.timerElement.style.color = '#ff0000';
                // No se llama a handleTimeUp() para que no termine el juego
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
        this.sounds.suspense.pause();
        this.sounds.suspense.currentTime = 0;
        if (this.sounds.firstQuestions) {
            this.sounds.firstQuestions.pause();
            this.sounds.firstQuestions.currentTime = 0;
        }
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
            prize: isWin ? this.currentPrize : 0
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
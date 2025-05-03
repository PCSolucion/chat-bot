class MillionaireGame {
    constructor() {
        this.currentLevel = 1;
        this.timeLeft = 30;
        this.timerInterval = null;
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
            lifeline: document.getElementById('lifelineSound'),
            background: document.getElementById('backgroundMusic')
        };
        
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
        this.sounds.background.volume = 0.3;
        this.sounds.background.play().catch(() => {
            console.log('La reproducción automática de audio está deshabilitada');
        });
    }

    startTimer() {
        this.timeLeft = 30;
        this.timerElement.textContent = this.timeLeft;
        this.timerElement.style.color = '#fff';
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft;
            
            if (this.timeLeft <= 10) {
                this.timerElement.style.color = '#ff9900';
            }
            
            if (this.timeLeft <= 5) {
                this.timerElement.style.color = '#ff0000';
                this.sounds.tick.play();
            }

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.handleTimeUp();
            }
        }, 1000);
    }

    handleTimeUp() {
        this.answerButtons.forEach(button => {
            button.disabled = true;
        });
        
        this.sounds.wrong.play();
        setTimeout(() => {
            alert('¡Se acabó el tiempo!');
            this.resetGame();
        }, 1000);
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

        // Primero mostramos la respuesta seleccionada con efecto "pendiente"
        selectedButton.style.backgroundColor = '#ffd700';
        selectedButton.style.color = '#000';
        this.sounds.tick.play();

        // Después de una pausa, verificamos si es correcta
        setTimeout(() => {
            if (selectedOption === currentQuestion.correct) {
                selectedButton.classList.add('correct');
                this.sounds.correct.play();
                setTimeout(() => {
                    this.currentLevel++;
                    if (this.currentLevel <= this.questions.length) {
                        // Limpiar los estilos y clases antes de cargar la siguiente pregunta
                        this.answerButtons.forEach(button => {
                            button.classList.remove('correct', 'wrong');
                            button.style.backgroundColor = '';
                            button.style.color = '';
                        });
                        this.updateMoneyTree();
                        this.loadQuestion();
                    } else {
                        alert('¡Felicidades! ¡Has ganado!');
                    }
                }, 2000);
            } else {
                selectedButton.classList.add('wrong');
                this.sounds.wrong.play();
                setTimeout(() => {
                    alert('¡Juego terminado! Respuesta incorrecta.');
                    this.resetGame();
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
        
        this.sounds.lifeline.play();
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
        document.getElementById('fifty').disabled = true;
    }

    useAudienceHelp() {
        if (!this.lifelines.audience) return;
        
        this.sounds.lifeline.play();
        const currentQuestion = this.questions[this.currentLevel - 1];
        const correctOption = currentQuestion.correct;
        
        const percentages = {
            A: 0,
            B: 0,
            C: 0,
            D: 0
        };
        
        percentages[correctOption] = Math.floor(Math.random() * 30) + 50;
        const remaining = 100 - percentages[correctOption];
        
        const otherOptions = Object.keys(percentages).filter(opt => opt !== correctOption);
        otherOptions.forEach((opt, index) => {
            if (index === otherOptions.length - 1) {
                percentages[opt] = remaining;
            } else {
                const value = Math.floor(Math.random() * remaining / 2);
                percentages[opt] = value;
            }
        });

        alert(`Ayuda del público:\nA: ${percentages.A}%\nB: ${percentages.B}%\nC: ${percentages.C}%\nD: ${percentages.D}%`);
        
        this.lifelines.audience = false;
        document.getElementById('audience').disabled = true;
    }

    usePhoneFriend() {
        if (!this.lifelines.phone) return;
        
        this.sounds.lifeline.play();
        const currentQuestion = this.questions[this.currentLevel - 1];
        const correctOption = currentQuestion.correct;
        
        const confidence = Math.random();
        let message;
        
        if (confidence > 0.7) {
            message = `Estoy ${Math.floor(confidence * 100)}% seguro de que la respuesta es ${correctOption}`;
        } else {
            message = "No estoy muy seguro, pero creo que podría ser cualquiera...";
        }
        
        alert(`Tu amigo dice: "${message}"`);
        
        this.lifelines.phone = false;
        document.getElementById('phone').disabled = true;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    resetGame() {
        this.currentLevel = 1;
        this.lifelines = {
            fifty: true,
            audience: true,
            phone: true
        };
        
        this.lifelineButtons.forEach(button => {
            button.disabled = false;
        });
        
        this.answerButtons.forEach(button => {
            button.style.visibility = 'visible';
            button.style.backgroundColor = '';
            button.style.color = '';
            button.classList.remove('correct', 'wrong');
        });
        
        // Barajar las preguntas nuevamente al reiniciar
        this.questions = this.shuffleArray([...this.questions]);
        
        this.updateMoneyTree();
        this.loadQuestion();
    }
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
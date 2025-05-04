// Archivo de preguntas para el juego ¿Quién quiere ser millonario?
const questionsBase = [
    {
        question: "¿Qué habilidad de la espada potencia el artefacto La Carnicera?",
        options: {
            A: "El escudazo",
            B: "El torbellino",
            C: "Tajo Volador",
            D: "Alzamiento"
        },
        correct: "B",
        difficulty: 1,
        category: "general"
    },
    {
        question: "¿Dónde se puede conseguir el artefacto La Carnicera?",
        options: {
            A: "Dinastía",
            B: "Lázarus",
            C: "Forja Empírea",
            D: "Tempestad"
        },
        correct: "A",
        difficulty: 1,
        category: "general"
    },
    {
        question: "¿Cuál de las siguientes perks tiene el artefacto La Carnicera?",
        options: {
            A: "Sigilo",
            B: "Fortalecido con avidez",
            C: "Encantamiento",
            D: "Afilado con avidez"
        },
        correct: "D",
        difficulty: 1,
        category: "general"
    },
    {
        question: "¿Cuál es la ventaja exclusiva del artefacto Francisca Freya?",
        options: {
            A: "Añade quemadura a ambas armas",
            B: "Potencia el daño crítico",
            C: "Mejora la recarga de habilidades",
            D: "Más daño en los sangrados"
        },
        correct: "C",
        difficulty: 1,
        category: "general"
    },
    {
        question: "¿Con que perk de habilidad viene el artefacto Francisca Freya?",
        options: {
            A: "Lanzamiento infecto",
            B: "Furia",
            C: "Torrente enfurecido",
            D: "Lanzamiento desgarrador"
        },
        correct: "D",
        difficulty: 1,
        category: "general"
    },
    {
        question: "¿Dónde se puede conseguir el artefacto Francisca Freya?",
        options: {
            A: "Génesis",
            B: "Lázarus",
            C: "Eneada",
            D: "Piedraestelar"
        },
        correct: "A",
        difficulty: 2,
        category: "general"
    },
    {
        question: "¿Con que perk de habilidad viene el artefacto del martillo Chispa de Mjolnir?",
        options: {
            A: "Barrido",
            B: "Rompearmaduras",
            C: "Mazazo renovador",
            D: "Frenesí demoledor"
        },
        correct: "C",
        difficulty: 1,
        category: "general"
    },
    {
        question: "¿Qué tipo de daño hace el artefacto Gran hacha llamada Abismo?",
        options: {
            A: "Arcano",
            B: "Vacío",
            C: "Rayo",
            D: "Naturaleza"
        },
        correct: "B",
        difficulty: 1,
        category: "general"
    },
    {
        question: "¿Donde se puede conseguir el artefacto Abismo?",
        options: {
            A: "Tempestad",
            B: "Estratega Belicista",
            C: "Grietas de corrupción",
            D: "Arena PVE de Zygoramet "
        },
        correct: "C",
        difficulty: 1,
        category: "general"
    },
    {
        question: "¿Qué hace la perk exclusiva del artefacto ODO?",
        options: {
            A: "Más armadura para los aliados",
            B: "Daño adicional de naturaleza",
            C: "Más daño a objetivos derribados",
            D: "Más daño a enemigos que tengan daño con el tiempo "
        },
        correct: "C",
        difficulty: 2,
        category: "general"
    },
    {
        question: "¿Qué tipo de arma artefacto no puede dar el enemigo de Gorgona Typhon?",
        options: {
            A: "Espada",
            B: "Martillo",
            C: "Estoque",
            D: "Manopla de vacío"
        },
        correct: "B",
        difficulty: 2,
        category: "general"
    },
    {
        question: "¿Para qué se utiliza principalmente la 'Piedra de poder' en New World?",
        options: {
            A: "Aplica debilitamiento",
            B: "Aplica fortalecimiento",
            C: "Aplica fortificación",
            D: "Aplica desgarro"
        },
        correct: "A",
        difficulty: 1,
        category: "general"
    },
    {
        question: "¿Qué arma artefacto es el Acónito",
        options: {
            A: "Un báculo de fuego",
            B: "Un arco",
            C: "Un mosquete",
            D: "Un trabuco"
        },
        correct: "B",
        difficulty: 1,
        category: "general"
    },
    {
        question: "¿El artefacto manopla de hielo 'Otzi' que habilidad potencia?",
        options: {
            A: "Tumba de hielo",
            B: "Viento gélido",
            C: "Lluvia de hielo",
            D: "Tormenta de hielo"
        },
        correct: "A",
        difficulty: 2,
        category: "general"
    },
    {
        question: "¿Cuál es el alcance de los projectiles del poste de hielo?",
        options: {
            A: "10 metros",
            B: "15 metros",
            C: "20 metros",
            D: "25 metros"
        },
        correct: "C",
        difficulty: 3,
        category: "general"
    },
    {
        question: "¿Cuál de las siguientes habilidades puede aplicar desgarro?",
        options: {
            A: "Púas de hielo",
            B: "Viento gélido",
            C: "Lluvia de hielo",
            D: "Poste de hielo"
        },
        correct: "C",
        difficulty: 1,
        category: "general"
    },
    {
        question: "¿Qué tipo de daño hace la habilidad Tajo volador de la espada?",
        options: {
            A: "Corte",
            B: "Estocada",
            C: "Impacto",
            D: "Fuego"
        },
        correct: "B",
        difficulty: 1,
        category: "general"
    },
    {
        question: "¿Como se llama la habilidad pasiva de la espada que permite obtener celeridad hacer un ataque crítico?",
        options: {
            A: "Castigo célere",
            B: "Talón de Aquiles",
            C: "Oportunista",
            D: "Precisión crítica"
        },
        correct: "D",
        difficulty: 3,
        category: "general"
    },
    {
        question: "¿Qué tipo de daño tiene la habilidad Ariete?",
        options: {
            A: "Estocada",
            B: "Impacto",
            C: "Corte",
            D: "Rayo"
        },
        correct: "B",
        difficulty: 1
    },
    {
        question: "¿La habilidad Liderazgo de la espada cuanto aumenta el daño al resto del grupo?",
        options: {
            A: "Un 20%",
            B: "Un 15%",
            C: "Un 10%",
            D: "Un 5%"
        },
        correct: "C",
        difficulty: 1
    },
    {
        question: "¿En cuanto reduce el daño de los alidaos la habilidad Formación Defensiva de la espada?",
        options: {
            A: "Un 10%",
            B: "Un 20%",
            C: "Un 30%",
            D: "Un 35%"
        },
        correct: "C",
        difficulty: 2
    },
    {
        question: "El artefacto de estoque llamado Filo de Dorgort hace que...",
        options: {
            A: "Tengamos más daño con coraje",
            B: "No recibamos daño durante medio segundo al cambiar a esta arma",
            C: "Tengamos daño de fuego adicional con los ataques pesados",
            D: "Tengamos más daño con la habilidad Tondo"
        },
        correct: "C",
        difficulty: 2
    },
    {
        question: "¿Quién suelta el artefacto del estoque llamado Filo de Dorgort?",
        options: {
            A: "Crasus",
            B: "Marius",
            C: "Ifrit",
            D: "Kurok"
        },
        correct: "C",
        difficulty: 1
    },
    {
        question: "¿Dónde se puede conseguir el artefacto del mosquete llamado Metralla?",
        options: {
            A: "PVP Track",
            B: "Caja de OPR",
            C: "Raid Hatchery",
            D: "Raid Winter"
        },
        correct: "B",
        difficulty: 1
    },
    {
        question: "¿Cuál de los siguientes ingredientes forma parte de la receta de Conejo asado con verduras?",
        options: {
            A: "Coliflor",
            B: "Patatas",
            C: "Zanahorias",
            D: "Salvia"
        },
        correct: "A",
        difficulty: 2
    },
    {
        question: "¿Qué enemigos invoca Typhon durante su pelea?",
        options: {
            A: "Arañas y serpientes",
            B: "Gorgonas y basiliscos",
            C: "Córvidos y lobos",
            D: "Grifos y quimeras"
        },
        correct: "C",
        difficulty: 1
    },
    {
        question: "¿Qué sucede en la tercera fase de la pelea contra Typhon?",
        options: {
            A: "Solo hay 2 pilares disponibles",
            B: "No hay pilares disponibles",
            C: "El jefe gana inmunidad a daño físico",
            D: "El jefe clona a 4 jugadores"
        },
        correct: "A",
        difficulty: 1
    },
    {
        question: "¿Qué funcionalidad tienen los pilares en la pelea contra Typhon?",
        options: {
            A: "Absorben daño",
            B: "Dan buff de daño",
            C: "Sirven para bloquear la habilidad la carga del enemigo",
            D: "Curan al grupo"
        },
        correct: "C",
        difficulty: 1
    },
    {
        question: "¿Qué elemento de la pelea contra Matriarca Medusa debe ser destruido por DPS a distancia?",
        options: {
            A: "Flores",
            B: "Huevos",
            C: "Estatuas",
            D: "Cristales"
        },
        correct: "A",
        difficulty: 1
    },
    {
        question: "¿De qué tipo de armadura tiene el artefacto 'Toque fantasmal'?",
        options: {
            A: "Armadura ligera",
            B: "Armadura media",
            C: "Armadura pesada",
            D: "Armadura de placa"
        },
        correct: "B",
        difficulty: 2,
        category: "general"
    },
    {
        question: "¿Qué característica tiene el arma artefacto 'Pecado' en New World?",
        options: {
            A: "Los estados negativos duran más",
            B: "Reduce el tiempo de recarga de habilidades",
            C: "Aumenta el daño básico",
            D: "Causa daño de fuego"
        },
        correct: "A",
        difficulty: 1
    },
    {
        question: "¿Qué pieza de armadura es el artefacto 'Corazón de hierro'?",
        options: {
            A: "Peto",
            B: "Guantes",
            C: "Pantalones",
            D: "Casco"
        },
        correct: "C",
        difficulty: 1
    },
    {
        question: "¿Qué pieza de armadura ligera es la 'Cogulla de poder'?",
        options: {
            A: "Casco",
            B: "Guantes",
            C: "Peto",
            D: "Botas"
        },
        correct: "A",
        difficulty: 1
    },
    {
        question: "¿Qué pieza de armadura es 'Cólera de la naturaleza'?",
        options: {
            A: "Guantes",
            B: "Peto",
            C: "Pantalones",
            D: "Botas"
        },
        correct: "B",
        difficulty: 1
    },
    {
        question: "¿Qué tipo de armadura es el 'Abrigo de superviviente'?",
        options: {
            A: "Armadura ligera",
            B: "Armadura media",
            C: "Armadura pesada",
            D: "Armadura de tela"
        },
        correct: "C",
        difficulty: 1
    },
    {
        question: "¿Donde se puede conseguir el artefacto Banda Elemental?",
        options: {
            A: "Cajas de OPR",
            B: "Raid Hatchery",
            C: "Raid Gorgona",
            D: "Raid Winter"
        },
        correct: "C",
        difficulty: 1
    },
    {
        question: "¿A que tipo de daño es más débil el enemigo Matriarca Medusa?",
        options: {
            A: "Impacto",
            B: "Arcano",
            C: "Fuego",
            D: "Corte"
        },
        correct: "C",
        difficulty: 1
    }
];

// Exportar las preguntas directamente
export default questionsBase; 
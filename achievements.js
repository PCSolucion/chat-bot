class AchievementsManager {
    constructor() {
        this.achievements = {
            millionaire: {
                id: 'millionaire',
                name: '¡Millonario!',
                description: 'Gana tu primer millón',
                icon: '💰',
                condition: (stats) => stats.highestPrize >= 1000000
            },
            perfectStreak: {
                id: 'perfectStreak',
                name: 'Racha Perfecta',
                description: 'Consigue una racha de 5 juegos perfectos',
                icon: '🔥',
                condition: (stats) => stats.perfectStreaks >= 5
            },
            speedDemon: {
                id: 'speedDemon',
                name: 'Velocista',
                description: 'Responde 10 preguntas en menos de 5 segundos cada una',
                icon: '⚡',
                condition: (stats) => stats.fastAnswers >= 10
            },
            noLifelines: {
                id: 'noLifelines',
                name: 'Sin Ayuda',
                description: 'Gana una partida sin usar comodines',
                icon: '💪',
                condition: (stats) => stats.noLifelineStreaks >= 1
            },
            veteran: {
                id: 'veteran',
                name: 'Veterano',
                description: 'Juega más de 50 partidas',
                icon: '🎮',
                condition: (stats) => stats.gamesPlayed >= 50
            },
            smarty: {
                id: 'smarty',
                name: 'Sabio',
                description: 'Mantén una precisión del 90% después de 20 partidas',
                icon: '🧠',
                condition: (stats) => stats.gamesPlayed >= 20 && (stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) >= 0.9
            },
            consistent: {
                id: 'consistent',
                name: 'Consistente',
                description: 'Mantén una racha de 10 juegos',
                icon: '📈',
                condition: (stats) => stats.bestStreak >= 10
            },
            levelMaster: {
                id: 'levelMaster',
                name: 'Maestro de Nivel',
                description: 'Llega al nivel 10 en 5 partidas diferentes',
                icon: '🏆',
                condition: (stats) => stats.games ? stats.games.filter(game => game.highestLevelReached >= 10).length >= 5 : false
            },
            quickThinking: {
                id: 'quickThinking',
                name: 'Pensamiento Rápido',
                description: 'Completa un nivel en menos de 30 segundos',
                icon: '⏱️',
                condition: (stats) => stats.fastestLevel && stats.fastestLevel <= 30
            },
            legend: {
                id: 'legend',
                name: 'Leyenda',
                description: 'Consigue todos los logros anteriores',
                icon: '👑',
                condition: (stats, unlockedAchievements) => unlockedAchievements.length >= 9
            }
        };
    }

    checkAchievements(stats) {
        const unlockedAchievements = [];
        
        for (const [key, achievement] of Object.entries(this.achievements)) {
            if (achievement.condition(stats, unlockedAchievements)) {
                unlockedAchievements.push({
                    ...achievement,
                    dateUnlocked: new Date().toISOString()
                });
            }
        }
        
        return unlockedAchievements;
    }

    getAchievementProgress(stats) {
        const progress = {};
        
        for (const [key, achievement] of Object.entries(this.achievements)) {
            let progressValue = 0;
            
            switch (key) {
                case 'millionaire':
                    progressValue = (stats.highestPrize / 1000000) * 100;
                    break;
                case 'perfectStreak':
                    progressValue = (stats.perfectStreaks / 5) * 100;
                    break;
                case 'speedDemon':
                    progressValue = (stats.fastAnswers / 10) * 100;
                    break;
                case 'noLifelines':
                    progressValue = stats.noLifelineStreaks >= 1 ? 100 : 0;
                    break;
                case 'veteran':
                    progressValue = (stats.gamesPlayed / 50) * 100;
                    break;
                case 'smarty':
                    if (stats.gamesPlayed >= 20) {
                        const accuracy = stats.totalCorrect / (stats.totalCorrect + stats.totalWrong);
                        progressValue = (accuracy / 0.9) * 100;
                    } else {
                        progressValue = (stats.gamesPlayed / 20) * 50;
                    }
                    break;
                case 'consistent':
                    progressValue = (stats.bestStreak / 10) * 100;
                    break;
                case 'levelMaster':
                    const level10Games = stats.games ? stats.games.filter(game => game.highestLevelReached >= 10).length : 0;
                    progressValue = (level10Games / 5) * 100;
                    break;
                case 'quickThinking':
                    if (stats.fastestLevel) {
                        progressValue = stats.fastestLevel <= 30 ? 100 : ((60 - stats.fastestLevel) / 30) * 100;
                    }
                    break;
                case 'legend':
                    const unlockedCount = this.checkAchievements(stats).length;
                    progressValue = (unlockedCount / 9) * 100;
                    break;
            }
            
            progress[key] = Math.min(Math.max(progressValue, 0), 100);
        }
        
        return progress;
    }
}

export default AchievementsManager; 
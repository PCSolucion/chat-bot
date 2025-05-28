export class UserManager {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = null;
    }

    loadUsers() {
        const usersData = localStorage.getItem('users');
        return usersData ? JSON.parse(usersData) : {};
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    getAllUsers() {
        return Object.keys(this.users);
    }

    getStats(username) {
        return this.users[username] || null;
    }

    updateStats(username, gameResult) {
        if (!this.users[username]) {
            this.users[username] = {
                gamesPlayed: 0,
                totalCorrect: 0,
                totalWrong: 0,
                highestPrize: 0,
                lastGame: null,
                games: [],
                lifelines: {},
                totalTime: 0,
                fastestAnswer: null,
                fastestLevel: null,
                gamesWithoutTimer: 0,
                currentStreak: 0,
                bestStreak: 0,
                perfectStreaks: 0,
                noLifelineStreaks: 0,
                totalStreaks: 0
            };
        }

        const user = this.users[username];
        user.gamesPlayed++;
        user.totalCorrect += gameResult.correctAnswers;
        user.totalWrong += gameResult.wrongAnswers;

        // Actualizar premio más alto
        if (gameResult.prize > user.highestPrize) {
            user.highestPrize = gameResult.prize;
        }

        // Actualizar última partida
        user.lastGame = {
            date: gameResult.date || new Date().toISOString(),
            prize: gameResult.prize,
            correctAnswers: gameResult.correctAnswers,
            wrongAnswers: gameResult.wrongAnswers,
            highestLevelReached: gameResult.highestLevelReached || 0
        };

        // Actualizar historial de partidas
        user.games.push(user.lastGame);

        // Actualizar estadísticas de comodines
        if (gameResult.lifelines) {
            user.lifelines = user.lifelines || {};
            Object.entries(gameResult.lifelines).forEach(([lifeline, used]) => {
                user.lifelines[lifeline] = (user.lifelines[lifeline] || 0) + (used ? 1 : 0);
            });
        }

        // Actualizar estadísticas de tiempo
        if (gameResult.timePerQuestion) {
            const totalTime = gameResult.timePerQuestion.reduce((a, b) => a + b, 0);
            user.totalTime = (user.totalTime || 0) + totalTime;
            
            const fastestTime = Math.min(...gameResult.timePerQuestion);
            if (!user.fastestAnswer || fastestTime < user.fastestAnswer) {
                user.fastestAnswer = fastestTime;
                user.fastestLevel = gameResult.highestLevelReached;
            }
        }

        // Actualizar estadísticas de rachas
        if (gameResult.correctAnswers > 0 && gameResult.wrongAnswers === 0) {
            user.currentStreak++;
            if (user.currentStreak > user.bestStreak) {
                user.bestStreak = user.currentStreak;
            }
            if (gameResult.prize === gameResult.maxPossiblePrize) {
                user.perfectStreaks++;
            }
            if (!Object.values(gameResult.lifelines || {}).some(used => used)) {
                user.noLifelineStreaks++;
            }
            user.totalStreaks++;
        } else {
            user.currentStreak = 0;
        }

        // Guardar cambios
        this.saveUsers();
    }

    resetUserStats(username) {
        if (this.users[username]) {
            this.users[username] = {
                gamesPlayed: 0,
                totalCorrect: 0,
                totalWrong: 0,
                highestPrize: 0,
                lastGame: null,
                games: [],
                lifelines: {},
                totalTime: 0,
                fastestAnswer: null,
                fastestLevel: null,
                gamesWithoutTimer: 0,
                currentStreak: 0,
                bestStreak: 0,
                perfectStreaks: 0,
                noLifelineStreaks: 0,
                totalStreaks: 0
            };
            this.saveUsers();
            return true;
        }
        return false;
    }
} 
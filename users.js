class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('millionaireUsers')) || {};
        this.currentUser = null;
    }

    saveUsers() {
        localStorage.setItem('millionaireUsers', JSON.stringify(this.users));
    }

    createUser(username) {
        if (!this.users[username]) {
            this.users[username] = {
                gamesPlayed: 0,
                totalCorrect: 0,
                totalWrong: 0,
                highestPrize: 0,
                lastGame: null,
                games: []
            };
            this.saveUsers();
        }
        this.currentUser = username;
        return this.users[username];
    }

    createGuestUser() {
        const guestId = 'guest_' + Date.now();
        this.createUser(guestId);
        return guestId;
    }

    updateStats(gameResult) {
        if (!this.currentUser || !this.users[this.currentUser]) return;

        const user = this.users[this.currentUser];
        user.gamesPlayed++;
        user.totalCorrect += gameResult.correctAnswers;
        user.totalWrong += gameResult.wrongAnswers;
        
        if (gameResult.highestLevelReached > 0) {
            const prizeLevels = {
                1: 100, 2: 250, 3: 500, 4: 750, 5: 1500,
                6: 2500, 7: 5000, 8: 10000, 9: 15000, 10: 20000,
                11: 30000, 12: 50000, 13: 100000, 14: 300000, 15: 1000000
            };
            
            const highestPrizeReached = prizeLevels[gameResult.highestLevelReached] || 0;
            
            if (highestPrizeReached > user.highestPrize) {
                user.highestPrize = highestPrizeReached;
            }
        } else if (gameResult.prize > user.highestPrize) {
            user.highestPrize = gameResult.prize;
        }

        user.lastGame = {
            date: new Date().toISOString(),
            prize: gameResult.prize,
            correctAnswers: gameResult.correctAnswers,
            wrongAnswers: gameResult.wrongAnswers,
            highestLevelReached: gameResult.highestLevelReached || 0
        };

        user.games.push(user.lastGame);
        this.saveUsers();
        
        console.log("Estadísticas actualizadas:", {
            usuario: this.currentUser,
            partidasJugadas: user.gamesPlayed,
            respuestasCorrectas: user.totalCorrect,
            respuestasIncorrectas: user.totalWrong,
            premioMásAlto: user.highestPrize,
            precisión: user.totalCorrect > 0 ? 
                ((user.totalCorrect / (user.totalCorrect + user.totalWrong)) * 100).toFixed(1) + "%" : 
                "0%"
        });
    }

    getStats(username) {
        return this.users[username] || null;
    }

    getAllUsers() {
        return Object.keys(this.users).filter(username => !username.startsWith('guest_'));
    }

    getCurrentUser() {
        return this.currentUser;
    }

    resetUserStats(username) {
        if (this.users[username]) {
            // Mantener el username pero reiniciar todas las estadísticas
            this.users[username] = {
                gamesPlayed: 0,
                totalCorrect: 0,
                totalWrong: 0,
                highestPrize: 0,
                lastGame: null,
                games: []
            };
            this.saveUsers();
            return true;
        }
        return false;
    }
}

// Exportar la clase para poder importarla en otros archivos
export default UserManager; 
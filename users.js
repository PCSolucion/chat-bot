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
        
        if (gameResult.prize > user.highestPrize) {
            user.highestPrize = gameResult.prize;
        }

        user.lastGame = {
            date: new Date().toISOString(),
            prize: gameResult.prize,
            correctAnswers: gameResult.correctAnswers,
            wrongAnswers: gameResult.wrongAnswers
        };

        user.games.push(user.lastGame);
        this.saveUsers();
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
}

// Exportar la clase para poder importarla en otros archivos
export default UserManager; 
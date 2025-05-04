class StatsManager {
    constructor() {
        this.userManager = new UserManager();
        this.currentUser = null;
        this.initializeStats();
    }

    initializeStats() {
        this.loadUsersList();
        this.setupEventListeners();
        this.updateGlobalStats();
    }

    loadUsersList() {
        const usersList = document.getElementById('usersList');
        const users = this.userManager.getAllUsers();
        
        usersList.innerHTML = users.map(username => `
            <div class="user-item" data-username="${username}">
                ${username}
            </div>
        `).join('');

        if (users.length > 0) {
            this.selectUser(users[0]);
        }
    }

    setupEventListeners() {
        document.getElementById('userSearch').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const userItems = document.querySelectorAll('.user-item');
            
            userItems.forEach(item => {
                const username = item.dataset.username.toLowerCase();
                item.style.display = username.includes(searchTerm) ? 'block' : 'none';
            });
        });

        document.getElementById('usersList').addEventListener('click', (e) => {
            const userItem = e.target.closest('.user-item');
            if (userItem) {
                this.selectUser(userItem.dataset.username);
            }
        });
    }

    selectUser(username) {
        this.currentUser = username;
        document.querySelectorAll('.user-item').forEach(item => {
            item.classList.toggle('active', item.dataset.username === username);
        });
        this.updateUserStats(username);
    }

    updateGlobalStats() {
        const users = this.userManager.getAllUsers();
        const allStats = users.map(username => this.userManager.getStats(username));
        
        const totalGames = allStats.reduce((sum, stats) => sum + stats.gamesPlayed, 0);
        const totalPlayers = users.length;
        const highestPrize = Math.max(...allStats.map(stats => stats.highestPrize));

        document.getElementById('totalGames').textContent = totalGames;
        document.getElementById('totalPlayers').textContent = totalPlayers;
        document.getElementById('highestPrize').textContent = `${highestPrize.toLocaleString()} €`;

        this.updateGlobalAccuracy(allStats);
        this.updatePrizeDistribution(allStats);
    }

    updateGlobalAccuracy(allStats) {
        const totalCorrect = allStats.reduce((sum, stats) => sum + stats.totalCorrect, 0);
        const totalWrong = allStats.reduce((sum, stats) => sum + stats.totalWrong, 0);
        const accuracy = totalCorrect + totalWrong > 0 
            ? ((totalCorrect / (totalCorrect + totalWrong)) * 100).toFixed(1)
            : 0;

        document.getElementById('globalAccuracy').textContent = `${accuracy}%`;
    }

    updatePrizeDistribution(allStats) {
        const prizeDistribution = {
            '0-1000': 0,
            '1001-10000': 0,
            '10001-50000': 0,
            '50001-100000': 0,
            '100001+': 0
        };

        allStats.forEach(stats => {
            const prize = stats.highestPrize;
            if (prize <= 1000) prizeDistribution['0-1000']++;
            else if (prize <= 10000) prizeDistribution['1001-10000']++;
            else if (prize <= 50000) prizeDistribution['10001-50000']++;
            else if (prize <= 100000) prizeDistribution['50001-100000']++;
            else prizeDistribution['100001+']++;
        });

        // Aquí podrías implementar un gráfico con Chart.js o similar
    }

    updateUserStats(username) {
        const stats = this.userManager.getStats(username);
        if (!stats) return;

        const gamesHistory = document.getElementById('gamesHistory');
        gamesHistory.innerHTML = stats.games.map(game => `
            <div class="game-item">
                <div class="game-date">${new Date(game.date).toLocaleDateString()}</div>
                <div class="game-details">
                    <span>Correctas: ${game.correctAnswers}</span>
                    <span>Incorrectas: ${game.wrongAnswers}</span>
                </div>
                <div class="game-prize">${game.prize.toLocaleString()} €</div>
            </div>
        `).join('');

        // Actualizar otras estadísticas específicas del usuario
        this.updateUserAccuracy(stats);
        this.updateUserPrizeHistory(stats);
    }

    updateUserAccuracy(stats) {
        const accuracy = stats.totalCorrect + stats.totalWrong > 0 
            ? ((stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100).toFixed(1)
            : 0;

        // Aquí podrías actualizar un gráfico de precisión
    }

    updateUserPrizeHistory(stats) {
        // Aquí podrías implementar un gráfico de evolución de premios
    }
}

// Inicializar el gestor de estadísticas cuando se carga la página
window.addEventListener('load', () => {
    new StatsManager();
}); 
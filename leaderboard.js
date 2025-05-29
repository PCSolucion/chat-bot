// Importar las dependencias necesarias
import UserManager from './users.js';

class LeaderboardManager {
    constructor() {
        this.timeRange = document.getElementById('timeRange');
        this.sortBy = document.getElementById('sortBy');
        this.resetFilters = document.getElementById('resetFilters');
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.userManager = new UserManager();
        
        this.setupEventListeners();
        this.loadInitialData();
    }
    
    setupEventListeners() {
        // Manejar cambios en los filtros
        this.timeRange.addEventListener('change', () => this.updateLeaderboard());
        this.sortBy.addEventListener('change', () => this.updateLeaderboard());
        this.resetFilters.addEventListener('click', () => this.resetAllFilters());
        
        // Manejar cambios de pestañas
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button.dataset.tab));
        });
    }
    
    switchTab(tabId) {
        // Actualizar botones
        this.tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });
        
        // Actualizar contenido
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
        
        // Cargar datos específicos de la pestaña
        this.updateLeaderboard();
    }
    
    resetAllFilters() {
        this.timeRange.value = 'all';
        this.sortBy.value = 'prize';
        this.updateLeaderboard();
    }
    
    loadInitialData() {
        this.updateLeaderboard();
    }
    
    getFilteredStats(timeRange) {
        const allStats = [];
        const users = this.userManager.getAllUsers().filter(username => username.toLowerCase() !== 'liukin');
        
        users.forEach(username => {
            const stats = this.userManager.getStats(username);
            if (!stats) return;

            allStats.push({
                username,
                maxPrize: stats.highestPrize || 0,
                gamesPlayed: stats.gamesPlayed || 0,
                correctAnswers: stats.totalCorrect || 0,
                totalAnswers: (stats.totalCorrect || 0) + (stats.totalWrong || 0),
                maxLevel: stats.lastGame ? stats.lastGame.highestLevelReached : 0,
                lastPlayed: stats.lastGame ? stats.lastGame.date : null,
                lifelines: stats.lifelines || {},
                firstLifeline: stats.firstLifeline,
                totalLevel: stats.games ? stats.games.reduce((sum, game) => sum + (game.highestLevelReached || 0), 0) : 0,
                totalTime: stats.totalTime || 0,
                fastestAnswer: stats.fastestAnswer,
                fastestLevel: stats.fastestLevel,
                gamesWithoutTimer: stats.gamesWithoutTimer || 0,
                currentStreak: stats.currentStreak || 0,
                bestStreak: stats.bestStreak || 0,
                perfectStreaks: stats.perfectStreaks || 0,
                noLifelineStreaks: stats.noLifelineStreaks || 0,
                totalStreaks: stats.totalStreaks || 0
            });
        });

        if (timeRange === 'all') return allStats;
        
        const now = new Date();
        const filterDate = new Date();
        
        switch (timeRange) {
            case 'today':
                filterDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                filterDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                filterDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                filterDate.setFullYear(now.getFullYear() - 1);
                break;
        }
        
        return allStats.filter(stat => stat.lastPlayed && new Date(stat.lastPlayed) >= filterDate);
    }
    
    updateLeaderboard() {
        const stats = this.getFilteredStats(this.timeRange.value);
        const sortBy = this.sortBy.value;
        const activeTab = document.querySelector('.tab-button.active').dataset.tab;
        
        switch (activeTab) {
            case 'general':
                this.updateGeneralTab(stats, sortBy);
                break;
            case 'lifelines':
                this.updateLifelinesTab(stats, sortBy);
                break;
            case 'speed':
                this.updateSpeedTab(stats, sortBy);
                break;
            case 'streaks':
                this.updateStreaksTab(stats, sortBy);
                break;
        }
    }
    
    updateGeneralTab(stats, sortBy) {
        const tbody = document.getElementById('generalTableBody');
        if (!tbody) return;
        
        // Ordenar estadísticas según el criterio seleccionado
        stats.sort((a, b) => {
            switch (sortBy) {
                case 'prize': return b.maxPrize - a.maxPrize;
                case 'avgTime': return (b.totalTime / b.totalAnswers) - (a.totalTime / a.totalAnswers);
                case 'correctAnswers': return b.correctAnswers - a.correctAnswers;
                case 'gamesPlayed': return b.gamesPlayed - a.gamesPlayed;
                default: return 0;
            }
        });
        
        tbody.innerHTML = stats.map((stat, index) => `
            <tr class="${index < 3 ? 'top-' + (index + 1) : ''}">
                <td>${index + 1}</td>
                <td>${stat.username}</td>
                <td>${stat.maxPrize.toLocaleString()}€</td>
                <td>${stat.gamesPlayed}</td>
                <td>${((stat.correctAnswers / stat.totalAnswers) * 100 || 0).toFixed(1)}%</td>
                <td>${stat.maxLevel || 0}</td>
                <td>${stat.lastPlayed ? new Date(stat.lastPlayed).toLocaleDateString() : '-'}</td>
            </tr>
        `).join('');
    }
    
    updateLifelinesTab(stats, sortBy) {
        const tbody = document.getElementById('lifelinesTableBody');
        if (!tbody) return;
        
        const lifelineStats = stats.map(stat => {
            const lifelines = stat.lifelines || {};
            const totalUsed = Object.values(lifelines).reduce((a, b) => a + b, 0);
            const favorite = Object.entries(lifelines).sort((a, b) => b[1] - a[1])[0];
            
            return {
                username: stat.username,
                favoriteLifeline: favorite ? this.getLifelineName(favorite[0]) : 'Ninguno',
                timesUsed: favorite ? favorite[1] : 0,
                successRate: ((stat.correctAnswers / stat.totalAnswers) * 100 || 0).toFixed(1),
                firstLifeline: stat.firstLifeline ? this.getLifelineName(stat.firstLifeline) : 'N/A',
                avgLevel: (stat.totalLevel / stat.gamesPlayed || 0).toFixed(1)
            };
        });
        
        lifelineStats.sort((a, b) => b.timesUsed - a.timesUsed);
        
        tbody.innerHTML = lifelineStats.map((stat, index) => `
            <tr class="${index < 3 ? 'top-' + (index + 1) : ''}">
                <td>${index + 1}</td>
                <td>${stat.username}</td>
                <td>${stat.favoriteLifeline}</td>
                <td>${stat.timesUsed}</td>
                <td>${stat.successRate}%</td>
                <td>${stat.firstLifeline}</td>
                <td>${stat.avgLevel}</td>
            </tr>
        `).join('');
    }
    
    updateSpeedTab(stats, sortBy) {
        const tbody = document.getElementById('speedTableBody');
        if (!tbody) return;
        
        const speedStats = stats.map(stat => ({
            username: stat.username,
            avgTime: (stat.totalTime / stat.totalAnswers || 0).toFixed(1),
            fastestAnswer: stat.fastestAnswer || 'N/A',
            fastestLevel: stat.fastestLevel || 'N/A',
            withoutTimer: stat.gamesWithoutTimer || 0,
            totalQuestions: stat.totalAnswers || 0
        }));
        
        speedStats.sort((a, b) => parseFloat(a.avgTime) - parseFloat(b.avgTime));
        
        tbody.innerHTML = speedStats.map((stat, index) => `
            <tr class="${index < 3 ? 'top-' + (index + 1) : ''}">
                <td>${index + 1}</td>
                <td>${stat.username}</td>
                <td>${stat.avgTime}s</td>
                <td>${typeof stat.fastestAnswer === 'number' ? stat.fastestAnswer.toFixed(1) + 's' : stat.fastestAnswer}</td>
                <td>${stat.fastestLevel}</td>
                <td>${stat.withoutTimer}</td>
                <td>${stat.totalQuestions}</td>
            </tr>
        `).join('');
    }
    
    updateStreaksTab(stats, sortBy) {
        const tbody = document.getElementById('streaksTableBody');
        if (!tbody) return;
        
        const streakStats = stats.map(stat => ({
            username: stat.username,
            currentStreak: stat.currentStreak || 0,
            bestStreak: stat.bestStreak || 0,
            perfectStreaks: stat.perfectStreaks || 0,
            noLifelineStreaks: stat.noLifelineStreaks || 0,
            totalStreaks: stat.totalStreaks || 0
        }));
        
        streakStats.sort((a, b) => b.bestStreak - a.bestStreak);
        
        tbody.innerHTML = streakStats.map((stat, index) => `
            <tr class="${index < 3 ? 'top-' + (index + 1) : ''}">
                <td>${index + 1}</td>
                <td>${stat.username}</td>
                <td>${stat.currentStreak}</td>
                <td>${stat.bestStreak}</td>
                <td>${stat.perfectStreaks}</td>
                <td>${stat.noLifelineStreaks}</td>
                <td>${stat.totalStreaks}</td>
            </tr>
        `).join('');
    }
    
    getLifelineName(code) {
        const names = {
            'fifty': '50:50',
            'audience': 'Público',
            'phone': 'Llamada'
        };
        return names[code] || code;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new LeaderboardManager();
}); 
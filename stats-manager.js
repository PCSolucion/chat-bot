import { UserManager } from './user-manager.js';

export function getStats() {
    const userManager = new UserManager();
    const users = userManager.getAllUsers();
    
    return users.map(username => {
        const stats = userManager.getStats(username);
        if (!stats) return null;
        
        return {
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
        };
    }).filter(stat => stat !== null);
} 
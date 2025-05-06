class StatsManager {
    constructor() {
        this.userManager = new UserManager();
        this.currentUser = null;
        this.charts = {};
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
        
        usersList.innerHTML = users.length > 0 ? users.map(username => `
            <div class="user-item" data-username="${username}">
                <span>${username}</span>
            </div>
        `).join('') : '<div class="no-users">No hay usuarios registrados</div>';

        if (users.length > 0) {
            this.selectUser(users[0]);
        } else {
            document.getElementById('profileUsername').textContent = 'No hay usuarios';
        }
    }

    setupEventListeners() {
        // Búsqueda de usuarios
        document.getElementById('userSearch').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const userItems = document.querySelectorAll('.user-item');
            
            userItems.forEach(item => {
                const username = item.textContent.toLowerCase();
                item.style.display = username.includes(searchTerm) ? 'block' : 'none';
            });
        });

        // Selección de usuario
        document.getElementById('usersList').addEventListener('click', (e) => {
            const userItem = e.target.closest('.user-item');
            if (userItem) {
                this.selectUser(userItem.dataset.username);
            }
        });

        // Ordenación de partidas
        document.getElementById('sortByDate').addEventListener('click', () => {
            this.sortGamesHistory('date');
            document.getElementById('sortByDate').classList.add('active');
            document.getElementById('sortByPrize').classList.remove('active');
        });

        document.getElementById('sortByPrize').addEventListener('click', () => {
            this.sortGamesHistory('prize');
            document.getElementById('sortByDate').classList.remove('active');
            document.getElementById('sortByPrize').classList.add('active');
        });

        // Filtrado de logros
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.filterAchievements(filter);
                
                // Actualizar botones activos
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Reinicio de estadísticas
        document.getElementById('resetStats').addEventListener('click', () => {
            if (this.currentUser) {
                this.showConfirmModal();
            }
        });

        document.getElementById('confirmReset').addEventListener('click', () => {
            this.resetUserStats();
            this.hideConfirmModal();
        });

        document.getElementById('cancelReset').addEventListener('click', () => {
            this.hideConfirmModal();
        });
    }

    selectUser(username) {
        this.currentUser = username;
        
        // Actualizar UI para resaltar el usuario seleccionado
        document.querySelectorAll('.user-item').forEach(item => {
            item.classList.toggle('active', item.dataset.username === username);
        });
        
        // Actualizar nombre de usuario en el perfil
        document.getElementById('profileUsername').textContent = username;
        
        // Cargar estadísticas del usuario
        this.updateUserStats(username);
    }

    updateGlobalStats() {
        const users = this.userManager.getAllUsers();
        if (users.length === 0) return;
        
        const allStats = users.map(username => this.userManager.getStats(username)).filter(stats => stats !== null);
        
        const totalGames = allStats.reduce((sum, stats) => sum + stats.gamesPlayed, 0);
        document.getElementById('totalGames').textContent = totalGames;
    }

    updateUserStats(username) {
        const stats = this.userManager.getStats(username);
        if (!stats) return;

        // Actualizar estadísticas principales
        document.getElementById('highestPrize').textContent = `${stats.highestPrize.toLocaleString()} €`;
        
        // Calcular precisión solo si hay respuestas
        const totalAnswers = stats.totalCorrect + stats.totalWrong;
        const accuracy = totalAnswers > 0 
            ? ((stats.totalCorrect / totalAnswers) * 100).toFixed(1)
            : 0;
        document.getElementById('userAccuracy').textContent = `${accuracy}%`;
        
        // Actualizar total de partidas
        document.getElementById('totalGames').textContent = stats.gamesPlayed;

        // Actualizar historial de partidas
        this.updateGamesHistory(stats);
        
        // Actualizar detalles del jugador
        this.updatePlayerDetails(stats);
        
        // Actualizar logros
        this.updateAchievements(stats);
        
        // Crear/actualizar gráficos
        this.createCharts(stats);
        
        // Registrar información en consola para depuración
        console.log("Mostrando estadísticas para:", username, stats);
    }

    updateGamesHistory(stats) {
        const gamesHistory = document.getElementById('gamesHistory');
        
        if (!stats.games || stats.games.length === 0) {
            gamesHistory.innerHTML = '<div class="no-games">No hay partidas registradas</div>';
            return;
        }
        
        gamesHistory.innerHTML = stats.games.map(game => {
            // Determinar el nivel más alto alcanzado
            const levelReached = game.highestLevelReached || this.getPrizeLevel(game.prize);
            // Determinar si se alcanzó un nivel de seguro
            const safeLevels = [5, 10]; // Los niveles 5 y 10 son de seguro
            const reachedSafeLevel = safeLevels.find(level => levelReached >= level) || 0;
            
            return `
                <div class="game-item" data-date="${game.date}" data-prize="${game.prize}">
                    <div class="game-date">
                        <i class="fas fa-calendar-day"></i> ${new Date(game.date).toLocaleDateString()}
                    </div>
                <div class="game-details">
                        <span><i class="fas fa-check text-success"></i> ${game.correctAnswers}</span>
                        <span><i class="fas fa-times text-danger"></i> ${game.wrongAnswers}</span>
                        <span><i class="fas fa-level-up-alt"></i> Nivel ${levelReached} 
                            ${reachedSafeLevel ? `<i class="fas fa-shield-alt text-success" title="Nivel de seguro alcanzado"></i>` : ''}
                        </span>
                    </div>
                    <div class="game-prize">
                        <i class="fas fa-euro-sign"></i> ${game.prize.toLocaleString()}
                    </div>
                </div>
            `;
        }).join('');
    }

    sortGamesHistory(criteria) {
        const gamesHistory = document.getElementById('gamesHistory');
        const games = Array.from(gamesHistory.querySelectorAll('.game-item'));
        
        if (games.length === 0) return;
        
        games.sort((a, b) => {
            if (criteria === 'date') {
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            } else if (criteria === 'prize') {
                return parseInt(b.dataset.prize) - parseInt(a.dataset.prize);
            }
            return 0;
        });
        
        games.forEach(game => gamesHistory.appendChild(game));
    }

    updatePlayerDetails(stats) {
        // Mejor nivel alcanzado
        const highestLevel = this.getPrizeLevel(stats.highestPrize);
        document.getElementById('highestLevel').textContent = `Nivel ${highestLevel}`;
        
        // Fechas de partidas
        if (stats.games && stats.games.length > 0) {
            const sortedGames = [...stats.games].sort((a, b) => new Date(a.date) - new Date(b.date));
            document.getElementById('firstGame').textContent = new Date(sortedGames[0].date).toLocaleDateString();
            document.getElementById('lastGame').textContent = new Date(sortedGames[sortedGames.length - 1].date).toLocaleDateString();
        } else {
            document.getElementById('firstGame').textContent = '-';
            document.getElementById('lastGame').textContent = '-';
        }
        
        // Calcular estadísticas adicionales
        if (stats.games && stats.games.length > 0) {
            // Determinar comodines favoritos (cuando tengamos esos datos)
            document.getElementById('favoriteLifelines').textContent = 'Público (simulado)';
            
            // Otras estadísticas que podrían ser útiles
            const totalQuestionsAnswered = stats.totalCorrect + stats.totalWrong;
            const averageCorrectPerGame = stats.gamesPlayed > 0 
                ? (stats.totalCorrect / stats.gamesPlayed).toFixed(1) 
                : 0;
                
            // Estas podrían ser añadidas a la interfaz si hay elementos para mostrarlas
            console.log("Estadísticas adicionales:", {
                totalPreguntas: totalQuestionsAnswered,
                promedioPreguntasCorrectas: averageCorrectPerGame
            });
        } else {
            document.getElementById('favoriteLifelines').textContent = '-';
        }
    }

    updateAchievements(stats) {
        // Logros originales
        
        // Logro: Primera Victoria
        const firstWin = document.getElementById('firstWin');
        if (stats.gamesPlayed > 0) {
            firstWin.classList.remove('locked');
        } else {
            firstWin.classList.add('locked');
        }
        
        // Logro: Club de Legendarios
        const millionaireClub = document.getElementById('millionaireClub');
        if (stats.highestPrize >= 1000000) {
            millionaireClub.classList.remove('locked');
        } else {
            millionaireClub.classList.add('locked');
        }
        
        // Logro: Precisión Perfecta
        const perfectAccuracy = document.getElementById('perfectAccuracy');
        const hasPerfectGame = stats.games && stats.games.some(game => game.correctAnswers > 0 && game.wrongAnswers === 0);
        if (hasPerfectGame) {
            perfectAccuracy.classList.remove('locked');
        } else {
            perfectAccuracy.classList.add('locked');
        }
        
        // Logro: Jugador Frecuente
        const frequentPlayer = document.getElementById('frequentPlayer');
        if (stats.gamesPlayed >= 10) {
            frequentPlayer.classList.remove('locked');
        } else {
            frequentPlayer.classList.add('locked');
        }
        
        // Nuevos logros
        
        // Logro: Maestro de Seguridad
        const safeguardMaster = document.getElementById('safeguardMaster');
        const level10Games = stats.games && stats.games.filter(game => game.highestLevelReached >= 10).length;
        if (level10Games >= 5) {
            safeguardMaster.classList.remove('locked');
        } else {
            safeguardMaster.classList.add('locked');
        }
        
        // Logro: Velocista (simulado, no se guarda el tiempo de respuesta)
        const speedDemon = document.getElementById('speedDemon');
        speedDemon.classList.add('locked');
        
        // Logro: Maestro del 50:50 (simulado, no se guarda el uso de comodines)
        const fiftyFiftyMaster = document.getElementById('fiftyFiftyMaster');
        fiftyFiftyMaster.classList.add('locked');
        
        // Logro: Confianza en el Público (simulado)
        const audienceTrust = document.getElementById('audienceTrust');
        audienceTrust.classList.add('locked');
        
        // Logro: Teléfono Amigo (simulado)
        const phoneAFriend = document.getElementById('phoneAFriend');
        phoneAFriend.classList.add('locked');
        
        // Logro: Sin Ayuda (simulado)
        const noLifelines = document.getElementById('noLifelines');
        noLifelines.classList.add('locked');
        
        // Logro: Rey del Regreso
        // Simulado, se podría implementar analizando el historial de partidas
        const comebackKing = document.getElementById('comebackKing');
        comebackKing.classList.add('locked');
        
        // Logro: Siete de la Suerte
        const luckySeven = document.getElementById('luckySeven');
        const has7777Prize = stats.games && stats.games.some(game => game.prize === 7777);
        if (has7777Prize) {
            luckySeven.classList.remove('locked');
        } else {
            luckySeven.classList.add('locked');
        }
        
        // Logro: Segunda Oportunidad (simulado)
        const secondChance = document.getElementById('secondChance');
        secondChance.classList.add('locked');
        
        // Logro: Maratonista (simulado, no guardamos timestamp de partidas)
        const marathonRunner = document.getElementById('marathonRunner');
        marathonRunner.classList.add('locked');
        
        // Logro: Por los Pelos (simulado)
        const closeCut = document.getElementById('closeCut');
        closeCut.classList.add('locked');
        
        // Logro: Alto Riesgo (simulado)
        const highStakes = document.getElementById('highStakes');
        highStakes.classList.add('locked');
        
        // Logro: Triplete (simulado, requiere análisis de partidas consecutivas)
        const threeInARow = document.getElementById('threeInARow');
        threeInARow.classList.add('locked');
        
        // Logro: Sabelotodo
        const smartCookie = document.getElementById('smartCookie');
        if (stats.totalCorrect >= 50) {
            smartCookie.classList.remove('locked');
        } else {
            smartCookie.classList.add('locked');
        }
        
        // Logro: Persistente
        const persistentPlayer = document.getElementById('persistentPlayer');
        if (stats.gamesPlayed >= 25) {
            persistentPlayer.classList.remove('locked');
        } else {
            persistentPlayer.classList.add('locked');
        }
        
        // Logro: Veterano
        const veteranStatus = document.getElementById('veteranStatus');
        if (stats.gamesPlayed >= 50) {
            veteranStatus.classList.remove('locked');
        } else {
            veteranStatus.classList.add('locked');
        }
        
        // Logro: Aprendiz Rápido (simulado, requiere análisis de mejora consecutiva)
        const quickLearner = document.getElementById('quickLearner');
        quickLearner.classList.add('locked');
        
        // Logro: Progreso Constante (simulado)
        const steadyProgress = document.getElementById('steadyProgress');
        steadyProgress.classList.add('locked');
        
        // Logro: Premio Gordo
        const jackpot = document.getElementById('jackpot');
        const totalPrize = stats.games ? stats.games.reduce((sum, game) => sum + game.prize, 0) : 0;
        if (totalPrize >= 2000000) {
            jackpot.classList.remove('locked');
        } else {
            jackpot.classList.add('locked');
        }
        
        // Logro: Cerebrito
        const brainiac = document.getElementById('brainiac');
        const accuracy = stats.totalCorrect + stats.totalWrong > 0 
            ? (stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100
            : 0;
        if (accuracy >= 90 && stats.gamesPlayed >= 20) {
            brainiac.classList.remove('locked');
        } else {
            brainiac.classList.add('locked');
        }
        
        // Logro: Estado Legendario
        const legendaryStatus = document.getElementById('legendaryStatus');
        const millionWins = stats.games ? stats.games.filter(game => game.prize >= 1000000).length : 0;
        if (millionWins >= 3) {
            legendaryStatus.classList.remove('locked');
        } else {
            legendaryStatus.classList.add('locked');
        }
        
        // Logro: En Racha (simulado, requiere análisis de respuestas consecutivas)
        const onFire = document.getElementById('onFire');
        onFire.classList.add('locked');
    }

    createCharts(stats) {
        this.createPrizeProgressChart(stats);
        this.createAnswersDistributionChart(stats);
    }

    createPrizeProgressChart(stats) {
        const ctx = document.getElementById('prizeProgressChart').getContext('2d');
        
        // Destruir gráfico anterior si existe
        if (this.charts.prizeProgress) {
            this.charts.prizeProgress.destroy();
        }
        
        if (!stats.games || stats.games.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('No hay datos disponibles', ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }
        
        // Preparar datos para el gráfico
        const sortedGames = [...stats.games].sort((a, b) => new Date(a.date) - new Date(b.date));
        const labels = sortedGames.map((_, index) => `Partida ${index + 1}`);
        const data = sortedGames.map(game => game.prize);
        
        // Crear gráfico
        this.charts.prizeProgress = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Premio (€)',
                    data: data,
                    backgroundColor: 'rgba(241, 143, 1, 0.2)',
                    borderColor: '#f18f01',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true,
                    pointBackgroundColor: '#f18f01',
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                }
            }
        });
    }

    createAnswersDistributionChart(stats) {
        const ctx = document.getElementById('answersDistributionChart').getContext('2d');
        
        // Destruir gráfico anterior si existe
        if (this.charts.answersDistribution) {
            this.charts.answersDistribution.destroy();
        }
        
        if (!stats || (stats.totalCorrect === 0 && stats.totalWrong === 0)) {
            ctx.font = '16px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('No hay datos disponibles', ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }
        
        // Crear gráfico
        this.charts.answersDistribution = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Correctas', 'Incorrectas'],
                datasets: [{
                    data: [stats.totalCorrect, stats.totalWrong],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.8)',
                        'rgba(244, 67, 54, 0.8)'
                    ],
                    borderColor: [
                        'rgba(76, 175, 80, 1)',
                        'rgba(244, 67, 54, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'white',
                            padding: 15
                        }
                    }
                }
            }
        });
    }

    getPrizeLevel(prize) {
        // Asociar el premio con su nivel aproximado
        const prizeLevels = [
            { level: 1, prize: 100 },
            { level: 2, prize: 250 },
            { level: 3, prize: 500 },
            { level: 4, prize: 750 },
            { level: 5, prize: 1500 },
            { level: 6, prize: 2500 },
            { level: 7, prize: 5000 },
            { level: 8, prize: 10000 },
            { level: 9, prize: 15000 },
            { level: 10, prize: 20000 },
            { level: 11, prize: 30000 },
            { level: 12, prize: 50000 },
            { level: 13, prize: 100000 },
            { level: 14, prize: 300000 },
            { level: 15, prize: 1000000 }
        ];
        
        // Encontrar el nivel más cercano
        for (let i = prizeLevels.length - 1; i >= 0; i--) {
            if (prize >= prizeLevels[i].prize) {
                return prizeLevels[i].level;
            }
        }
        
        return 0;
    }

    showConfirmModal() {
        document.getElementById('confirmModal').style.display = 'flex';
    }

    hideConfirmModal() {
        document.getElementById('confirmModal').style.display = 'none';
    }

    resetUserStats() {
        if (!this.currentUser) return;
        
        // Reiniciar estadísticas del usuario actual
        this.userManager.resetUserStats(this.currentUser);
        
        // Actualizar la interfaz
        this.updateUserStats(this.currentUser);
        this.updateGlobalStats();
        
        // Mostrar notificación al usuario
        this.showNotification('success', 'Estadísticas reiniciadas', `Las estadísticas de ${this.currentUser} se han reiniciado correctamente.`);
    }
    
    showNotification(type, title, message) {
        const notification = document.getElementById('notification');
        const notificationIcon = document.getElementById('notificationIcon');
        const notificationTitle = document.getElementById('notificationTitle');
        const notificationMessage = document.getElementById('notificationMessage');
        
        // Configurar tipo de notificación
        notification.className = 'notification';
        notification.classList.add(type);
        
        // Actualizar icono según el tipo
        if (type === 'success') {
            notificationIcon.className = 'fas fa-check-circle';
        } else if (type === 'error') {
            notificationIcon.className = 'fas fa-exclamation-circle';
        }
        
        // Actualizar contenido
        notificationTitle.textContent = title;
        notificationMessage.textContent = message;
        
        // Mostrar notificación
        notification.classList.add('show');
        
        // Ocultar después de 4 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }

    // Nueva función para filtrar logros
    filterAchievements(filter) {
        const achievements = document.querySelectorAll('.achievement-item');
        
        achievements.forEach(achievement => {
            const isLocked = achievement.classList.contains('locked');
            
            if (filter === 'all') {
                achievement.style.display = 'flex';
            } else if (filter === 'unlocked' && !isLocked) {
                achievement.style.display = 'flex';
            } else if (filter === 'locked' && isLocked) {
                achievement.style.display = 'flex';
            } else {
                achievement.style.display = 'none';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Importar UserManager primero
    import('./users.js').then(module => {
        window.UserManager = module.default;
    new StatsManager();
    });
}); 
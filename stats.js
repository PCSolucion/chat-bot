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
        this.updateLeaderboard('all'); // Inicializar leaderboard
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
        const filterButtons = document.querySelectorAll('.tab[data-filter]');
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

        // Evento para el filtro del leaderboard
        document.getElementById('monthFilter').addEventListener('change', (e) => {
            this.updateLeaderboard(e.target.value);
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

        // Actualizar el leaderboard para reflejar el usuario actual
        const monthFilter = document.getElementById('monthFilter').value;
        this.updateLeaderboard(monthFilter);
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
        
        games.forEach(game => {
            gamesHistory.appendChild(game);
        });
    }

    updatePlayerDetails(stats) {
        if (!stats) return;
        
        // Fecha primer juego
        const firstGame = stats.games.length > 0 
            ? new Date(stats.games[stats.games.length - 1].date).toLocaleDateString() 
            : '-';
        document.getElementById('firstGame').textContent = firstGame;
        
        // Fecha último juego
        const lastGame = stats.lastGame 
            ? new Date(stats.lastGame.date).toLocaleDateString() 
            : '-';
        document.getElementById('lastGame').textContent = lastGame;
        
        // Nivel más alto alcanzado
        const highestLevel = this.getPrizeLevel(stats.highestPrize);
        document.getElementById('highestLevel').textContent = `Nivel ${highestLevel}`;
        
        // Comodines favoritos (pendiente de implementar)
        document.getElementById('favoriteLifelines').textContent = 'No disponible';
        
        // Exportar estadísticas (pendiente de implementar)
        const exportBtn = document.getElementById('exportStats');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportUserStats(stats);
            });
        }
    }

    updateAchievements(stats) {
        const achievementsContainer = document.getElementById('achievements');
        
        if (!stats) {
            achievementsContainer.innerHTML = '<div class="no-achievements">No hay logros disponibles</div>';
            return;
        }
        
        // Definición de los logros y sus condiciones
        const achievements = [
            {
                id: 'firstWin',
                title: 'Primera Victoria',
                description: 'Completar tu primera partida',
                icon: 'fas fa-trophy',
                check: stats => stats.gamesPlayed >= 1
            },
            {
                id: 'millionaireClub',
                title: 'Club de Legendarios',
                description: 'Ganar 1.000.000 €',
                icon: 'fas fa-crown',
                check: stats => stats.highestPrize >= 1000000
            },
            {
                id: 'perfectAccuracy',
                title: 'Precisión Perfecta',
                description: 'Completar una partida sin errores',
                icon: 'fas fa-check-circle',
                check: stats => stats.games.some(game => game.correctAnswers > 0 && game.wrongAnswers === 0)
            },
            {
                id: 'frequentPlayer',
                title: 'Jugador Frecuente',
                description: 'Jugar 10 o más partidas',
                icon: 'fas fa-gamepad',
                check: stats => stats.gamesPlayed >= 10
            },
            {
                id: 'safeguardMaster',
                title: 'Maestro de Seguridad',
                description: 'Alcanzar nivel 10 (20.000€) en 5 partidas diferentes',
                icon: 'fas fa-shield-alt',
                check: stats => stats.games.filter(game => this.getPrizeLevel(game.prize) >= 10).length >= 5
            },
            {
                id: 'speedDemon',
                title: 'Velocista',
                description: 'Responder 5 preguntas en menos de 10 segundos cada una',
                icon: 'fas fa-bolt',
                check: () => false // Pendiente de implementar
            },
            {
                id: 'fiftyFiftyMaster',
                title: 'Maestro del 50:50',
                description: 'Ganar una partida usando solo el comodín 50:50',
                icon: 'fas fa-percentage',
                check: () => false // Pendiente de implementar
            },
            {
                id: 'audienceTrust',
                title: 'Confianza en el Público',
                description: 'Acertar 10 preguntas siguiendo al público',
                icon: 'fas fa-users',
                check: () => false // Pendiente de implementar
            },
            {
                id: 'phoneAFriend',
                title: 'Teléfono Amigo',
                description: 'Ganar una pregunta de nivel 12+ con el comodín de la llamada',
                icon: 'fas fa-phone-alt',
                check: () => false // Pendiente de implementar
            },
            {
                id: 'noLifelines',
                title: 'Sin Ayuda',
                description: 'Alcanzar el nivel 10 sin usar ningún comodín',
                icon: 'fas fa-ban',
                check: () => false // Pendiente de implementar
            },
            {
                id: 'comebackKing',
                title: 'Rey del Regreso',
                description: 'Ganar después de haber perdido 3 partidas seguidas',
                icon: 'fas fa-undo',
                check: () => false // Pendiente de implementar
            },
            {
                id: 'luckySeven',
                title: 'Siete de la Suerte',
                description: 'Ganar 7.777€ exactos',
                icon: 'fas fa-dice',
                check: stats => stats.games.some(game => game.prize === 7777)
            },
            {
                id: 'secondChance',
                title: 'Segunda Oportunidad',
                description: 'Perder y volver a jugar inmediatamente',
                icon: 'fas fa-sync',
                check: () => false // Pendiente de implementar
            },
            {
                id: 'marathonRunner',
                title: 'Maratonista',
                description: 'Jugar 5 partidas en un solo día',
                icon: 'fas fa-running',
                check: () => false // Pendiente de implementar
            },
            {
                id: 'closeCut',
                title: 'Por los Pelos',
                description: 'Responder correctamente con menos de 3 segundos en el reloj',
                icon: 'fas fa-clock',
                check: () => false // Pendiente de implementar
            },
            {
                id: 'highStakes',
                title: 'Alto Riesgo',
                description: 'Alcanzar nivel 15 sin usar ningún nivel de seguridad',
                icon: 'fas fa-gem',
                check: () => false // Pendiente de implementar
            },
            {
                id: 'threeInARow',
                title: 'Triplete',
                description: 'Ganar 3 partidas consecutivas',
                icon: 'fas fa-award',
                check: () => false // Pendiente de implementar
            },
            {
                id: 'smartCookie',
                title: 'Sabelotodo',
                description: 'Responder correctamente 50 preguntas en total',
                icon: 'fas fa-brain',
                check: stats => stats.totalCorrect >= 50
            },
            {
                id: 'persistentPlayer',
                title: 'Persistente',
                description: 'Jugar 25 partidas en total',
                icon: 'fas fa-hammer',
                check: stats => stats.gamesPlayed >= 25
            },
            {
                id: 'veteranStatus',
                title: 'Veterano',
                description: 'Jugar 50 partidas en total',
                icon: 'fas fa-star',
                check: stats => stats.gamesPlayed >= 50
            },
            {
                id: 'quickLearner',
                title: 'Aprendiz Rápido',
                description: 'Mejorar tu puntuación anterior 3 veces seguidas',
                icon: 'fas fa-graduation-cap',
                check: () => false // Pendiente de implementar
            },
            {
                id: 'steadyProgress',
                title: 'Progreso Constante',
                description: 'Alcanzar al menos el nivel 5 en 10 partidas consecutivas',
                icon: 'fas fa-chart-line',
                check: () => false // Pendiente de implementar
            },
            {
                id: 'jackpot',
                title: 'Premio Gordo',
                description: 'Acumular 2.000.000€ en total entre todas tus partidas',
                icon: 'fas fa-coins',
                check: stats => {
                    const totalPrize = stats.games.reduce((sum, game) => sum + game.prize, 0);
                    return totalPrize >= 2000000;
                }
            },
            {
                id: 'brainiac',
                title: 'Cerebrito',
                description: 'Alcanzar una precisión del 90% después de 20+ partidas',
                icon: 'fas fa-lightbulb',
                check: stats => {
                    const totalAnswers = stats.totalCorrect + stats.totalWrong;
                    const accuracy = totalAnswers > 0 
                        ? ((stats.totalCorrect / totalAnswers) * 100)
                        : 0;
                    return accuracy >= 90 && stats.gamesPlayed >= 20;
                }
            },
            {
                id: 'legendaryStatus',
                title: 'Estado Legendario',
                description: 'Ganar el millón 3 veces',
                icon: 'fas fa-dragon',
                check: stats => stats.games.filter(game => game.prize >= 1000000).length >= 3
            },
            {
                id: 'onFire',
                title: 'En Racha',
                description: 'Responder correctamente 15 preguntas consecutivas',
                icon: 'fas fa-fire',
                check: () => false // Pendiente de implementar
            }
        ];
        
        // Generar HTML para cada logro
        const achievementsHTML = achievements.map(achievement => {
            const unlocked = achievement.check(stats);
            return `
                <div class="achievement-item ${unlocked ? '' : 'locked'}" id="${achievement.id}">
                    <i class="${achievement.icon}"></i>
                    <div class="achievement-details">
                        <h3>${achievement.title}</h3>
                        <p>${achievement.description}</p>
                    </div>
                </div>
            `;
        }).join('');
        
        achievementsContainer.innerHTML = achievementsHTML;
    }

    createCharts(stats) {
        this.createPrizeProgressChart(stats);
        this.createAnswersDistributionChart(stats);
    }

    createPrizeProgressChart(stats) {
        if (!stats || !stats.games || stats.games.length === 0) {
            return;
        }
        
        const ctx = document.getElementById('prizeProgressChart');
        
        // Destruir gráfico anterior si existe
        if (this.charts.prizeProgress) {
            this.charts.prizeProgress.destroy();
        }
        
        // Obtener últimas 10 partidas (o menos si no hay suficientes)
        const recentGames = [...stats.games].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-10);
        
        const data = {
            labels: recentGames.map((_, index) => `Partida ${index + 1}`),
            datasets: [{
                label: 'Premio (€)',
                data: recentGames.map(game => game.prize),
                backgroundColor: 'rgba(59, 130, 246, 0.3)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#fff',
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true
            }]
        };
        
        const config = {
            type: 'line',
                    data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                return `Premio: ${context.raw.toLocaleString()} €`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + 'M €';
                                } else if (value >= 1000) {
                                    return (value / 1000).toFixed(1) + 'K €';
                                }
                                return value + ' €';
                            },
                            color: 'rgba(255, 255, 255, 0.9)',
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.9)',
                            font: {
                                size: 12
                    }
                        }
                    }
                }
            }
        };
        
        this.charts.prizeProgress = new Chart(ctx, config);
    }

    createAnswersDistributionChart(stats) {
        if (!stats) return;
        
        const ctx = document.getElementById('answersDistributionChart');
        
        // Destruir gráfico anterior si existe
        if (this.charts.answersDistribution) {
            this.charts.answersDistribution.destroy();
        }
        
        const correctAnswers = stats.totalCorrect || 0;
        const wrongAnswers = stats.totalWrong || 0;
        
        const data = {
                labels: ['Correctas', 'Incorrectas'],
                datasets: [{
                data: [correctAnswers, wrongAnswers],
                    backgroundColor: [
                    'rgba(52, 211, 153, 0.85)',
                    'rgba(239, 68, 68, 0.85)'
                    ],
                    borderColor: [
                    'rgba(52, 211, 153, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 2
            }]
        };
        
        const config = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.9)',
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 13,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = correctAnswers + wrongAnswers;
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
                                return `${context.label}: ${value} (${percentage})`;
                            }
                        }
                    }
                }
            }
        };
        
        this.charts.answersDistribution = new Chart(ctx, config);
    }

    getPrizeLevel(prize) {
        const prizeLevels = {
            100: 1, 250: 2, 500: 3, 750: 4, 1500: 5,
            2500: 6, 5000: 7, 10000: 8, 15000: 9, 20000: 10,
            30000: 11, 50000: 12, 100000: 13, 300000: 14, 1000000: 15
        };
        
        // Buscar el nivel exacto
        if (prizeLevels[prize] !== undefined) {
            return prizeLevels[prize];
        }
        
        // Si no hay un nivel exacto, encontrar el nivel más cercano por debajo
        const levels = Object.keys(prizeLevels).map(Number).sort((a, b) => a - b);
        let levelFound = 0;
        
        for (let i = 0; i < levels.length; i++) {
            if (prize >= levels[i]) {
                levelFound = prizeLevels[levels[i]];
            } else {
                break;
            }
        }
        
        return levelFound;
    }

    showConfirmModal() {
        const modal = document.getElementById('confirmModal');
        modal.classList.add('show');
    }

    hideConfirmModal() {
        const modal = document.getElementById('confirmModal');
        modal.classList.remove('show');
    }

    resetUserStats() {
        if (!this.currentUser) return;
        
        const success = this.userManager.resetUserStats(this.currentUser);
        
        if (success) {
        this.updateUserStats(this.currentUser);
            this.showNotification('success', 'Éxito', 'Estadísticas reiniciadas correctamente');
        } else {
            this.showNotification('error', 'Error', 'No se pudieron reiniciar las estadísticas');
        }
    }
    
    showNotification(type, title, message) {
        const notification = document.getElementById('notification');
        const notificationTitle = document.getElementById('notificationTitle');
        const notificationMessage = document.getElementById('notificationMessage');
        const notificationIcon = document.getElementById('notificationIcon');
        
        // Configurar la notificación
        notificationTitle.textContent = title;
        notificationMessage.textContent = message;
        
        // Configurar el icono según el tipo
        if (type === 'success') {
            notification.classList.remove('error');
            notificationIcon.className = 'fas fa-check-circle';
        } else if (type === 'error') {
            notification.classList.add('error');
            notificationIcon.className = 'fas fa-exclamation-circle';
        }
        
        // Mostrar la notificación
        notification.classList.add('show');
        
        // Ocultar la notificación después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    filterAchievements(filter) {
        const achievements = document.querySelectorAll('.achievement-item');
        
        achievements.forEach(achievement => {
            switch (filter) {
                case 'unlocked':
                    achievement.style.display = achievement.classList.contains('locked') ? 'none' : 'flex';
                    break;
                case 'locked':
                    achievement.style.display = achievement.classList.contains('locked') ? 'flex' : 'none';
                    break;
                default: // 'all'
                achievement.style.display = 'flex';
            }
        });
    }

    updateLeaderboard(timeFilter) {
        const users = this.userManager.getAllUsers().filter(username => username.toLowerCase() !== 'liukin');
        let leaderboardData = [];

        users.forEach(username => {
            const stats = this.userManager.getStats(username);
            if (!stats) return;

            let validGames = stats.games;
            let highestPrize = stats.highestPrize;
            let dateOfHighestPrize = stats.lastGame ? stats.lastGame.date : new Date();

            if (timeFilter !== 'all') {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                validGames = stats.games.filter(game => {
                    const gameDate = new Date(game.date);
                    if (timeFilter === 'current') {
                        return gameDate.getMonth() === currentMonth && 
                               gameDate.getFullYear() === currentYear;
                    } else if (timeFilter === 'last') {
                        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                        return gameDate.getMonth() === lastMonth && 
                               gameDate.getFullYear() === lastMonthYear;
                    }
                });

                if (validGames.length > 0) {
                    const highestPrizeGame = validGames.reduce((max, game) => 
                        game.prize > max.prize ? game : max
                    );
                    highestPrize = highestPrizeGame.prize;
                    dateOfHighestPrize = highestPrizeGame.date;
                } else {
                    return;
                }
            }

            leaderboardData.push({
                username,
                prize: highestPrize,
                date: new Date(dateOfHighestPrize)
            });
        });

        // Ordenar por premio más alto
        leaderboardData.sort((a, b) => b.prize - a.prize);

        // Actualizar la tabla
        const tbody = document.getElementById('leaderboardBody');
        tbody.innerHTML = '';

        leaderboardData.forEach((data, index) => {
            const row = document.createElement('tr');
            
            // Añadir clase si es el usuario actual
            if (data.username === this.currentUser) {
                row.classList.add('current-user');
                row.style.backgroundColor = 'var(--primary)';
                row.style.color = 'white';
            }
            
            // Crear celda de posición con medalla para los primeros 3
            const rankCell = document.createElement('td');
            if (index < 3) {
                const medalIcon = document.createElement('i');
                medalIcon.className = `fas fa-medal rank-${index + 1}`;
                rankCell.appendChild(medalIcon);
                rankCell.appendChild(document.createTextNode(` ${index + 1}º`));
            } else {
                rankCell.textContent = `${index + 1}º`;
            }
            rankCell.className = 'rank';
            
            const usernameCell = document.createElement('td');
            usernameCell.textContent = data.username;
            
            const prizeCell = document.createElement('td');
            prizeCell.textContent = `${data.prize.toLocaleString()} €`;
            prizeCell.className = 'prize';
            
            const dateCell = document.createElement('td');
            dateCell.textContent = data.date.toLocaleDateString();
            
            // Si es el usuario actual, aplicar estilos a todas las celdas
            if (data.username === this.currentUser) {
                [rankCell, usernameCell, prizeCell, dateCell].forEach(cell => {
                    cell.style.backgroundColor = 'var(--primary)';
                    cell.style.color = 'white';
                });
            }
            
            row.appendChild(rankCell);
            row.appendChild(usernameCell);
            row.appendChild(prizeCell);
            row.appendChild(dateCell);
            
            tbody.appendChild(row);
        });
    }
}

// Importar UserManager
import UserManager from './users.js';

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new StatsManager();
}); 
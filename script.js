document.addEventListener('DOMContentLoaded', () => {
    // Éléments du DOM
    const playerScore = document.getElementById('player-score');
    const computerScore = document.getElementById('computer-score');
    const tieScore = document.getElementById('tie-score');
    const playerLabel = document.getElementById('player-label');
    const result = document.getElementById('result');
    const playerSelection = document.getElementById('player-selection');
    const computerSelection = document.getElementById('computer-selection');
    const choices = document.querySelectorAll('.choice');
    const historyList = document.getElementById('history-list');
    const resetBtn = document.getElementById('reset-btn');
    const nameBtn = document.getElementById('name-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const nameModal = document.getElementById('name-modal');
    const playerNameInput = document.getElementById('player-name');
    const saveNameBtn = document.getElementById('save-name');
    
    // Sons
    const soundRock = document.getElementById('sound-rock');
    const soundPaper = document.getElementById('sound-paper');
    const soundScissors = document.getElementById('sound-scissors');
    const soundWin = document.getElementById('sound-win');
    const soundLose = document.getElementById('sound-lose');
    const soundTie = document.getElementById('sound-tie');
    
    // Variables du jeu
    let scores = {
        player: 0,
        computer: 0,
        tie: 0
    };
    
    let playerName = 'Joueur';
    let gameHistory = [];
    
    // Icônes pour les choix
    const choiceIcons = {
        rock: '✊',
        paper: '✋',
        scissors: '✌️'
    };
    
    // Fonction pour obtenir le choix de l'ordinateur
    function getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * 3);
        return choices[randomIndex];
    }
    
    // Fonction pour déterminer le gagnant
    function getWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'tie';
        }
        
        if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            return 'player';
        }
        
        return 'computer';
    }
    
    // Fonction pour mettre à jour l'affichage des scores
    function updateScores() {
        playerScore.textContent = scores.player;
        computerScore.textContent = scores.computer;
        tieScore.textContent = scores.tie;
    }
    
    // Fonction pour mettre à jour l'historique
    function updateHistory(playerChoice, computerChoice, winner) {
        const historyItem = {
            playerChoice,
            computerChoice,
            winner,
            date: new Date()
        };
        
        gameHistory.unshift(historyItem); // Ajouter au début
        
        // Limiter l'historique à 10 entrées
        if (gameHistory.length > 10) {
            gameHistory.pop();
        }
        
        // Mettre à jour l'affichage
        renderHistory();
    }
    
    // Fonction pour afficher l'historique
    function renderHistory() {
        historyList.innerHTML = '';
        
        gameHistory.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            
            const time = item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            let resultText;
            let resultClass;
            
            if (item.winner === 'player') {
                resultText = 'Victoire';
                resultClass = 'history-win';
            } else if (item.winner === 'computer') {
                resultText = 'Défaite';
                resultClass = 'history-lose';
            } else {
                resultText = 'Égalité';
                resultClass = 'history-tie';
            }
            
            li.innerHTML = `
                <span>${time} - ${playerName}: ${choiceIcons[item.playerChoice]} vs Ordinateur: ${choiceIcons[item.computerChoice]}</span>
                <span class="history-result ${resultClass}">${resultText}</span>
            `;
            
            historyList.appendChild(li);
        });
    }
    
    // Fonction pour gérer le jeu
    function playGame(playerChoice) {
        // Jouer le son correspondant au choix du joueur
        if (playerChoice === 'rock') {
            soundRock.play();
        } else if (playerChoice === 'paper') {
            soundPaper.play();
        } else {
            soundScissors.play();
        }
        
        // Animer le choix du joueur
        playerSelection.textContent = choiceIcons[playerChoice];
        playerSelection.classList.add('pop');
        
        // Simuler le temps de réflexion de l'ordinateur
        computerSelection.textContent = '🤔';
        computerSelection.classList.add('shake');
        
        // Désactiver les boutons temporairement
        choices.forEach(choice => {
            choice.disabled = true;
        });
        
        // Délai avant le choix de l'ordinateur
        setTimeout(() => {
            // Obtenir le choix de l'ordinateur
            const computerChoice = getComputerChoice();
            
            // Afficher le choix de l'ordinateur
            computerSelection.textContent = choiceIcons[computerChoice];
            computerSelection.classList.remove('shake');
            computerSelection.classList.add('pop');
            
            // Déterminer le gagnant
            const winner = getWinner(playerChoice, computerChoice);
            
            // Mettre à jour les scores
            if (winner === 'player') {
                scores.player++;
                result.textContent = 'Vous avez gagné!';
                result.className = 'result win';
                soundWin.play();
            } else if (winner === 'computer') {
                scores.computer++;
                result.textContent = 'L\'ordinateur a gagné!';
                result.className = 'result lose';
                soundLose.play();
            } else {
                scores.tie++;
                result.textContent = 'Égalité!';
                result.className = 'result tie';
                soundTie.play();
            }
            
            // Mettre à jour l'affichage des scores
            updateScores();
            
            // Mettre à jour l'historique
            updateHistory(playerChoice, computerChoice, winner);
            
            // Réactiver les boutons
            choices.forEach(choice => {
                choice.disabled = false;
            });
        }, 1000);
    }
    
    // Fonction pour réinitialiser le jeu
    function resetGame() {
        scores = {
            player: 0,
            computer: 0,
            tie: 0
        };
        
        gameHistory = [];
        
        playerSelection.textContent = '?';
        computerSelection.textContent = '?';
        result.textContent = 'Choisissez Pierre, Papier ou Ciseaux pour commencer';
        result.className = 'result';
        
        updateScores();
        renderHistory();
    }
    
    // Événements pour les choix
    choices.forEach(choice => {
        choice.addEventListener('click', () => {
            const playerChoice = choice.id;
            playGame(playerChoice);
            
            // Supprimer l'animation
            setTimeout(() => {
                playerSelection.classList.remove('pop');
                computerSelection.classList.remove('pop');
            }, 300);
        });
    });
    
    // Événement pour le bouton de réinitialisation
    resetBtn.addEventListener('click', resetGame);
    
    // Événement pour le bouton de changement de nom
    nameBtn.addEventListener('click', () => {
        nameModal.style.display = 'flex';
        playerNameInput.value = playerName;
        playerNameInput.focus();
    });
    
    // Événement pour le bouton de sauvegarde du nom
    saveNameBtn.addEventListener('click', () => {
        const newName = playerNameInput.value.trim();
        
        if (newName) {
            playerName = newName;
            playerLabel.textContent = playerName;
            nameModal.style.display = 'none';
            
            // Mettre à jour l'historique avec le nouveau nom
            renderHistory();
        }
    });
    
    // Permettre la validation par la touche Entrée
    playerNameInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            saveNameBtn.click();
        }
    });
    
    // Événement pour le bouton de changement de thème
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = 'Mode Clair';
        } else {
            themeToggle.textContent = 'Mode Sombre';
        }
    });
    
    // Afficher la boîte de dialogue du nom au chargement
    nameModal.style.display = 'flex';
});
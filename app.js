// Main application

import { CharacterManager } from './characters.js';
import { LocationManager } from './locations.js';
import { DialogManager } from './dialog.js';
import { GameState } from './gameState.js';
import { AudioManager } from './audio.js';
import { ImageGenerator } from './imageGenerator.js';

class Game {
    constructor() {
        this.state = new GameState();
        this.characterManager = new CharacterManager();
        this.locationManager = new LocationManager();
        this.dialogManager = new DialogManager(this);
        this.audioManager = new AudioManager();
        this.imageGenerator = new ImageGenerator();
        
        this.currentCharacter = null;
        this.currentLocation = null;
        
        this.screens = {
            loading: document.getElementById('loading-screen'),
            mainMenu: document.getElementById('main-menu'),
            settings: document.getElementById('settings-screen'),
            characterSelect: document.getElementById('character-select'),
            locationSelect: document.getElementById('location-select'),
            game: document.getElementById('game-screen')
        };
        
        this.elements = {
            loadingProgress: document.getElementById('loading-progress'),
            characterList: document.getElementById('character-list'),
            locationList: document.getElementById('location-list'),
            locationImage: document.getElementById('location-image'),
            characterImage: document.getElementById('character-image'),
            characterName: document.getElementById('character-name'),
            dialogText: document.getElementById('dialog-text'),
            choicesContainer: document.getElementById('choices-container'),
            ttsToggle: document.getElementById('tts-toggle')
        };
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        
        // Simulate loading
        await this.loadGame();
        
        // Check if a saved game exists
        const savedGame = localStorage.getItem('heartsJourneySave');
        if (savedGame) {
            document.getElementById('continue-btn').disabled = false;
        } else {
            document.getElementById('continue-btn').disabled = true;
        }
        
        this.showScreen('mainMenu');
    }
    
    async loadGame() {
        let progress = 0;
        const increment = 5;
        
        return new Promise(resolve => {
            const loadingInterval = setInterval(() => {
                progress += increment;
                this.elements.loadingProgress.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(loadingInterval);
                    setTimeout(() => {
                        resolve();
                    }, 500);
                }
            }, 150);
        });
    }
    
    setupEventListeners() {
        // Main menu buttons
        document.getElementById('new-game-btn').addEventListener('click', () => this.startNewGame());
        document.getElementById('continue-btn').addEventListener('click', () => this.continueGame());
        document.getElementById('settings-btn').addEventListener('click', () => this.showScreen('settings'));
        
        // Settings buttons
        document.getElementById('back-from-settings').addEventListener('click', () => this.showScreen('mainMenu'));
        this.elements.ttsToggle.addEventListener('change', (e) => {
            this.state.setTtsEnabled(e.target.checked);
        });
        
        // Character select back button
        document.getElementById('back-from-character-select').addEventListener('click', () => this.showScreen('mainMenu'));
        
        // Location select back button
        document.getElementById('back-from-location-select').addEventListener('click', () => this.showScreen('characterSelect'));
    }
    
    showScreen(screenName) {
        Object.keys(this.screens).forEach(key => {
            this.screens[key].classList.add('hidden');
        });
        
        this.screens[screenName].classList.remove('hidden');
        
        // Special screen setup
        if (screenName === 'characterSelect') {
            this.populateCharacterSelect();
        } else if (screenName === 'locationSelect') {
            this.populateLocationSelect();
        }
    }
    
    async startNewGame() {
        this.state.reset();
        await this.characterManager.initialize();
        await this.locationManager.initialize();
        this.showScreen('characterSelect');
    }
    
    continueGame() {
        try {
            const savedData = JSON.parse(localStorage.getItem('heartsJourneySave'));
            if (savedData) {
                this.state.load(savedData);
                this.currentCharacter = this.characterManager.getCharacterById(this.state.currentCharacterId);
                this.currentLocation = this.locationManager.getLocationById(this.state.currentLocationId);
                this.startDateScene();
            }
        } catch (error) {
            console.error('Error loading saved game:', error);
            this.startNewGame();
        }
    }
    
    async populateCharacterSelect() {
        this.elements.characterList.innerHTML = '';
        
        const characters = this.characterManager.getAllCharacters();
        for (const character of characters) {
            const charImage = await this.imageGenerator.generateCharacterImage(character);
            
            const charCard = document.createElement('div');
            charCard.className = 'character-card';
            charCard.innerHTML = `
                <img class="character-image" src="${charImage}" alt="${character.name}">
                <div class="character-info">
                    <div class="character-name">${character.name}</div>
                    <div>${character.age}</div>
                </div>
            `;
            
            charCard.addEventListener('click', () => {
                this.selectCharacter(character);
            });
            
            this.elements.characterList.appendChild(charCard);
        }
    }
    
    async populateLocationSelect() {
        this.elements.locationList.innerHTML = '';
        
        const locations = this.locationManager.getAllLocations();
        for (const location of locations) {
            const locImage = await this.imageGenerator.generateLocationImage(location);
            
            const locCard = document.createElement('div');
            locCard.className = 'location-card';
            locCard.innerHTML = `
                <img class="location-image" src="${locImage}" alt="${location.name}">
                <div class="location-name">${location.name}</div>
            `;
            
            locCard.addEventListener('click', () => {
                this.selectLocation(location);
            });
            
            this.elements.locationList.appendChild(locCard);
        }
    }
    
    selectCharacter(character) {
        this.currentCharacter = character;
        this.state.setCurrentCharacter(character.id);
        this.showScreen('locationSelect');
    }
    
    async selectLocation(location) {
        this.currentLocation = location;
        this.state.setCurrentLocation(location.id);
        
        // Save current game state
        this.state.save();
        
        await this.startDateScene();
    }
    
    async startDateScene() {
        this.showScreen('game');
        
        // Load character and location images
        const characterImg = await this.imageGenerator.generateCharacterImage(this.currentCharacter);
        const locationImg = await this.imageGenerator.generateLocationImage(this.currentLocation);
        
        this.elements.characterImage.src = characterImg;
        this.elements.locationImage.src = locationImg;
        
        // Start the dialog
        this.dialogManager.startDialog(this.currentCharacter, this.currentLocation);
    }
    
    updateDialog(character, text, choices) {
        this.elements.characterName.textContent = character ? character.name : '';
        this.elements.dialogText.textContent = text;
        
        // Clear previous choices
        this.elements.choicesContainer.innerHTML = '';
        
        // Add new choices if provided
        if (choices && choices.length > 0) {
            choices.forEach(choice => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.textContent = choice.text;
                btn.addEventListener('click', () => {
                    this.dialogManager.makeChoice(choice.id);
                });
                this.elements.choicesContainer.appendChild(btn);
            });
        }
        
        // Play text to speech if enabled
        if (this.state.isTtsEnabled && character) {
            this.audioManager.speak(text, character.voice);
        }
    }
    
    saveGame() {
        this.state.save();
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    // Make game available globally for debugging
    window.game = game;
});


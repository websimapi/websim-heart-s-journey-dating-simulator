// Game state management

export class GameState {
    constructor() {
        this.currentCharacterId = null;
        this.currentLocationId = null;
        this.isTtsEnabled = false;
        this.textSpeed = 5; // 1-10 scale
    }
    
    setCurrentCharacter(characterId) {
        this.currentCharacterId = characterId;
    }
    
    setCurrentLocation(locationId) {
        this.currentLocationId = locationId;
    }
    
    setTtsEnabled(enabled) {
        this.isTtsEnabled = enabled;
    }
    
    setTextSpeed(speed) {
        this.textSpeed = speed;
    }
    
    save() {
        const saveData = {
            currentCharacterId: this.currentCharacterId,
            currentLocationId: this.currentLocationId,
            isTtsEnabled: this.isTtsEnabled,
            textSpeed: this.textSpeed,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('heartsJourneySave', JSON.stringify(saveData));
    }
    
    load(saveData) {
        if (saveData) {
            this.currentCharacterId = saveData.currentCharacterId;
            this.currentLocationId = saveData.currentLocationId;
            this.isTtsEnabled = saveData.isTtsEnabled || false;
            this.textSpeed = saveData.textSpeed || 5;
        }
    }
    
    reset() {
        this.currentCharacterId = null;
        this.currentLocationId = null;
        // Don't reset preferences like TTS and text speed
    }
}


// Character management

export class CharacterManager {
    constructor() {
        this.characters = [];
        this.characterData = [
            {
                id: 'alex',
                name: 'Alex',
                gender: 'female',
                age: '24',
                bio: 'An ambitious photographer who loves adventure and the outdoors.',
                personality: 'Outgoing, passionate, spontaneous',
                interests: ['photography', 'hiking', 'travel'],
                seedId: 123,
                voice: 'female',
                memories: []
            },
            {
                id: 'jamie',
                name: 'Jamie',
                gender: 'male',
                age: '26',
                bio: 'A tech entrepreneur with a love for sci-fi and board games.',
                personality: 'Witty, thoughtful, slightly nerdy',
                interests: ['technology', 'gaming', 'coffee'],
                seedId: 456,
                voice: 'male',
                memories: []
            },
            {
                id: 'morgan',
                name: 'Morgan',
                gender: 'non-binary',
                age: '25',
                bio: 'A passionate chef who dreams of opening their own restaurant.',
                personality: 'Creative, warm, detail-oriented',
                interests: ['cooking', 'food culture', 'music'],
                seedId: 789,
                voice: 'neutral',
                memories: []
            },
            {
                id: 'taylor',
                name: 'Taylor',
                gender: 'female',
                age: '23',
                bio: 'A marine biologist with a contagious enthusiasm for ocean life.',
                personality: 'Bubbly, intelligent, environmentally conscious',
                interests: ['marine life', 'swimming', 'conservation'],
                seedId: 246,
                voice: 'female',
                memories: []
            },
            {
                id: 'kai',
                name: 'Kai',
                gender: 'male',
                age: '27',
                bio: 'A laid-back musician who plays in local venues on weekends.',
                personality: 'Relaxed, artistic, philosophical',
                interests: ['music', 'vintage records', 'stargazing'],
                seedId: 357,
                voice: 'male',
                memories: []
            }
        ];
    }
    
    async initialize() {
        // Load character data from local storage or use defaults
        const savedCharacters = localStorage.getItem('heartsJourneyCharacters');
        if (savedCharacters) {
            try {
                this.characters = JSON.parse(savedCharacters);
            } catch (error) {
                console.error('Error loading saved characters:', error);
                this.resetCharacters();
            }
        } else {
            this.resetCharacters();
        }
        
        return this.characters;
    }
    
    resetCharacters() {
        this.characters = [...this.characterData];
        this.saveCharacters();
    }
    
    saveCharacters() {
        localStorage.setItem('heartsJourneyCharacters', JSON.stringify(this.characters));
    }
    
    getAllCharacters() {
        return this.characters;
    }
    
    getCharacterById(id) {
        return this.characters.find(char => char.id === id);
    }
    
    updateCharacterMemory(characterId, memory) {
        const character = this.getCharacterById(characterId);
        if (character) {
            // Add timestamp to memory
            const memoryWithTimestamp = {
                ...memory,
                timestamp: new Date().toISOString()
            };
            
            // Add to memories array
            character.memories.push(memoryWithTimestamp);
            
            // Limit to the last 20 memories
            if (character.memories.length > 20) {
                character.memories = character.memories.slice(-20);
            }
            
            this.saveCharacters();
        }
    }
    
    getCharacterMemories(characterId) {
        const character = this.getCharacterById(characterId);
        return character ? character.memories : [];
    }
}


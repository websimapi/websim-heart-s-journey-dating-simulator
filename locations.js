// Location management

export class LocationManager {
    constructor() {
        this.locations = [];
        this.locationData = [
            {
                id: 'cafe',
                name: 'Cozy Café',
                description: 'A charming café with a warm atmosphere, perfect for a relaxed conversation.',
                mood: 'casual, relaxed, comfortable',
                seedId: 101,
                activities: ['coffee tasting', 'people watching', 'board games']
            },
            {
                id: 'beach',
                name: 'Sunset Beach',
                description: 'A beautiful beach with golden sands and a stunning sunset view.',
                mood: 'romantic, peaceful, scenic',
                seedId: 102,
                activities: ['walking along shore', 'watching sunset', 'picnic']
            },
            {
                id: 'park',
                name: 'Central Park',
                description: 'A vibrant park with lush greenery, winding paths and a small lake.',
                mood: 'refreshing, natural, active',
                seedId: 103,
                activities: ['boating', 'picnic', 'frisbee']
            },
            {
                id: 'restaurant',
                name: 'Moonlight Restaurant',
                description: 'An elegant restaurant with soft lighting and a sophisticated ambiance.',
                mood: 'romantic, upscale, intimate',
                seedId: 104,
                activities: ['fine dining', 'wine tasting', 'dancing']
            },
            {
                id: 'arcade',
                name: 'Retro Arcade',
                description: 'A fun-filled arcade with classic games and neon lights.',
                mood: 'playful, nostalgic, energetic',
                seedId: 105,
                activities: ['gaming competition', 'skee ball', 'air hockey']
            },
            {
                id: 'museum',
                name: 'Art Museum',
                description: 'A modern museum with diverse art collections and interactive exhibits.',
                mood: 'intellectual, cultural, inspiring',
                seedId: 106,
                activities: ['art appreciation', 'exhibition tour', 'sketching']
            }
        ];
    }
    
    async initialize() {
        // Load location data from local storage or use defaults
        const savedLocations = localStorage.getItem('heartsJourneyLocations');
        if (savedLocations) {
            try {
                this.locations = JSON.parse(savedLocations);
            } catch (error) {
                console.error('Error loading saved locations:', error);
                this.resetLocations();
            }
        } else {
            this.resetLocations();
        }
        
        return this.locations;
    }
    
    resetLocations() {
        this.locations = [...this.locationData];
        this.saveLocations();
    }
    
    saveLocations() {
        localStorage.setItem('heartsJourneyLocations', JSON.stringify(this.locations));
    }
    
    getAllLocations() {
        return this.locations;
    }
    
    getLocationById(id) {
        return this.locations.find(loc => loc.id === id);
    }
}


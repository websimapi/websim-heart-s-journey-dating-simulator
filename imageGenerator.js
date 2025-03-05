// Image generation using LLM

export class ImageGenerator {
    constructor() {
        this.characterImageCache = {};
        this.locationImageCache = {};
    }
    
    async generateCharacterImage(character) {
        // Check cache first
        if (this.characterImageCache[character.id]) {
            return this.characterImageCache[character.id];
        }
        
        try {
            // Generate a prompt based on character attributes
            const prompt = this.createCharacterPrompt(character);
            
            // Generate image using websim.imageGen
            const result = await websim.imageGen({
                prompt: prompt,
                seed: character.seedId, // Use character's seed for consistency
                aspect_ratio: "1:1"
            });
            
            // Store in cache
            this.characterImageCache[character.id] = result.url;
            return result.url;
        } catch (error) {
            console.error('Error generating character image:', error);
            // In case of failure, use a fallback or retry with simpler prompt
            return this.generateFallbackCharacterImage(character);
        }
    }
    
    async generateLocationImage(location) {
        // Check cache first
        if (this.locationImageCache[location.id]) {
            return this.locationImageCache[location.id];
        }
        
        try {
            // Generate a prompt based on location attributes
            const prompt = this.createLocationPrompt(location);
            
            // Generate image using websim.imageGen
            const result = await websim.imageGen({
                prompt: prompt,
                seed: location.seedId, // Use location's seed for consistency
                aspect_ratio: "16:9"
            });
            
            // Store in cache
            this.locationImageCache[location.id] = result.url;
            return result.url;
        } catch (error) {
            console.error('Error generating location image:', error);
            // In case of failure, use a fallback or retry with simpler prompt
            return this.generateFallbackLocationImage(location);
        }
    }
    
    createCharacterPrompt(character) {
        // Create a detailed prompt based on character attributes
        let gender = character.gender === 'non-binary' ? 'androgynous person' : character.gender;
        
        return `Portrait of an attractive ${gender} in their mid-twenties, ${character.bio} 
                They have a ${character.personality.split(',')[0].trim().toLowerCase()} expression.
                Professional photography, soft lighting, dating profile photo, high quality`;
    }
    
    createLocationPrompt(location) {
        // Create a detailed prompt based on location attributes
        return `A beautiful view of ${location.name}: ${location.description}
                The atmosphere is ${location.mood}.
                Wide angle shot, perfect for a date, romantic setting, high quality, detailed`;
    }
    
    async generateFallbackCharacterImage(character) {
        try {
            // Simpler fallback prompt
            const fallbackPrompt = `Portrait photo of a person, ${character.gender}, dating profile`;
            
            const result = await websim.imageGen({
                prompt: fallbackPrompt,
                seed: character.seedId,
                aspect_ratio: "1:1"
            });
            
            this.characterImageCache[character.id] = result.url;
            return result.url;
        } catch (error) {
            console.error('Fallback character image generation failed:', error);
            // Return a placeholder or error image URL
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14'%3EImage unavailable%3C/text%3E%3C/svg%3E";
        }
    }
    
    async generateFallbackLocationImage(location) {
        try {
            // Simpler fallback prompt
            const fallbackPrompt = `A photo of ${location.name}`;
            
            const result = await websim.imageGen({
                prompt: fallbackPrompt,
                seed: location.seedId,
                aspect_ratio: "16:9"
            });
            
            this.locationImageCache[location.id] = result.url;
            return result.url;
        } catch (error) {
            console.error('Fallback location image generation failed:', error);
            // Return a placeholder or error image URL
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14'%3ELocation image unavailable%3C/text%3E%3C/svg%3E";
        }
    }
}


// Audio management including text to speech

export class AudioManager {
    constructor() {
        this.isSpeaking = false;
        this.speechSynthesis = window.speechSynthesis;
        this.availableVoices = [];
        this.isVoicesLoaded = false;
        
        // Load available voices
        this.loadVoices();
    }
    
    loadVoices() {
        // Some browsers need a slight delay before voices are available
        setTimeout(() => {
            this.availableVoices = this.speechSynthesis.getVoices();
            this.isVoicesLoaded = true;
            
            // Map voices to categories
            this.categorizeVoices();
        }, 100);
        
        // For Chrome and other browsers that fire the voiceschanged event
        this.speechSynthesis.onvoiceschanged = () => {
            this.availableVoices = this.speechSynthesis.getVoices();
            this.isVoicesLoaded = true;
            this.categorizeVoices();
        };
    }
    
    categorizeVoices() {
        this.femaleVoices = this.availableVoices.filter(voice => 
            voice.name.includes('female') || 
            voice.name.includes('girl') || 
            voice.name.includes('woman') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('victoria') ||
            voice.name.toLowerCase().includes('karen')
        );
        
        this.maleVoices = this.availableVoices.filter(voice => 
            voice.name.includes('male') || 
            voice.name.includes('boy') || 
            voice.name.includes('man') ||
            voice.name.toLowerCase().includes('daniel') ||
            voice.name.toLowerCase().includes('david') ||
            voice.name.toLowerCase().includes('tom')
        );
        
        // Voices that don't clearly fit into female or male categories
        this.neutralVoices = this.availableVoices.filter(voice => 
            !this.femaleVoices.includes(voice) && 
            !this.maleVoices.includes(voice)
        );
    }
    
    getVoiceForCharacter(characterVoiceType) {
        if (!this.isVoicesLoaded) {
            return null;
        }
        
        let voices;
        switch (characterVoiceType) {
            case 'female':
                voices = this.femaleVoices.length > 0 ? this.femaleVoices : this.neutralVoices;
                break;
            case 'male':
                voices = this.maleVoices.length > 0 ? this.maleVoices : this.neutralVoices;
                break;
            default:
                voices = this.neutralVoices;
        }
        
        // Return a random voice from the appropriate category
        return voices.length > 0 ? voices[Math.floor(Math.random() * voices.length)] : null;
    }
    
    speak(text, characterVoiceType) {
        // Stop any current speech
        this.stop();
        
        if (!this.isVoicesLoaded) {
            // If voices aren't loaded yet, try again in a moment
            setTimeout(() => this.speak(text, characterVoiceType), 100);
            return;
        }
        
        const voice = this.getVoiceForCharacter(characterVoiceType);
        if (!voice) {
            console.warn('No suitable voice found for TTS');
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        // Set event handlers
        utterance.onstart = () => {
            this.isSpeaking = true;
        };
        
        utterance.onend = () => {
            this.isSpeaking = false;
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.isSpeaking = false;
        };
        
        // Start speaking
        this.speechSynthesis.speak(utterance);
    }
    
    stop() {
        if (this.isSpeaking) {
            this.speechSynthesis.cancel();
            this.isSpeaking = false;
        }
    }
}


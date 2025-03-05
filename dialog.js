// Dialog management

export class DialogManager {
    constructor(game) {
        this.game = game;
        this.currentDialog = null;
        this.dialogHistory = [];
        this.currentChoices = [];
    }
    
    async startDialog(character, location) {
        // Get character memories
        const memories = this.game.characterManager.getCharacterMemories(character.id);
        const hasMetBefore = memories.length > 0;
        
        // Generate appropriate dialog based on character, location, and relationship
        let dialogContext = {
            character: character,
            location: location,
            hasMetBefore: hasMetBefore,
            memories: memories
        };
        
        let initialDialog;
        
        if (hasMetBefore) {
            initialDialog = await this.generateReunionDialog(dialogContext);
        } else {
            initialDialog = await this.generateFirstMeetingDialog(dialogContext);
        }
        
        this.showDialog(character, initialDialog);
    }
    
    async generateFirstMeetingDialog(context) {
        const { character, location } = context;
        
        // In a real app, this could use an LLM to generate dialog
        // For now, we'll use template strings
        
        let dialog = `Hi there! I'm ${character.name}. It's nice to meet you. 
                      This ${location.name} is a great place to get to know someone. 
                      What made you decide to come here today?`;
                      
        const choices = [
            { id: 'compliment', text: `I heard it's a nice place, but meeting you is the highlight.` },
            { id: 'honest', text: `I've always wanted to check out ${location.name}. What about you?` },
            { id: 'nervous', text: `I'm actually a bit nervous about first dates. Is it that obvious?` }
        ];
        
        // Add the first interaction to character's memory
        this.game.characterManager.updateCharacterMemory(character.id, {
            type: 'meeting',
            location: location.id,
            note: `Met for the first time at ${location.name}.`
        });
        
        return { text: dialog, choices };
    }
    
    async generateReunionDialog(context) {
        const { character, location, memories } = context;
        
        // Sort memories by timestamp
        const sortedMemories = [...memories].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        const lastMeeting = sortedMemories[0];
        const lastLocation = this.game.locationManager.getLocationById(lastMeeting.location);
        
        // In a real app, this could use an LLM to generate dialog
        // For now, we'll use template strings
        
        let dialog = `Hey there! It's great to see you again. 
                      Last time we met at ${lastLocation.name}, right? 
                      I've been looking forward to spending time at ${location.name} with you.`;
                      
        const choices = [
            { id: 'remember', text: `I remember! We had a great time. How have you been?` },
            { id: 'flirt', text: `You look even more amazing than I remembered.` },
            { id: 'activity', text: `I thought we could try ${location.activities[0]} while we're here.` }
        ];
        
        // Add this reunion to character's memory
        this.game.characterManager.updateCharacterMemory(character.id, {
            type: 'reunion',
            location: location.id,
            note: `Met again at ${location.name}.`
        });
        
        return { text: dialog, choices };
    }
    
    showDialog(character, dialog) {
        this.currentDialog = dialog;
        this.currentChoices = dialog.choices;
        this.game.updateDialog(character, dialog.text, dialog.choices);
        
        // Add to dialog history
        this.dialogHistory.push({
            speaker: character.id,
            text: dialog.text
        });
    }
    
    async makeChoice(choiceId) {
        const choice = this.currentChoices.find(c => c.id === choiceId);
        if (!choice) return;
        
        // Add player's choice to dialog history
        this.dialogHistory.push({
            speaker: 'player',
            text: choice.text
        });
        
        // Generate character response based on the choice
        const character = this.game.currentCharacter;
        const location = this.game.currentLocation;
        
        const response = await this.generateResponse(character, location, choice);
        
        // Show the response
        this.showDialog(character, response);
        
        // Save game after each interaction
        this.game.saveGame();
    }
    
    async generateResponse(character, location, playerChoice) {
        // In a real app, this would use an LLM to generate appropriate responses
        // For now, we'll use predefined responses based on choice types
        
        let response = { text: '', choices: [] };
        
        switch (playerChoice.id) {
            case 'compliment':
                response.text = `That's very sweet of you to say! I'm flattered. 
                                 I like your confidence. What do you usually do for fun?`;
                response.choices = [
                    { id: 'hobby', text: `I enjoy ${character.interests[0]}, actually! I heard you might too?` },
                    { id: 'outdoor', text: `I love being outdoors, especially hiking and exploring.` },
                    { id: 'relax', text: `Usually just relaxing with a good book or movie. Simple pleasures.` }
                ];
                break;
                
            case 'honest':
                response.text = `I've been wanting to visit ${location.name} for a while too! 
                                 It's as nice as people say. Are you having a good time so far?`;
                response.choices = [
                    { id: 'yes', text: `Absolutely! It's even better with your company.` },
                    { id: 'neutral', text: `It's nice. What would you recommend doing here?` },
                    { id: 'nervous', text: `I am, though I'm a bit nervous still. You're easy to talk to.` }
                ];
                break;
                
            case 'nervous':
                response.text = `Don't worry about it! I get nervous on dates too. 
                                 It's actually endearing. Should we try ${location.activities[0]} to break the ice?`;
                response.choices = [
                    { id: 'agree', text: `That sounds perfect! I'd love to.` },
                    { id: 'alternative', text: `How about ${location.activities[1]} instead?` },
                    { id: 'talk', text: `I'd rather just talk and get to know you better first.` }
                ];
                break;
                
            case 'remember':
                response.text = `I've been doing well! Been busy with ${character.interests[0]} lately. 
                                 It's really good to see you again. What have you been up to?`;
                response.choices = [
                    { id: 'busy', text: `Been busy with work, but always making time for fun dates like this.` },
                    { id: 'thinking', text: `Honestly? Thinking about when I'd see you again.` },
                    { id: 'hobby', text: `I've been getting into ${character.interests[1]} recently.` }
                ];
                break;
                
            case 'flirt':
                response.text = `*blushes* You're not so bad yourself. 
                                 I was hoping we'd connect as well as last time. Should we order something?`;
                response.choices = [
                    { id: 'order', text: `How about we try their specialty?` },
                    { id: 'recommend', text: `What would you recommend?` },
                    { id: 'your_treat', text: `I'd love to! My treat this time.` }
                ];
                break;
                
            case 'activity':
                response.text = `${location.activities[0]} sounds fun! I love how you always have ideas. 
                                 Have you done this before, or is this new for you too?`;
                response.choices = [
                    { id: 'first_time', text: `First time! I thought it would be fun to try together.` },
                    { id: 'experienced', text: `I've done it before, but it's more fun sharing the experience.` },
                    { id: 'your_pace', text: `It's new to me. I'll follow your lead if you know how.` }
                ];
                break;
                
            default:
                response.text = `That's interesting! So, what else would you like to do while we're here at ${location.name}?`;
                response.choices = [
                    { id: 'suggest', text: `How about we try ${location.activities[2]}?` },
                    { id: 'know_you', text: `I'd love to hear more about your interest in ${character.interests[0]}.` },
                    { id: 'surprise', text: `Surprise me! What do you enjoy doing here?` }
                ];
        }
        
        // Add this interaction to character's memory
        this.game.characterManager.updateCharacterMemory(character.id, {
            type: 'conversation',
            playerChoice: playerChoice.id,
            characterResponse: response.text.substring(0, 50) + '...',
            location: location.id
        });
        
        return response;
    }
}


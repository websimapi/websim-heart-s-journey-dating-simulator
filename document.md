# Heart's Journey: Mobile Dating Simulator

## Overview
Heart's Journey is an immersive, mobile-compatible dating simulator that allows players to experience romantic encounters with diverse characters in various settings. The game features advanced AI integration for image generation, character interactions, and optional text-to-speech functionality.

## Key Features

### Mobile Compatibility
- Responsive design that works seamlessly across smartphones, tablets, and desktop devices
- Touch-optimized interface with appropriately sized buttons and controls
- Adaptive layouts that adjust to different screen orientations and sizes

### AI-Powered Image Generation
- Dynamic character portraits generated based on character attributes
- Location images rendered to match the setting descriptions
- Consistent visuals maintained through seed-based image generation
- Automatic fallback image generation if primary generation fails

### Multiple Characters
- Five unique dateable characters with distinct personalities, interests, and backgrounds:
  - Alex: An ambitious photographer who loves adventure and the outdoors
  - Jamie: A tech entrepreneur with a love for sci-fi and board games
  - Morgan: A passionate chef who dreams of opening their own restaurant
  - Taylor: A marine biologist with contagious enthusiasm for ocean life
  - Kai: A laid-back musician who plays in local venues on weekends

### Memory System
- Characters remember previous interactions and dates
- Dialogue options reflect the evolving relationship between player and characters
- Past choices influence future conversations and character responses
- Memory system stores up to 20 recent interactions per character

### Diverse Locations
- Six unique dating locations with different atmospheres and activities:
  - Cozy Café: A charming café with a warm atmosphere
  - Sunset Beach: A beautiful beach with golden sands and stunning views
  - Central Park: A vibrant park with lush greenery and a small lake
  - Moonlight Restaurant: An elegant restaurant with sophisticated ambiance
  - Retro Arcade: A fun-filled arcade with classic games and neon lights
  - Art Museum: A modern museum with diverse art collections

### Text-to-Speech Integration
- Optional voice narration for character dialogue
- Intelligent voice assignment based on character gender
- Utilizes browser-native speech synthesis for wide compatibility
- Adjustable settings for speech rate and pitch

### Save System
- Automatic game state saving after each interaction
- Persistent character memories and relationship progression
- Option to continue from previous sessions or start new games

## Technical Implementation

### Image Generation System
- Uses AI language model capabilities to generate character and location images
- Implements seed values to maintain consistent visuals across multiple sessions
- Creates detailed prompts based on character and location attributes
- Caches generated images to improve performance and reduce API calls

### Character Management
- Stores detailed character profiles including personality traits, interests, and demographics
- Manages character memory system to track player interactions
- Provides interfaces for retrieving and updating character information
- Ensures persistent storage across game sessions

### Dialogue System
- Generates contextually appropriate dialogue based on:
  - Character personality and interests
  - Current location and available activities
  - Relationship history and past interactions
  - Player's previous choices
- Provides meaningful choice options that influence relationship development
- Supports both first meetings and reunion scenarios

### Text-to-Speech System
- Categorizes available voices into female, male, and neutral groups
- Matches character gender with appropriate voice categories
- Handles browser compatibility issues for speech synthesis
- Provides controls for enabling/disabling voice narration

### User Interface
- Clean, intuitive interface with distinct screens for different game phases
- Visually appealing character and location selection cards
- Immersive game screen with location background and character portrait
- Dialogue box with character name, text, and choice options
- Settings menu for adjusting game preferences

## User Experience Flow

1. **Loading Screen**
   - Initial game assets and data preparation
   - Progress bar showing loading status

2. **Main Menu**
   - Options to start new game, continue saved game, or adjust settings
   - Attractive title and background

3. **Character Selection**
   - Visual cards for each dateable character
   - Brief character information to guide player choice

4. **Location Selection**
   - Visual cards for each potential date location
   - Location names and preview images

5. **Dating Simulation**
   - Immersive scene with location background
   - Character portrait overlaid on the scene
   - Dialogue box showing character name and text
   - Choice options for player responses
   - Automatic saving of progress

6. **Settings**
   - Text-to-speech toggle
   - Text speed adjustment
   - Return to main menu option

## Future Enhancement Possibilities

- Additional characters with more diverse backgrounds and interests
- New locations and date activities
- Mini-games during dates to increase engagement
- Character relationship status tracking and milestone events
- Expanded dialogue options and branching storylines
- Enhanced character customization options
- Background music and sound effects
- Achievements and rewards system
- Social sharing features


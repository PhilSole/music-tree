import * as Tone from 'tone';
import noteConfig from './config-note.js';

export function constructMusicTree() {

    const idealWidth = 1372; 
    const idealHeight = 1071;

    let musicTree = document.querySelector('.music-tree');
    musicTree.style.width = idealWidth + 'px';
    musicTree.style.height = idealHeight + 'px';

    function updateScale() {   
        const scaleX = window.innerWidth / idealWidth;
        const scaleY = window.innerHeight / idealHeight;
    
        // Use the smaller of the two scales to ensure the entire interface fits
        const scaleFactor = Math.min(scaleX, scaleY);
        
        // Update the scale factor
        document.documentElement.style.setProperty('--scale-factor', scaleFactor);
    }
    
    // Set initial scale on load
    updateScale();

    // Update the scale when the window is resized
    window.addEventListener('resize', updateScale);    

    let treeCentre = [694, 490];
    let triangleSide = 220;
    let longSide = Math.sin(1.0472) * triangleSide;
    let shortSide = Math.cos(1.0472) * triangleSide;

    noteConfig.forEach(note => {
        const button = document.createElement('button');
        button.textContent = note.ratio;
        button.dataset.ratio = note.ratio;

        const buttonScale = 1 / note.ratio * 100 + 'px';
        button.style.width = buttonScale;
        button.style.height = buttonScale;
        button.style.lineHeight = buttonScale;

        let buttonX = treeCentre[0] + note.position[2] * longSide - note.position[0] * longSide;
        let buttonY = treeCentre[1] - note.position[1] * triangleSide - note.position[2] * shortSide - note.position[0] * shortSide;

        button.style.left = buttonX + 'px';
        button.style.top = buttonY + 'px';

        button.classList.add('music-note');
        musicTree.appendChild(button);
    });



    const noteState = {};

    let rootFrequency = 166;

    const polySynth = new Tone.PolySynth(Tone.Synth, {
        envelope: {
            attack: 0.01,  // Time it takes for the sound to reach its peak level
            decay: 0.2,    // Time it takes for the sound to decay down to the sustain level
            sustain: 0.5,  // Sustain level (0 to 1)
            release: 2     // Time it takes for the sound to fade out after releasing the note
        }
    }).toDestination();




    function playNote(ratio) {
        const frequency = ratio * rootFrequency;
        polySynth.triggerAttack(frequency);
    }

    function stopNote(ratio) {
        const frequency = ratio * rootFrequency;
        polySynth.triggerRelease(frequency);
    }
































    // Keep track of pressed keys
    let activeKeys = {};

    // Handle keydown and keyup for keyboard control
    document.addEventListener('keydown', (event) => {
        const pressedKey = event.key.toLowerCase();
        const note = noteConfig.find(n => n.key.toLowerCase() === pressedKey);

        let keyMultiplier = keyMap[event.key];

        // If the key is mapped and not already active
        if (keyMultiplier && !activeKeys[event.key]) {
            activeKeys[event.key] = true;  // Mark the key as active
            playSound(keyMultiplier * rootFrequency);
        }

    });

    document.addEventListener('keyup', (event) => {
        let keyMultiplier = keyMap[event.key];

        // If the key is mapped and is active
        if (keyMultiplier && activeKeys[event.key]) {
            stopSound(keyMultiplier * rootFrequency);
            activeKeys[event.key] = false;  // Mark the key as inactive
        }
    });
}
  
import * as Tone from 'tone';
import noteConfig from './config-note.js';

export function constructMusicTree() {

    let rootFrequency = 166;

    const polySynth = new Tone.PolySynth(Tone.Synth, {
        envelope: {
            attack: 0.01,  // Time it takes for the sound to reach its peak level
            decay: 0.2,    // Time it takes for the sound to decay down to the sustain level
            sustain: 0.5,  // Sustain level (0 to 1)
            release: 2     // Time it takes for the sound to fade out after releasing the note
        }
    }).toDestination();


    noteConfig.forEach(note => {
        console.log(note.note);
    })


    let keyMap = {
        f: 1,
        t: 1.5,
        g: 1.25,
        c: .666,
        r: 1.2
    }  

    // Keep track of pressed keys
    let activeKeys = {};

    // Handle keydown and keyup for keyboard control
    document.addEventListener('keydown', (event) => {
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








    let musicTree = document.querySelector('.music-tree-interface');

    console.log(musicTree);


    
}
  
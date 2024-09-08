import * as Tone from 'tone';
import noteConfig from './config-note.js';

export function constructMusicTree() {

    let musicTree = document.querySelector('.music-tree-interface');
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


    noteConfig.forEach(note => {
        const button = document.createElement('button');
        button.textContent = note.ratio;
        button.dataset.ratio = note.ratio;
        button.classList.add('music-note');
        musicTree.appendChild(button);
    });

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
  
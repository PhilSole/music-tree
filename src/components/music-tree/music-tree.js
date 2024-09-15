import * as Tone from 'tone';
import noteConfig from './config-notes.js';

export function createMusicTree() {

    const idealWidth = 1372; // 1372 with .444 button
    const idealHeight = 1200; // 1071 with .444 button

    let musicTree = document.querySelector('.music-tree');

    function updateScale() {   
        const scaleX = document.documentElement.clientWidth / idealWidth;
        const scaleY = window.innerHeight / idealHeight;

        let scaleFactor = Math.min(scaleX, scaleY);

        musicTree.style.width = idealWidth * scaleFactor + 'px';
        musicTree.style.height = idealHeight * scaleFactor + 'px';    
        
        // Update the scale factor
        document.documentElement.style.setProperty('--scale-factor', scaleFactor);
    }
    
    // Set initial scale on load
    updateScale();

    // Update the scale when the window is resized
    window.addEventListener('resize', updateScale);    

    let treeCentre = [694, 700]; // [694, 490] with .444 button
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
        button.style.lineHeight = 1 / note.ratio * 90 + 'px';

        let buttonX = treeCentre[0] + note.position[2] * longSide - note.position[0] * longSide;
        let buttonY = treeCentre[1] - note.position[1] * triangleSide - note.position[2] * shortSide - note.position[0] * shortSide;

        button.style.left = buttonX + 'px';
        button.style.top = buttonY + 'px';

        button.classList.add('music-note');
        musicTree.appendChild(button);

        const buttonChordMaj = document.createElement('button');
        buttonChordMaj.dataset.ratio = note.ratio;
        buttonChordMaj.dataset.quality = 'major';
        buttonChordMaj.style.left = buttonX + 'px';
        buttonChordMaj.style.top = buttonY + 'px';

        buttonChordMaj.classList.add('music-chord');
        musicTree.appendChild(buttonChordMaj);

        const buttonChordMin = document.createElement('button');
        buttonChordMin.dataset.ratio = note.ratio;
        buttonChordMin.dataset.quality = 'minor';
        buttonChordMin.style.left = buttonX + 'px';
        buttonChordMin.style.top = buttonY + 'px';

        buttonChordMin.classList.add('music-chord');
        musicTree.appendChild(buttonChordMin);
    });




// ====================================================================================
//  Interactivity and tone.js
// ====================================================================================
Tone.getContext().lookAhead = .1;
console.log(Tone.getContext());

    const noteState = {};   

    let rootFrequency = 166;

    const polySynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
            type: "sine",
            modulationType: "sine"
        },
        envelope: {
            attack: 0.05,
            decay: 0.2,
            sustain: 0.5,
            release: 2
        }
    }).toDestination();

    let isMouseDownOrTouching  = false;

    musicTree.addEventListener('mousedown', handleStart);
    musicTree.addEventListener('touchstart', handleStart);

    document.addEventListener('mouseup', function(event) {
        isMouseDown = false;

        console.log(isMouseDown);

        if (event.target && event.target.classList.contains('music-note')) {
            const ratio = event.target.dataset.ratio;
            stopNote(ratio);
        } else if (event.target && event.target.classList.contains('music-chord')) {
            const ratio = event.target.dataset.ratio;
            const quality = event.target.dataset.quality;

            switch (quality) {
                case 'major':
                    stopNote(ratio * 1.25);
                    break;
                case 'minor':
                    stopNote(ratio * 1.2);
                    break;
                default:
                    break;
            }
             
            stopNote(ratio);
            stopNote(ratio * 1.5);
        }
    }); 
    
    musicTree.addEventListener('mouseenter', function(event) {
        if (event.target && event.target.classList.contains('music-note') && isMouseDown) {
            const ratio = event.target.dataset.ratio;
            playNote(ratio);  // Play the note when entering a new button while the mouse is down
        }
    }, true);
    
    musicTree.addEventListener('mouseout', function(event) {
        if (event.target && event.target.classList.contains('music-note')) {
            const ratio = event.target.dataset.ratio;
            stopNote(ratio); 
        }
    });  
    
    // Function to handle starting interaction (mousedown or touchstart)
    function handleStart(event) {
        isMouseDownOrTouching = true;
    
        if (event.target && event.target.classList.contains('music-note')) {
            const ratio = event.target.dataset.ratio;
            playNote(ratio); 
        } else if (event.target && event.target.classList.contains('music-chord')) {
            const ratio = event.target.dataset.ratio;
            const quality = event.target.dataset.quality;

            const root = ratio * rootFrequency;
            const perfectFifth = root * 1.5;
            const majorThird = root * 1.25;

            switch (quality) {
                case 'major':
                    // playNote(ratio * 1.25);

                    // polySynth.triggerAttack(majorThird, Tone.now(), .3);
                    polySynth.triggerAttack([root, perfectFifth, majorThird], Tone.now() + .1, 0.3);
                    polySynth.triggerRelease([root, perfectFifth, majorThird],
                        Tone.now() + 1);
                    break;
                case 'minor':
                    // playNote(ratio * 1.2);
                    break;
                default:
                    break;
            }

        
             
            // playNote(ratio);
            // playNote(ratio * 1.5);
        }
    } 
    
    function handleEnd() {
        if (isMouseDownOrTouching) {
            isMouseDownOrTouching = false;  // Reset the flag
            stopAllNotes();  // Stop all notes when interaction ends
        }
    }    


    function playNote(ratio) {
        const frequency = ratio * rootFrequency;
        polySynth.triggerAttack(frequency, Tone.now() + .1, .4);
    }

    function stopNote(ratio) {
        const frequency = ratio * rootFrequency;
        polySynth.triggerRelease(frequency);
    }

    function stopAllNotes() {
        polySynth.releaseAll(); 
    }    
































    // // Keep track of pressed keys
    // let activeKeys = {};

    // // Handle keydown and keyup for keyboard control
    // document.addEventListener('keydown', (event) => {
    //     const pressedKey = event.key.toLowerCase();
    //     const note = noteConfig.find(n => n.key.toLowerCase() === pressedKey);

    //     let keyMultiplier = keyMap[event.key];

    //     // If the key is mapped and not already active
    //     if (keyMultiplier && !activeKeys[event.key]) {
    //         activeKeys[event.key] = true;  // Mark the key as active
    //         playSound(keyMultiplier * rootFrequency);
    //     }

    // });

    // document.addEventListener('keyup', (event) => {
    //     let keyMultiplier = keyMap[event.key];

    //     // If the key is mapped and is active
    //     if (keyMultiplier && activeKeys[event.key]) {
    //         stopSound(keyMultiplier * rootFrequency);
    //         activeKeys[event.key] = false;  // Mark the key as inactive
    //     }
    // });
}
  
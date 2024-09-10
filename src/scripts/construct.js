import * as Tone from 'tone';
import noteConfig from './config-note.js';

export function constructMusicTree() {

    const idealWidth = 1372; 
    const idealHeight = 1071;

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




// ====================================================================================
//  Interactivity and tone.js
// ====================================================================================

    const noteState = {};

    let rootFrequency = 83;

    const polySynth = new Tone.PolySynth(Tone.Synth, {
        envelope: {
            attack: 0.01,
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
        polySynth.triggerAttack(frequency);
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
  
import * as Tone from 'tone';
import noteConfig from './config-notes.js';
import './music-tree.scss';

export function createMusicTree() {

    const idealWidth = 1372; // 1372 with .444 button
    const idealHeight = 1200; // 1071 with .444 button

    let musicTreeWrap = document.querySelector('.music-tree-wrap');
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

// ====================================================================
//  BUILDING THE INSTRUMENT TONE
// ====================================================================
    const polySynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
            type: "custom",
            detune: 0,
            phase: 0,
            partials: [1, .125, .0625],
            volume: -12
        },
        envelope: {
            attack: 0.1,
            decay: .1,
            sustain: 1,
            release: 2
        }
    }).toDestination();

    const compressor = new Tone.Compressor({
        threshold: -100,  // Level above which compression is applied
        ratio: 10,        // Compression ratio (how much to reduce the peaks)
        attack: 0.07,    // How quickly compression starts
        release: 0.2     // How quickly compression stops after the peak
    }).toDestination();    

    const filter = new Tone.Filter({
        frequency: 50,  // Start filtering above 2000 Hz
        type: "lowpass",
        rolloff: -12,     // Smoother transition with moderate rolloff
        Q: 1              // Low resonance for a natural sound
    }).toDestination();

    const feedbackDelay = new Tone.FeedbackDelay({
        delayTime: "1n",  // Delay time (eighth note)
        feedback: 0.125,    // 50% feedback for multiple echoes
        wet: 0.125          // Mix between dry and wet signal
    }).toDestination();

    const chorus = new Tone.Chorus(1, 1, .125).toDestination().start(); // frequency, delay (ms), depth
    
    const dist = new Tone.Distortion(0.0125).toDestination();
    
    const pingPong = new Tone.PingPongDelay({
        delayTime: "8n",
        feedback: .75,
        wet: .95
    }).toDestination();
    
    const reverb = new Tone.Reverb({
        decay: 6,       // Length of the reverb tail (in seconds)
        preDelay: .2, // Short pre-delay for a natural feel
        wet: 1        // Mix between dry and wet signal (0 to 1)
    }).toDestination();
    
    const tremolo = new Tone.Tremolo(2, 1).toDestination().start();

    // polySynth.connect(filter);
    // polySynth.connect(chorus);
    // polySynth.connect(dist);
    // polySynth.connect(pingPong);
    // polySynth.connect(reverb);
    // polySynth.connect(tremolo);
    // polySynth.connect(feedbackDelay);
    // polySynth.connect(compressor);


    // ====================================================================================
    //  Interactivity and tone.js
    // ====================================================================================
    Tone.getContext().lookAhead = .1; // kind of like a buffer. 0.1 is default

    const noteState = {};   

    let rootFrequency = 166;

    let isMouseDownOrTouching  = false;
    
    musicTreeWrap.addEventListener('mousedown', handleStart);
    musicTreeWrap.addEventListener('touchstart', handleStart);

    function handleStart(event) {
        isMouseDownOrTouching = true;
    
        if (event.target.classList.contains('music-note')) {
            const ratio = event.target.dataset.ratio;
            const note = ratio * rootFrequency;

            polySynth.triggerAttack(note, Tone.now());

        } else if (event.target.classList.contains('music-chord')) {
            const ratio = event.target.dataset.ratio;
            const quality = event.target.dataset.quality;

            const root = ratio * rootFrequency;
            const perfectFifth = root * 1.5;
            let third = root * 1.25;
            
            if(quality == 'minor') {
                third = root * 1.2;
            }

            polySynth.triggerAttack(root, Tone.now(), .5);
            polySynth.triggerAttack(perfectFifth, Tone.now() + .001, .5);
            polySynth.triggerAttack(third, Tone.now() + .002, .5);
        }
    }
    
    document.addEventListener('mouseup', function(event) {
        isMouseDownOrTouching  = false;
        polySynth.releaseAll();
    }); 
    
    musicTreeWrap.addEventListener('mouseenter', function(event) {
        if (isMouseDownOrTouching && event.target.classList.contains('music-note')) {
            const ratio = event.target.dataset.ratio;
            const note = ratio * rootFrequency;
            polySynth.triggerAttack(note, Tone.now());
        }
    }, true);
    
    musicTreeWrap.addEventListener('mouseout', function(event) {
        if (isMouseDownOrTouching && event.target.classList.contains('music-note')) {
            const ratio = event.target.dataset.ratio;
            const note = ratio * rootFrequency;
            polySynth.triggerRelease(note);

        } else if (isMouseDownOrTouching && event.target.classList.contains('music-chord')) {
            const ratio = event.target.dataset.ratio;
            const quality = event.target.dataset.quality;

            const root = ratio * rootFrequency;
            const perfectFifth = root * 1.5;
            let third = root * 1.25;
            
            if(quality == 'minor') {
                third = root * 1.2;
            }

            polySynth.triggerRelease(root);
            polySynth.triggerRelease(perfectFifth);
            polySynth.triggerRelease(third);
        }
    });      





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
  
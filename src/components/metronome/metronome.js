// components/metronome/metronome.js
import './metronome.scss';
import { createSelect } from '../shared/select/select.js';
import * as Tone from 'tone';

export function createMetronome(container) {

    container = document.querySelector(container);
    // Create the metronome container
    const metronomeContainer = document.createElement('div');
    metronomeContainer.className = 'metronome';

    // Create and append the tap button
    const tapButton = document.createElement('button');
    tapButton.className = 'tap-button';
    tapButton.textContent = 'Tap Tempo';
    metronomeContainer.appendChild(tapButton);

    // Create and append the start/stop button
    const startStopButton = document.createElement('button');
    startStopButton.className = 'start-stop-button';
    startStopButton.textContent = 'Start Metronome'; // Initially set to 'Start'
    metronomeContainer.appendChild(startStopButton);    

    // Create and append the BPM display
    const bpmDisplay = document.createElement('p');
    bpmDisplay.className = 'bpm-display';
    bpmDisplay.textContent = 'BPM: 120'; // Default BPM
    metronomeContainer.appendChild(bpmDisplay);

    // Create and append the beats per bar select (1 to 7)
    const beatsOptions = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' }, // Default to 4
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '7', label: '7' }
    ];

    let beatsPerBar = 4; // Default beats per bar is 4
    const beatsPerBarSelect = createSelect(beatsOptions, (value) => {
        beatsPerBar = parseInt(value);  // Update the beats per bar
        console.log('Beats per bar changed to:', beatsPerBar);

        // Update the time signature in Tone.js (this only adjusts the beats, not the note length)
        Tone.getTransport().timeSignature = [beatsPerBar, 4];
    });

    // Set the default value of the select to 4 beats per bar
    beatsPerBarSelect.value = '4'; // Ensure the select shows "4" on load
    metronomeContainer.appendChild(beatsPerBarSelect);

    // Append the metronome container to the main container (or body if none is provided)
    container.appendChild(metronomeContainer);


    // Initialize the BPM and metronome logic
    let currentBPM = 120;
    let tapTimes = [];  // To store the times of each tap
    let metronomeRunning = false; // To track the metronome state

    // Subtle "click" sound for regular beats using white noise
    const clickSynth = new Tone.NoiseSynth({
        noise: {
            type: 'pink'  // White noise for soft sound
        },
        envelope: {
            attack: 0.001,
            decay: 0.006,  // Quick decay for short click
            sustain: 0,
            release: 0.02  // Short release for clickiness
        }
    }).toDestination();

    // Slightly longer, softer white noise for accent
    const accentSynth = new Tone.NoiseSynth({
        noise: {
            type: 'pink'  // White noise for accent as well
        },
        envelope: {
            attack: 0.001,
            decay: 0.02,  // Slightly longer decay for accent
            sustain: 0,
            release: 0.04  // Longer release for more pronounced but still subtle accent
        }
    }).toDestination();

    // Set the initial BPM
    Tone.getTransport().bpm.value = currentBPM;

    // Tap tempo button logic
    tapButton.addEventListener('click', () => {
        const now = Date.now();
        tapTimes.push(now);

        if (tapTimes.length > 1) {
            // Calculate intervals between taps
            const intervals = tapTimes.slice(1).map((time, index) => time - tapTimes[index]);

            // Calculate average interval
            const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;

            // Convert the average interval to BPM
            const newBPM = Math.round(60000 / avgInterval);
            currentBPM = newBPM;
            bpmDisplay.textContent = `BPM: ${newBPM}`;

            // Update the BPM in Tone.js transport
            Tone.getTransport().bpm.rampTo(newBPM, 0.1);
        }

        // Limit the tap times array to the last 5 taps
        if (tapTimes.length > 5) {
            tapTimes.shift(); // Keep only the last 5 taps
        }
    });

    // Schedule the metronome loop with scheduleRepeat, ensuring exact timing
    Tone.getTransport().scheduleRepeat((time) => {
        // Calculate the current beat in the measure
        const currentBeat = Tone.getTransport().position.split(':')[1] % beatsPerBar;

        console.log('should be this many beats: ' + beatsPerBar);

        if (currentBeat == 0) {
            // Accent on the downbeat
            accentSynth.triggerAttackRelease("16n", time);
            console.log('Accent: ', currentBeat);
        } else {
            // Regular beat
            clickSynth.triggerAttackRelease("16n", time);
            console.log('Click: ', currentBeat);
        }
    }, '4n'); // Schedule for every quarter note

    // Toggle start/stop metronome
    startStopButton.addEventListener('click', async () => {
        // Ensure Tone.js AudioContext is started only after user interaction
        await Tone.start();

        if (metronomeRunning) {
            // Stop the metronome
            Tone.getTransport().stop();
            startStopButton.textContent = 'Start Metronome'; // Change button text
        } else {
            // Start the metronome
            Tone.getTransport().start();
            startStopButton.textContent = 'Stop Metronome'; // Change button text
        }
        metronomeRunning = !metronomeRunning; // Toggle the state
    });  
}

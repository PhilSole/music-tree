import * as Tone from 'tone';
import { constructMusicTree } from './construct.js';

// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', () => {

    // ===========================================================================
    // OpenAI stuff
    // ===========================================================================

    const userInput = document.getElementById('user-input');
    const submitButton = document.getElementById('submit-button');
    const outputDiv = document.getElementById('output');

    submitButton.addEventListener('click', async () => {
        const message = userInput.value;

        if (!message) {
            outputDiv.textContent = 'Please enter a prompt.';
            return;
        }

        // Send the prompt to the backend to interact with OpenAI API
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Display the AI's response
            outputDiv.textContent = data.reply;
        } catch (error) {
            console.error('Error:', error);
            outputDiv.textContent = 'An error occurred. Please try again.';
        }
    });   
    
    // ===========================================================================
    // Tone.js stuff
    // ===========================================================================

    // Just handle enabling the audio context so browsers don't get upset
    let btnEnableAudio = document.querySelector('.btn-enable-audio');
    const context = Tone.getContext();

    if(context.state == 'running') {
        btnEnableAudio.style.display = "none";
    } else {
        btnEnableAudio.addEventListener('click', async () => {
            await Tone.start();
            console.log("audio is ready");
            btnEnableAudio.style.display = "none";
        });         
    }


    // Logic variables
    let rootFrequency = 166;

    // Create a PolySynth with 10 voices
    const polySynth = new Tone.PolySynth(Tone.Synth, {
        envelope: {
            attack: 0.01,  // Time it takes for the sound to reach its peak level
            decay: 0.2,    // Time it takes for the sound to decay down to the sustain level
            sustain: 0.5,  // Sustain level (0 to 1)
            release: 2     // Time it takes for the sound to fade out after releasing the note
        }
    }).toDestination();

    const distortion = new Tone.Distortion(0.9).toDestination();
    // const filter = new Tone.Filter(400, "lowpass").toDestination();
    // const feedbackDelay = new Tone.FeedbackDelay(0.125, 0.5).toDestination();


    // polySynth.connect(distortion);
    // polySynth.connect(filter);
    // polySynth.connect(feedbackDelay);

    // Function to play a note
    function playNoteFrequency(multiplier, button) {
        const frequency = rootFrequency * multiplier;

        console.log(`Playing note: ${frequency} Hz`);

        // Trigger the note using PolySynth
        polySynth.triggerRelease(frequency);
        polySynth.triggerAttack(frequency);
        button.dataset.frequency = frequency;  // Store the frequency in the button element

        // Visual feedback (optional)
        button.classList.add('active');
    }

    // Function to stop playing the note
    function stopNoteFrequency(button) {
        const frequency = button.dataset.frequency;
        // Stop the note using PolySynth
        if (frequency) {
            console.log(`Stopping note: ${frequency} Hz`);
            polySynth.triggerRelease(Number(frequency));
            button.classList.remove('active');
        }
    }


    // Add event listeners to all buttons
    document.querySelectorAll('.btn-note').forEach(button => {
        const noteMultiplier = Number(button.dataset.note);

        // Handle mousedown and touchstart
        button.addEventListener('mousedown', () => playNoteFrequency(noteMultiplier, button));
        button.addEventListener('touchstart', () => playNoteFrequency(noteMultiplier, button));

        // Handle mouseup and touchend
        button.addEventListener('mouseup', () => stopNoteFrequency(button));
        button.addEventListener('touchend', () => stopNoteFrequency(button));

        // Handle mouseleave to stop the note if the mouse leaves the button while holding
        button.addEventListener('mouseleave', () => stopNoteFrequency(button));
    });



    // Handle keydown and keyup for keyboard control
    document.addEventListener('keydown', (event) => {
        if (event.key === 'f') {
            const button = document.querySelector('.btn-note[data-note="1"]');
            playNoteFrequency(Number(button.dataset.note), button);
        }
        if (event.key === 'g') {
            const button = document.querySelector('.btn-note[data-note="1.5"]');
            playNoteFrequency(Number(button.dataset.note), button);
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'f') {
            const button = document.querySelector('.btn-note[data-note="1"]');
            stopNoteFrequency(button);
        }
        if (event.key === 'g') {
            const button = document.querySelector('.btn-note[data-note="1.5"]');
            stopNoteFrequency(button);
        }
    });
});

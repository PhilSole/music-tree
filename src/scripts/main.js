import * as Tone from 'tone';

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

    const rootNote = document.getElementById('rootNote');
    const harmonic_1_5 = document.getElementById('harmonic_1_5');

    let rootFrequency = 83;

    // Create a synth and connect it to the speakers
    const synth = new Tone.Synth().toDestination();
    const delay = new Tone.FeedbackDelay('8n', 0.5).toDestination();
    // synth.connect(delay);

    const polySynth = new Tone.PolySynth(Tone.Synth).toDestination();

    const transport = Tone.getTransport();

    rootNote.addEventListener('mousedown', triggerSound);
    rootNote.addEventListener('touchstart', (event) => {
        event.preventDefault(); // Prevents touch-specific actions like scrolling
        triggerSound();
    });

    function triggerSound() {
        // synth.triggerAttackRelease(rootFrequency, '1n');

        polySynth.triggerAttackRelease([rootFrequency, rootFrequency*1.25, rootFrequency*1.5], '2n');

        // Optionally, start the transport if using sequences
        if (!transport.state === 'started') {
            transport.start();
        }        
    }
});

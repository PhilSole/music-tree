import * as Tone from "tone";
import './visualisers.scss';

export function createVisualisers() {
    // Create a synth and connect it to the destination (speakers)
    const synth = new Tone.Synth({
        oscillator: {
            type: "sine"
        }
    }).toDestination();

    // Create two AnalyserNodes using Tone.js: one for waveform and one for FFT
    const waveformAnalyser = new Tone.Analyser("waveform", 1024);
    const fftAnalyser = new Tone.Analyser("fft", 1024);

    // Connect the synth to both analysers
    synth.connect(waveformAnalyser);
    synth.connect(fftAnalyser);

    // Set up canvases for the visualizers
    const waveformCanvas = document.getElementById("waveformCanvas");
    const frequencyCanvas = document.getElementById("frequencyCanvas");
    const waveformCtx = waveformCanvas.getContext("2d");
    const frequencyCtx = frequencyCanvas.getContext("2d");

    // Play button event
    const playButton = document.getElementById("playButton");
    playButton.addEventListener("click", () => {
        // Trigger a sound when the button is clicked
        synth.triggerAttackRelease("C4", "8n");
    });

    // Waveform visualizer
    function drawWaveform() {
        requestAnimationFrame(drawWaveform);

        // Clear the canvas before drawing the new waveform
        waveformCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);

        // Get the waveform data
        const waveformValues = waveformAnalyser.getValue();

        // Determine the downsampling factor (number of samples to average)
        const downsampleFactor = 4;  // Average every 4 samples together
        const totalSamples = waveformValues.length;
        const visibleSamples = Math.floor(totalSamples / downsampleFactor);  // Reduced number of samples

        // Determine slice width for the visible data
        const sliceWidth = waveformCanvas.width * 1.0 / visibleSamples;
        let x = 0;

        waveformCtx.beginPath();
        for (let i = 0; i < totalSamples; i += downsampleFactor) {
            // Average the next few samples
            let avg = 0;
            for (let j = 0; j < downsampleFactor; j++) {
                avg += waveformValues[i + j] || 0;  // Handle case where data runs out
            }
            avg = avg / downsampleFactor;  // Compute the average

            const v = (avg + 1) / 2; // Normalize the average value
            const y = v * waveformCanvas.height;

            if (i === 0) {
                waveformCtx.moveTo(x, y);
            } else {
                waveformCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        waveformCtx.stroke();
    }



    function drawFrequencySpectrum() {
        requestAnimationFrame(drawFrequencySpectrum);

        // Get the frequency data from the analyser
        const frequencyValues = fftAnalyser.getValue();
        frequencyCtx.clearRect(0, 0, frequencyCanvas.width, frequencyCanvas.height);

        const barWidth = (frequencyCanvas.width / frequencyValues.length) * 2.5;
        let x = 0;

        for (let i = 0; i < frequencyValues.length; i++) {
            // Normalize values (range -Infinity to 0) and scale them for visualization
            const v = (frequencyValues[i] + 140) / 140;  // Scale the values to [0, 1]
            const barHeight = v * frequencyCanvas.height;

            frequencyCtx.fillStyle = `rgb(${Math.floor(v * 255)}, 50, 50)`; // Set color
            frequencyCtx.fillRect(x, frequencyCanvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1; // Add space between bars
        }
    }

    // Start drawing both visualizers
    drawWaveform();
    drawFrequencySpectrum();
}
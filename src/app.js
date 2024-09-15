import { createMusicTree } from './components/music-tree/music-tree.js';
import { createMetronome } from './components/metronome/metronome.js';
import { createVisualisers } from "./components/visualisers/visualisers.js";

// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', () => {
    createMusicTree();
    createMetronome('#metronome-container');
    createVisualisers();
});
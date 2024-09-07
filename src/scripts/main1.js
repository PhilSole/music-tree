import * as Tone from 'tone';
import { constructMusicTree } from './construct.js';

// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', () => {
    console.log('dom loaded');

    constructMusicTree();
    
    
});
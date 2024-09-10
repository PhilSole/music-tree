# Music Tree
- "Javascript is the hidden world of the web". What the hell does that mean?

## Project Notes
- 1.4 and 1.6 create a pinch
- 1.02857142857. This pinch occurs in multiple places
- Visible light 380 to 760 wavelength
- 41% is the width of each column gap
- Hit the notes, with the mouse, instead of click?
- JS use event delegation
- interesting idea of graph with nodes and edges. The edges could describe relationships
- positioning is based on 3 directions, positive and negative. 5th, Maj 3rd, Min 3rd. Could be part of button config file.
- Dividing by 5 is the largeest meaningful division

## Interface
- An octave switching button/gesture above/right of 2nd octave etc
- Multi touch. Each touch handled individually

## Tone.js notes
- Some things to try to increase tone.js performance
- Tone.getContext().latencyHint = 'fastest'; // Or 'balanced', 'playback'
- Tone.context = new AudioContext({ latencyHint: 'interactive', sampleRate: 44100 });
- console.log(Tone.getContext().baseLatency); // Monitor CPU load
- Share effects between notes
- Could capture velocity with a drag speed detection 



A brief description of what your project does and its purpose.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-project.git
    ```

2. Navigate into the project directory:
    ```bash
    cd your-project
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

## Usage

Describe how to use the project, such as commands to start the development environment or how to run the project.

```bash
npm run dev

/* 

State: active, what else?

1. Perfect 5th
2. 

*/ 

const noteConfig = [
    // Root
    { ratio: 1, key: 'd', position: [0, 0, 0] },

    // 3:2 direction (vertical)
    { ratio: 1.5, key: 'f', position: [0, 1, 0] }, 
    { ratio: 0.666, key: 's', position: [0, -1, 0] },
     
    // 5:4 direction (lower left to upper right)
    { ratio: 1.25, key: 'r', position: [0, 0, 1] },
    { ratio: 0.8, key: 'x', position: [0, 0, -1] },

    // 6:5 direction (lower right to upper left)
    { ratio: 1.2, key: 'c', position: [1, 0, 0] },
    { ratio: 0.833, key: 'e', position: [-1, 0, 0] },

    // 1.5 origin
    // { ratio: 2.25, key: 'g', position: [0, 2, 0] },
    { ratio: 1.875, key: 't', position: [0, 1, 1] },
    { ratio: 1.8, key: 'v', position: [1, 1, 0] },

    // 0.666 origin
    // { ratio: 0.444, key: 'a', position: [0, -2, 0] },
    { ratio: 0.533, key: 'z', position: [0, -1, -1] },
    { ratio: 0.555, key: 'w', position: [-1, -1, 0] },

    // Octave 2
    { ratio: 2, key: '.', position: [0, 0, 3] },
    { ratio: 1.333, key: ',', position: [-1, 0, 2] },
    { ratio: 1.6, key: 'l', position: [0, 0, 2] },
    { ratio: 1.666, key: '0', position: [3, 0, 0] },

    // Octave 2 -> 1.333 origin
    { ratio: 0.888, key: 'm', position: [-2, 0, 1] },
    { ratio: 1.067, key: 'k', position: [-1, 0, 1] },
    { ratio: 0.7, key: 'j', position: [-2, 0, 0] },

    // Octave 1/2
    { ratio: 0.5, key: '7', position: [0, 0, -3] },
    { ratio: 0.75, key: '8', position: [0, 1, -3] },
    { ratio: 0.625, key: 'u', position: [0, 0, -2] },
    { ratio: 0.6, key: 'n', position: [-3, 0, 0] },

    // Octave 1/2 -> 1.5 origin
    { ratio: 1.125, key: '9', position: [2, 0, -1] },
    { ratio: 0.938, key: 'i', position: [1, 0, -1] },
    { ratio: 1.4, key: 'o', position: [2, 0, 0] },

    // Anomalies
    // { ratio: 1.75, key: 'fill', position: [0, 0, 0] }, // 7:4    
];


export default noteConfig;


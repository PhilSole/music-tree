/* 

State: active, what else?

1. Perfect 5th
2. 

*/ 

const noteConfig = [
    // Root
    { ratio: 1, key: 'd' },

    // 3:2 direction (vertical)
    { ratio: 1.5, key: 'f' }, 
    { ratio: 0.666, key: 's' },
     
    // 5:4 direction (lower left to upper right)
    { ratio: 1.25, key: 'r' },
    { ratio: 0.8, key: 'x' },

    // 6:5 direction (lower right to upper left)
    { ratio: 1.2, key: 'c' },
    { ratio: 0.833, key: 'e' },

    // 1.5 origin
    { ratio: 2.25, key: 'g' },
    { ratio: 1.875, key: 't' },
    { ratio: 1.8, key: 'v' },

    // 0.666 origin
    { ratio: 0.444, key: 'a' },
    { ratio: 0.533, key: 'z' },
    { ratio: 0.555, key: 'w' },

    // Octave 2
    { ratio: 2, key: '.' },
    { ratio: 1.333, key: ',' },
    { ratio: 1.6, key: 'l' },
    { ratio: 1.666, key: '0' },

    // Octave 2 -> 1.333 origin
    { ratio: 0.888, key: 'm' },
    { ratio: 1.067, key: 'k' },
    { ratio: 0.7, key: 'j' },

    // Octave 1/2
    { ratio: 0.5, key: '7' },
    { ratio: 0.75, key: '8' }, 
    { ratio: 0.625, key: 'u' },
    { ratio: 0.6, key: 'n' },

    // Octave 1/2 -> 1.5 origin
    { ratio: 1.125, key: '9' },
    { ratio: 0.938, key: 'i' },
    { ratio: 1.4, key: 'o' },

    // Anomalies
    // { ratio: 1.75, key: 'fill' }, // 7:4    
];

export default noteConfig;


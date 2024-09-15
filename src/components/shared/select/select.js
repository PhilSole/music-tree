// shared/select/select.js

import './select.scss';

export function createSelect(options, onChange) {
    const select = document.createElement('select');
    select.className = 'shared-select';

    // Populate select with options
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        select.appendChild(optionElement);
    });

    // Handle change event
    select.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        if (onChange) {
            onChange(selectedValue);
        }
    });

    return select;
}

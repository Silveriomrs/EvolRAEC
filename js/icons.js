/*
*  Here are the icons for the APP in SVG format.
*  mainly for buttons icons in the main page (by now).
*  This is loaded into module compilador.js and plays directly with simulador.html and
*  its CSS.
*/

export const icons = {
  upload: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true">
    <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm65.18 216.01H224v80c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-80H94.82c-14.28 0-21.41-17.29-11.27-27.36l96.42-95.7c6.65-6.61 17.39-6.61 24.04 0l96.42 95.7c10.15 10.07 3.03 27.36-11.25 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"/>
  </svg>`,
  
  play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true">
    <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/>
  </svg>`,
  
  doublePlay: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 896 512" aria-hidden="true">
    <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/>
    <path d="M872.4 214.7L520.4 6.6C491.8-10.3 448 6.1 448 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/>
  </svg>`,
  
  refresh: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true">
    <path d="M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z"/>
  </svg>`,
  
  next: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" aria-hidden="true">
    <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
  </svg>`,
  
  prev: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" aria-hidden="true">
    <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/>
  </svg>`
};

/**
 * Init the ícons for all the buttons with data-icon
 */
export function initIcons() {
  document.querySelectorAll('[data-icon]').forEach(button => {
    const iconName = button.dataset.icon;
    //To avoid loading it twice, check if it was previously and if it is a valid one.
    if (icons[iconName] && !button.querySelector('svg')) {
      // Insert the icon at the begginig of each button
      //button.insertAdjacentHTML('afterbegin', icons[iconName]);
      button.insertAdjacentHTML(getPlace(iconName), icons[iconName]);
    } else {
      console.warn(`Ícon "${iconName}" doesn't found`);
    }
  });
}

/**
 * The function returns the placement for the icon into the button.
 *  The function get the icon name and returns the localitation into the button.
 * @param {string} icon name of the icon type contained into icons.
 * @return a string with the place ie: beforeend, afterbegin.
 */
function getPlace(icon){
    let side;
    switch(icon){
        case 'next':
            side = 'beforeend';
            break;
        default:
            side = 'afterbegin';
    }
    return side;
}
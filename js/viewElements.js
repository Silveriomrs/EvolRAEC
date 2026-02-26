/**
 * Module to include the elements from the view like:
 *  bottons, text fields, options, etc. Also it includes the functions
 *  to set, inicialize and change their attributes and listeners.
 */

import * as Exercises from './exercises.js';                                    //Predefined exercises
import { initIcons } from './icons.js';                                         //Icons for the icons


// DOM Elements
export const btn_compilar = document.getElementById('btn_Compilar');
const btn_reiniciar = document.getElementById('btn_Reiniciar');
const btn_cargaActividad = document.getElementById('btn_CargaActividad');
export const btn_back = document.getElementById("btn_back");
export const btn_next = document.getElementById("btn_next");
export const btn_ejecucionCompleta = document.getElementById("btn_ejecucionCompleta");

export const opt_mostrarTemp = document.getElementById('mostrarTemp');
export const opt_mostrarVisibles = document.getElementById('mostrarVisibles');
export const opt_mostrarRAReducido = document.getElementById('mostrarRAReducido');

export const cajaCodFuente = document.getElementById('cajaCodigoFuente');

const selector = document.getElementById("num-ejercicio");
export const cajaMsjCompilado = document.getElementById('resultadoCompilacion');

export const txtAreaConsolaSalida = document.getElementById('consolaSalida');
export const cajaSimbolos = document.getElementById('cajaSimbolo');
export const cajaTipos = document.getElementById('cajaTipo');

//Containers
export const containerCompileBox = document.getElementById('ContenedorResultadoCompilacion');

export const containerFase2A = document.getElementById("Fase2A");
    
export const containerFase2B = document.getElementById("Fase2B");

// Tabs
const tabs = document.querySelectorAll('.tabs a');


// Start to load the exercises option into the selector.
initSelectorOptions();
// Start loading icons for the buttons.
initIcons();

/**
 * Initiate the properties and assing IDs and Values to each option defined (exercise)
 *  into exercises.js.
 */
function initSelectorOptions(){
       Object.entries(Exercises.exercises).forEach(([id, data]) => {
           const option = document.createElement("option");
           option.value = id;                                                   //Add the ID for the excersise
           option.textContent = data.title;                                     //Add the title to be read in the selector
           selector.appendChild(option);
       });
}

/**
 * This function load the source code pased by paramenters into the Source code box,
 *  also init the first part of the APP and finally add the listener to the box.
 * @param {string} source 
 */
function loadSourceBox(source) {
    resetFirstPart();
    cajaCodFuente.value = source;
    cajaCodFuente.dispatchEvent(new Event('change'));
}

/** ===== LISTENERS ===== */

/**
 * Listener for load activity function.
 *  It loads the selected activity into the CajaCodFuente box.
 *  This function doesn't check if the text box has a valid text.
 */
btn_cargaActividad.addEventListener('click', (e) => {
    const scode = Exercises.exercises[selector.value];
    loadSourceBox(scode.code);
})

/**
 * Listener for clear the source code box.
 *  It clears the CajaCodFuente box.
 */
btn_reiniciar.addEventListener('click', (e) => {
    loadSourceBox("");
})

cajaCodFuente.addEventListener('focusin', () => {
    cajaCodFuente.style.backgroundColor = "transparent";
})

/** ====== EXTERNALIZED FUNTIONS ====== */

/**
 * The procedure restart main components from the fist part of the main Window view.
 *  It particularly reset tables, and controls in the Phase 2 of the compiler view where the results
 *  are shown.
 */
export function resetFirstPart() {
    cajaCodFuente.style.backgroundColor = "transparent";
    cajaCodFuente.disabled = false;
    cajaMsjCompilado.textContent = '';
    //TODO: Removing pintaTablas() From this point to check it it works to decouple this part from control

    containerCompileBox.style.display = 'none';
    containerFase2A.style.display = 'none';
    containerFase2B.style.display = 'none';
    //Init the icons (for buttons)
}

export function inicializaFase2() {
    document.getElementById("ContenedorResultadoCompilacion").style.display = 'block';
    containerFase2A.style.display = 'block';
    containerFase2B.style.display = 'block';
    //Buttons
    btn_next.style.display = 'inline-block';
    btn_back.style.display = 'inline-block';
    //
    btn_ejecucionCompleta.style.display = 'block';
    //Enable Control Buttons (full compile, next & back)
    enableControlButtons(false, true);
}


/**
 * Auxiliary procedure to set the browser buttons as enable or disable.
 * Main use: When no more instructions/lines to process.
 * @param {boolean} enBck True to enable the Back buttons, otherwise False.
 * @param {boolean} enFwd True to enable the Fordward buttons, otherwise False.
 **/
export function enableControlButtons(enBck,enFwd) {
    //Check if there is an Active Tab.
    const at = getActiveTabId() !== null;
    btn_ejecucionCompleta.disabled = !enFwd;
    //FIXME: this version doesn't work since doesn't detect the select tab at beggining.
    // it requires a better structure.
//    btn_back.disabled = !(at && enBck);
//    btn_next.disabled = !(at && enFwd);
    //Buttons Logic
    btn_back.disabled = !enBck;
    btn_next.disabled = !enFwd;
}

/**
 * It select the referenced tab and deselect the others.
 *  The efect is a refresh for advance/back bottons.
 * @param {string} href ID of the tab to activate.
 */
export function activateTab(href) {
    // Clear actives tabs
    tabs.forEach(tab =>
        tab.classList.remove('active')
    );

    // Take the referenced tab and activate it.
    const tab = document.querySelector(`.tabs a[href="${href}"]`);
    if (tab) tab.classList.add('active');

    // Hide each contains.
    document.querySelectorAll('.tab-content').forEach(content =>
        content.classList.remove('active')
    );

    //Shows the right referenced selector.
    const content = document.querySelector(href);
    if (content) content.classList.add('active');
}


export function getActiveTabId() {
    const activeTab = document.querySelector('.tabs a.active');
    //No tab active? returns null.
    if (!activeTab) return null;
    // returns href. ie: "#tabCodigoFuente"
    return activeTab.getAttribute('href').substring(1);
}


/**
 * Listener for every TAB.
 *  It takes the selected tab, prevent to active it (yet it needs to de-activate the rest to avoid 2 actives at once),
 */
function changeActiveTab(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    activateTab(href);
}

// Add 'click' event to every TAB
tabs.forEach(tab => tab.addEventListener('click', changeActiveTab));



/**
 * TODO: finish this function and also comment it properly, 
 * by now it is used only for showing err messages when compiling the source code.
 */
export function showMSGCompilerBox(msg){
    View.containerCompileBox.style.display = 'block';
    View.cajaCodFuente.disabled = false;
    View.cajaCodFuente.style.backgroundColor = "red";
    View.cajaMsjCompilado.textContent = msg;
    View.cajaMsjCompilado.style.backgroundColor = "red";  
}



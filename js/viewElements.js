/**
 * Module to include the elements from the view like:
 *  bottons, text fields, options, etc. Also it includes the functions
 *  to set, inicialize and change their attributes and listeners.
 */

// DOM Elements
export const btn_compilar = document.getElementById('btn_Compilar');
export const btn_reiniciar = document.getElementById('btn_Reiniciar');
export const btn_cargaActividad = document.getElementById('btn_CargaActividad');
export const btn_sigInstruccion = document.getElementById("btn_sigInstruccion");
export const btn_prevInstruccion = document.getElementById("btn_prevInstruccion");
export const btn_prevLinea = document.getElementById("btn_prevLinea");
export const btn_sigLinea = document.getElementById("btn_sigLinea");
export const btn_ejecucionCompleta = document.getElementById("btn_ejecucionCompleta");

export const opt_mostrarTemp = document.getElementById('mostrarTemp');
export const opt_mostrarVisibles = document.getElementById('mostrarVisibles');
export const opt_mostrarRAReducido = document.getElementById('mostrarRAReducido');

export const cajaCodFuente = document.getElementById('cajaCodigoFuente');
export const cajaMsjCompilado = document.getElementById('resultadoCompilacion');
export const cajaSimbolos = document.getElementById('cajaSimbolo');
export const cajaTipos = document.getElementById('cajaTipo');



//Functions

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

    document.getElementById("ContenedorResultadoCompilacion").style.display = 'none';
    document.getElementById("Fase2A").style.display = 'none';
    document.getElementById("Fase2B").style.display = 'none';
}

export function inicializaFase2() {
    document.getElementById("ContenedorResultadoCompilacion").style.display = 'block';
    document.getElementById("Fase2A").style.display = 'block';
    document.getElementById("Fase2B").style.display = 'block';
    //Buttons
    btn_sigInstruccion.style.display = 'inline-block';
    btn_prevInstruccion.style.display = 'inline-block';
    btn_sigLinea.style.display = 'inline-block';
    btn_prevLinea.style.display = 'inline-block';
    //
    btn_ejecucionCompleta.style.display = 'block';
}


/**
 * Auxiliary procedure to disable buttons.
 * Main use: When no more instructions/lines to process.
 **/
export function disableControlButtons() {
    btn_sigInstruccion.style.display = 'none';
    btn_sigLinea.style.display = 'none';
    btn_ejecucionCompleta.style.display = 'none';
    //TODO: Add controls to keep disable back bottons when we are in line 0.

}

/**
 * It select the referenced tab and deselect the others.
 *  The efect is a refresh for advance/back bottons.
 * @param {string} href
 */
export function activateTab(href) {
    // Clear actives tabs
    document.querySelectorAll('.tabs a').forEach(tab =>
        tab.classList.remove('active')
    );

    // Take the referenced tab and activate it.
    const tab = document.querySelector(`.tabs a[href="${href}"]`);
    if (tab) tab.classList.add('active');

    // Remove each contains (hide).
    document.querySelectorAll('.tab-content').forEach(content =>
        content.classList.remove('active')
    );

    //Shows the right referenced selector.
    const content = document.querySelector(href);
    if (content) content.classList.add('active');
}



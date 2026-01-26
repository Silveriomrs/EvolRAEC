/**
 * Module to include the const, var and lets of the state of computing.
 * Also the necessary functions to manipulate the state.
 */

// Shared Vars
export const state = {
    posLine: 0,
    lineaActual: '-1',
    listaCuadruplas: [],
    indice: 0,
    regSP: 0,
    regSR: 0,
    regIX: 0,
    regR0: 0,
    regR1: 0,
    regA: 0,
    mapPila: new Map(),
    arrPilaLlamadas: [],
    arrMem: [],
};

// Consts
export const maxAddress = 65535;
export const tamannoFijoRA = 4;
// Auxiliars elements
export const lineNumbersDiv = document.getElementById('line-numbers');

//Functions.

/**
 * Restart the simulator to default values and cleaning all arrays and maps.
 */
export function resetState() {
  state.indice = 0;
  state.regSP = maxAddress ;
  state.regSR = 0;
  state.regIX = 0;
  state.regR0 = 0;
  state.regR1 = 0;
  state.regA = 0;;
  state.mapPila.clear();
  state.arrPilaLlamadas= [];
  state.arrMem = [];
}
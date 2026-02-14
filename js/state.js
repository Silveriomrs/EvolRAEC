/**
 * Module to include the const, var and lets of the state of computing.
 * Also the necessary functions to manipulate the state.
 */

// Shared Vars
export const state = {
    posLine: 0,
    lineaActual: -1,
    running: true,
    /** Increase each time an instruction is consumed. */
    indice: 0,
    //
    regSP: 0,
    regSR: 0,
    regIX: 0,
    regR0: 0,
    regR1: 0,
    regA: 0,
    //
    mapPila: new Map(),
    listaCuadruplas: [],
    arrPilaLlamadas: [],
    arrMem: [],
};

// Consts
export const maxAddress = 65535;
export const tamannoFijoRA = 4;
// Auxiliars elements
export const lineNumbersDiv = document.getElementById('line-numbers');
/**Array of state objects. In this version is used only to store the number of instructions requires to reach a determinate line.
*The association is : [Consumed Instructions, Line reached]
*/
const logState = [];

const intermedio = [];


//Functions.

/** ====== new imported functions ====== */

export function traeDescripcionPosicion(pos, dir) {
    let callStackSize = state.arrPilaLlamadas.length;

    if (callStackSize != 0) {
        for (let i = 0;i <= callStackSize - 1;i++) {
            let voyPor, valRet, EsMaq, EC, EA, ParamDesde, ParamHasta, DireRet, VarDesde, VarHasta, TempDesde, TempHasta, qcorrespondeALlamada;
            let a = posMem(state.arrPilaLlamadas[i].inicioRA);

            if (pos <= a) {
                qcorrespondeALlamada = state.arrPilaLlamadas[i].nombreProcOFunc;
                valRet = posMem(state.arrPilaLlamadas[i].inicioRA);
                EsMaq = valRet - 1;
                EC = EsMaq - 1;
                EA = EC - 1;
                voyPor = EA;

                if (state.arrPilaLlamadas[i].parametros.length != 0) {
                    ParamDesde = voyPor - 1;
                    ParamHasta = ParamDesde - state.arrPilaLlamadas[i].parametros.length + 1;
                    voyPor = ParamHasta;
                }

                if (i != callStackSize - 1) {// al del main no le pongo dirección de retorno
                    DireRet = voyPor - 1;
                    voyPor = DireRet;
                }

                if (state.arrPilaLlamadas[i].numVariables != 0) {
                    VarDesde = voyPor - 1;
                    VarHasta = VarDesde - state.arrPilaLlamadas[i].numVariables + 1;
                    voyPor = VarHasta;
                }

                if (state.arrPilaLlamadas[i].numTemporales != 0) {
                    TempDesde = voyPor - 1;
                    TempHasta = TempDesde - state.arrPilaLlamadas[i].numTemporales + 1;
                    //DELETEME: This last assignation has no sense. It is no more used.
                    voyPor = TempHasta;
                }

                if (pos == valRet) {
                    return 'Valor retorno'
                } else if (pos == EsMaq) {
                    return 'Estado máquina'
                } else if (pos == EC) {
                    if (state.arrPilaLlamadas[i].inicioRA == 0)
                        return 'Enlace control'
                    else
                        return 'Enlace control --> ' + posMem(dir)
                } else if (pos == EA) {
                    if (state.arrPilaLlamadas[i].inicioRA == 0)
                        return 'Enlace acceso'
                    else
                        return 'Enlace acceso --> ' + posMem(dir)
                } else if ((state.arrPilaLlamadas[i].parametros.length != 0) && (ParamDesde >= pos) && (ParamHasta <= pos)) {
                    return 'Parámetro --> ' + recuperaVariableArrMem(pos)
                } else if (pos == DireRet) {
                    return 'Dir. retorno'
                } else if ((state.arrPilaLlamadas[i].numVariables != 0) && (VarDesde >= pos) && (VarHasta <= pos)) {
                    return 'Variable --> ' + recuperaVariableArrMem(pos)
                } else if ((state.arrPilaLlamadas[i].numTemporales != 0) && (TempDesde >= pos) && (TempHasta <= pos)) {
                    return 'Temporal --> ' + recuperaVariableArrMem(pos)
                } else { return '' }

            }
        }
    }
    return '';
}

export function perteneceRAReducido(qDesc) {
    return (qDesc == 'Valor retorno' || qDesc.includes('Enlace control') || qDesc.includes('Enlace acceso'));
}


export function perteneceTemporal(qDesc) {
    return qDesc.includes('Temporal');
}

/**
 * Calcula la "posición" de la en la pila respecto a state.regSP
 **/
export function posPila() {
    return state.regSP - maxAddress;
}

/**
 * Calcula la "posición" de la en la pila respecto a pos
 * * @param {Int} pos Dir ind
 **/
export function posPilaDI(pos) {
    return pos - maxAddress;
}

/**
 * Calcula la "posición" del parametro en la pila respecto al inicio de su RA
 * * @param {Int} pos Posicion
 **/
export function posParametro(pos) {
    return pos - tamannoFijoRA;
}

/**
* @param {Int} pos Posicion
*/
export function posMem(pos) {
    return maxAddress + pos;
}

/**
* Recupera la posición de memoria que ocupa la variable que se le pasa como parámetro
* @param {String} variable variable
*/
export function recuperaPosicionMemoria(variable) {
    for (const memo of state.arrMem) {
        if (memo[1] == variable) { return memo[0] }
    }
    throw new Error('Error variable no encontrada');//aqui no debería llegar nunca
}

/**
* Recupera el valor de la variable que se le pasa como parámetro
* @param {String} variable variable
*/
export function recuperaValor(variable) {
    for (const memo of state.arrMem) {
        if (memo[1] == variable) {

            //opcion1
            //busco por Enlace de acceso
            //encontradoEA = buscoPosicionPorEnlaceAcceso(variable,0);
            //if (encontradoEA != memo[0]) alert('variable  ' + variable + ' ' + encontradoEA +  '--' + memo[0]);

            //opcion2
            //Busco en la pila
            //return state.mapPila.get(posMem(memo[0]));
            let encontradoArrMem = posMem(memo[0]);
            return state.mapPila.get(encontradoArrMem);
        }
    }
    throw new Error('Error variable no encontrada');//aqui no debería llegar nunca
}

/**
* Recupera la variable de la direccion de memoria que se le pasa como parámetro
* @param {int} qPos posicion de memoriavariable
*/
export function recuperaVariableArrMem(qPos) {
    let xx;
    let dInd = posPilaDI(qPos);

    for (const element of state.arrMem) {
        let index = element.indexOf(dInd);
        if (index > -1) {
            xx = element[1];
            return xx;
        }
    }

    throw new Error('Error variable no encontrada');//aqui no debería llegar nunca
}

/**
* Recupera el valor del enlace de Control
*/
export function traeEnlaceDeControl() {
    let i = 0;
    if (state.arrPilaLlamadas.length != 0) {
        i = state.arrPilaLlamadas[0].inicioRA;
    }
    return i;
}

/**
* Recupera el valor de la dirección de retorno del RA
* Donde habíamos guardado la línea de código desde la cual se había hecho la llamada
* @param {String} nombreProcOFunc nombre procedimiento o función
*/
export function traeDireccionRetornoRA(nombreProcOFunc) {
    let i;
    //TODO: FIXME: this conditional has a asignation instead comparator. I change nombreprocfunc = nombreproc for ... == ...
    if (state.arrPilaLlamadas[0].nombreProcOFunc == nombreProcOFunc) {
        i = state.mapPila.get(posMem(state.arrPilaLlamadas[0].inicioRA - tamannoFijoRA - state.arrPilaLlamadas[0].parametros.length));
    } else {
        throw new Error('Error al traer dir. retorno RA.');//aqui no debería llegar nunca
    }
    return i;
}

/** ====== Others ====== */

export function insertaArrMem(value) {
    let pos = 0;
    let seguir = true;
    while (pos < state.arrMem.length && seguir) {
        if (state.arrMem[pos][0] > value[0]) {
            state.arrMem.splice(pos, 0, value);
            seguir = false;
        }
        pos++;
    }

    if (seguir) {
        state.arrMem.push(value);
    }
}

/**
 * Decrease the value of the Stack Pointer in 1 unit.
 *  The function show warning in case that the Stack Pointer is already 0, what would produce
 *  a negavtive access address.
 */
export function decSP() {
    if (state.regSP > 0) {
        state.regSP--;
    } else {
        alert("Stack Overflow!");
    }
}

/**
 * This function add to the State log, the pair of index that define each execution of an instruction and line.
 *  a lines is composed by 1 or more instructions. It stores how many instructions are required to reach an specific
 *  code line. Taken from intermediate code from the compiled source, what implies no comments line are considered.
 * @param {number} insNumber define the number of instruction to reach that point of the process.
 * @param {number} lineNumber define the line of the source code associate with the amount of instructions consumed to get there.
 */
export function addLog(insNumber, lineNumber) {
    logState.push({
        ins: insNumber,
        line: Number.parseInt(lineNumber, 10)
    })
}

/**
 * Introduce a data line into 'intermedio' array.
 * @param {string} dataLine line to add to the intermedio.
 */
export function intermedioPush(dataLine){
    intermedio.push(dataLine);
}

/**
 * It reset the intermedio to a empty state.
 */
export function intermedioReset(){
    intermedio.length = 0;
}

/**
 * Init the intermedio clearing it from any value and adding the initial line
 *  signal to Stop (end of the code).
 */
export function intermedioInit(){
    intermedioReset();
    intermedioPush("LIN 1 [STARTGLOBAL null, null, null]");                     ////"addQuadruple("STARTGLOBAL");"
}

/**
 * Temporal function to get intermedio.
 * It is required by now to dump its values into ListaCuadriculas in compilador.js
 */
export function getIntermedio(){
    return intermedio;
}

/**
 * It returns the previous line position to the current one.
 *  When the logState has not enough items or there is not a line change in execution, it returns null.
 * @return {number|null} previous line number calculated in the logState. Otherwise null.
 */
export function getPreviousPosition() {
    const size = logState.length;
    if (size < 2) return null;

    const lastLine = logState[size - 1].line;
    let readLine = lastLine;
    let index = size - 1;
    //
    while (index >= 1) {
        readLine = logState[index - 1].line;
        if (lastLine !== readLine) {
            return logState[index - 1].ins;
        }
        index--;
    }

    return null;
}

/**
 * Function for debugging purpose. It prints by console two arrays showing 
 *  the instructions index changes and the lines index changes.
 */
export function showLogState() {
    const size = logState.length;
    let inst = "Instr [";
    let lines = "Lines [";
    for (let i = 0;i < size;i++) {
        inst += logState[i].ins;
        lines += logState[i].line;
        if (i < size - 1) {
            inst += ",";
            lines += ",";
        }
    }

    inst += "]";
    lines += "]";
    console.log(inst);
    console.log(lines);
    const prevPos = getPreviousPosition();
    console.log("Previous position at index: ", (prevPos !== null) ? prevPos : "none");
    console.log("Index is: ", state.indice);

}

export function clearLogState() {
    logState.length = 0;
}

/**
 * Restart the simulator to default values and cleaning all arrays and maps.
 */
export function resetState() {
    state.indice = 0;
    state.lineaActual = '-1';
    state.posLine = 0;
    state.regSP = maxAddress;
    state.regSR = 0;
    state.regIX = 0;
    state.regR0 = 0;
    state.regR1 = 0;
    state.regA = 0;
    state.mapPila.clear();
    //state.listaCuadruplas = []; //This cannot be uncomment. Used in compiled yet.
    state.arrPilaLlamadas = [];
    state.arrMem = [];
    state.running = true;
    logState.length = 0;
    
    //intermedioReset();  //Cannot be used by now. In compilador.js it does a dump & reset state into listaCuadruplas and continue working.
    // so if it is cleared, then lose its values and cannot work properly the APP.
}
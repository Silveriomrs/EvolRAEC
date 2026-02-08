/**
 * Module to include the const, var and lets of the state of computing.
 * Also the necessary functions to manipulate the state.
 */

// Shared Vars
export const state = {
    posLine: 0,
    lineaActual: -1,
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

//Functions.

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
    logState.length = 0;
}
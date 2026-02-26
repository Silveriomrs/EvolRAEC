/*
   PFG UNED
   Fichero : compilador.js
   Autor   : Jaime Alcalá Galicia
   Version : 1.0
   Fecha   : 01/01/2023
   Descripción: Manejo compilador y código final.
   
   Revision: 1.2
*/

import { intercambioCompilador, pilaLLamada } from './API.js';
import parserUned from './parserUned.js';
import * as State from './state.js';                                            //States used in compilator
import * as Tables from './tables.js';
import * as View from './viewElements.js'

const state = State.state;

let mapaCadenas = [];

//
inicializaFase1();


View.opt_mostrarTemp.addEventListener('click', (e) => {
    pintaTablas();
})

View.opt_mostrarVisibles.addEventListener('click', (e) => {
    pintaTablas();
})

View.opt_mostrarRAReducido.addEventListener('click', (e) => {
    pintaTablas();
})

View.btn_compilar.addEventListener('click', (e) => {
    let codigoUsuario = View.cajaCodFuente.value;;
    //Checking empty text box
    //Changed, cajaMsjCompilado is hidded. So it's turned visible when empty box.
    if (codigoUsuario == '') {
        //FIXME: This is more complicated, in another part of the code it is hidden autmatically again,
        // so remains hidden. Must be found this other place. The place is inicializaFase1
        // it doesn't get active till all is compiled from the SourceCode.
        //New way and return:
        View.cajaMsjCompilado.textContent = 'Error. No hay código fuente. '
        View.cajaMsjCompilado.style.backgroundColor = "red";
        //Meanwhile by console.
        console.log('Error. No hay código fuente. ');
        return;
    }
    
    State.resetState();
    state.listaCuadruplas = '';
    mapaCadenas = [];

    //Parse code in text format.
    try {
        parserUned.yy = intercambioCompilador();
        state.listaCuadruplas = parserUned.parse(codigoUsuario);

        state.posLine = 0;
        View.cajaCodFuente.disabled = true;
        View.cajaCodFuente.style.backgroundColor = Tables.COLOR_LIGHTGREEN;
        View.inicializaFase2();
        //
        View.txtAreaConsolaSalida.textContent = '';
        View.cajaMsjCompilado.textContent = 'El programa se ha compilado sin errores. '
        View.cajaMsjCompilado.style.backgroundColor = Tables.COLOR_LIGHTGREEN;

        const tabs2 = document.querySelectorAll('.tabs a');
        tabs2.forEach(tab => tab.classList.remove('active'));

        //EMPEZAMOS EL INTERMEDIO
        State.intermedioInit();
        state.listaCuadruplas = state.listaCuadruplas.filter(Boolean);//eliminamos los undefined del array listaacuadruplas que viene del parseruned

        state.listaCuadruplas.forEach(function(i) {  //y meto los valores en el array intermedio
            State.intermedioPush(i);
        });

        //Meto las cadenas de texto en el array de intermedio
        mapaCadenas = parserUned.yy.cadenasTxt;
        for (let [key, value] of parserUned.yy.cadenasTxt) {
            State.intermedioPush("[CADENA, " + value + ', ' + key + ", null]");
        }

        state.listaCuadruplas = State.getIntermedio();
        State.resetState();
        pintaTablas();
        Tables.crearTablaCodFuenteyCuadruplas([state.listaCuadruplas], View.cajaCodFuente);

    } catch (error) {
        View.showMSGCompilerBox(error);
        if (error.hash?.loc?.first_line) {
            state.posLine = error.hash.loc.first_line;
        }
    }
    
    //Activate the default TAB (source code tab)
    View.activateTab("#tabCodigoFuente");
})

/**
 * The procedure does a call back action, returning to the previous instruction calculated.
 *  This button is associate to the "Código Intermedio" Tab branch of the view render.
 * <p>
 * This event provoke a restart to the secuence, clearing all previous values from the State and
 *  emulating clicking action on the botton till get the previous instruction using an index.
 */
function backInst() {
    let index = state.indice;
    //Reset previous values (no need since it also is done by compilar function).
    //Firstly we will compile the same code again
    View.btn_compilar.click();
    //Finally give as many steps comsuming instructions as we need.
    for (let i = 1; i < index; i++) { calcNextIns(); }
}

/**
 * The procedure take back a line of execution from the current one.
 *  This procedure is associated to the button listener BACK. and operates over
 *  the table associated to the <b>Source Code</b>.
 */
function lineBCK(){
    const stepsToGoal = State.getPreviousLineStep();
    //compile to reset counters and set buttons states.
    View.btn_compilar.click();
    //Check it was not the first line already.
    if (stepsToGoal === -1) { return; }
    //Finally give as many steps comsuming instructions as we need.
    while (State.getCurrentStep() < stepsToGoal) {
        calcNextIns();
    }
}


/**
 * The procedure execute the next line of the source code.
 *  This procedure is associated to the button listener NEXT, and operates over
 *  the table associated to the <b>Source Code</b>.
 */
function lineFWD(){
    let continuo = true;
    const line = getActiveLine();
    //check if there is a line to work with:
    //checking conditional ... before !line, now line === -1, what looks doesn't work
    if (line == -1) {
        console.log("btn_next (line) got line: ", line);
        return; 
     }
        
    state.lineaActual = line;
    //A line is componsed by some instructions. So to execute 1 line, all the instructions must be run. 
    //Loop to run all instruction while they belong to the same line.
    while (isNextInstruction() && continuo) {
        calcNextIns();                                                          //Since calcNextIns() increase +1 after the call
        if (state.lineaActual != getActiveLine()) {                             //When it doesn't match, that means we are in a new line.
            continuo = false;
        }
    }
}

/**
 * Listener for Back button that detect the active Tab and refresh its value (active or disable)
 *  at the end of the process.
 */
View.btn_back.addEventListener('click', (e) => {
    const tab = View.getActiveTabId();
    if(!tab) return;
    
    if (tab === "tabTablaCuadruplas"){
        //Ins
        backInst();
    } else if (tab === "tabCodigoFuente"){
        //Line
        lineBCK();
    }
    
    //Back functions clears the active tabs so we need to restore it.
    //Remark/activate its tab on the list.
    View.activateTab('#' + tab);
})

/**
 * Listener for Next button. It proceed with the next line/instruction to calc
 *  depending on the active tab.
 */
View.btn_next.addEventListener('click', (e) => {
    const tab = View.getActiveTabId();
    if (tab === "tabTablaCuadruplas"){
        //Ins
        calcNextIns();
        //DELETEME: View.activateTab('#tabTablaCuadruplas');
    } else if (tab === "tabCodigoFuente"){
        //Line
        lineFWD();
    }
})


/**
 * Execute the full compilation of the code.
 */
View.btn_ejecucionCompleta.addEventListener('click', (e) => {
    while (isNextInstruction()) { calcNextIns(); }
})


/** ====== MY ADDED AUXILIARY FUNCTIONS ====== */


/**
 * Auxiliary procedure that indicates when no more instructions nor lines availables.
 * @return True if there is another one & the machine is not halted. Otherwise False.
 */
function isNextInstruction() {
    //Firstly get a copy as a local variable from the table
    const elementInstruccion = Tables.getItemsTable("tablaCuadruplas");
    //Is the index a valid one?
    return (
        state.running &&
        elementInstruccion &&
        state.indice >= 0 &&
        state.indice < elementInstruccion.length
    );
}

/**
 * This function returns the number line indicated into the string of the current line from the source code.
 *  When the function cannot determinate the Line number, it returns -1.
 * <p> Note: This function doesn't take the line from State, cause it's use to update the state.
 * @return {number} number into the line description. Otherwise: -1.
 */
function getActiveLine() {
    let lineStr = getIns(state.indice)
    let line = -1;
    
    if(!lineStr) return line;
    //Only accept LIN or HALT operands.
    if (lineStr.startsWith("LIN") ) {
        line = Number.parseInt(lineStr.substring(4, lineStr.indexOf("[")), 10);
    } else if(lineStr.startsWith("[HALT")){
        halt();
    }
    
    return line;
}


/**
 * Returns the instruction aimed by the index. The function checks if the index is valid.
 *  The instruction are located at children node number 1 into the "tablaCuadruplas" table.
 * @param {number} index of the instruction into the array.
 * @return {string|null} the content at that index. Null if there are not instructions.
 */
function getIns(index) {
    let ins_array = Tables.getItemsTable("tablaCuadruplas");
    //Check if ins_array has elements.
    if (!ins_array || index >= ins_array.length) {
        return null;
    }

    return (ins_array[index].children[1].innerText);
}

/**
 * Function to calc next instruction using try-catch enclosure to deal with 
 *  the exception. This function is an auxiliar one to reduce code complexity.
 */
function calcNextIns() {
    try {
        consumeInstruccion();
    } catch (e) {
        showCatchedErr(e);
    }
}

//TODO: PINTA ZONE


function pintaTablas() {
    pintaTablaPila();
    pintaTablaVariables();
    pintaCallStack(state.arrPilaLlamadas);
}

/**
 * Ilumina las posiciones de la pila de control de la llamada que se ha seleccionado
 * * @param {String} nombreProcOFunc Nombre de la llamada
 * * @param {Int} dir Direccion inicial del RA de la llamada
 **/
function clickPilaLlamadas(nombreProcOFunc, dir) {
    let encontrado = false;
    let desdePosPila = 0;
    let hastaPosPila = 0; 

    //Check if the arguments are valid.
    if (!nombreProcOFunc || !dir) return;
    //reset previous colors
    Tables.resetTableColors();
    Tables.resetColoresCodigoIntermedio();
    //TODO: one of those above or behind could be innecesary
    
    //Lineas pila de llamadas
    // THE ORDER OF LOOPS MATTERS! do not change it. 
    const elementPilaLlamadas = Tables.getItemsTable("tablaPilaLlamadas");

    if (elementPilaLlamadas && elementPilaLlamadas.length > 1) {
        let i = 1;
        do {
            if ((elementPilaLlamadas[i].cells[0].innerHTML == nombreProcOFunc) &&
                (elementPilaLlamadas[i].cells[2].innerHTML == dir))
                elementPilaLlamadas[i].style.backgroundColor = Tables.colorResalte;
            i += 1;
        } while (elementPilaLlamadas.length > i);

    }
    
    //Calc points FROM and TO of Call Stack and Vars table to be filtered.
    if (state.arrPilaLlamadas.length != 0) {
        let i = 0;
        do {
            desdePosPila = hastaPosPila + 1;
            hastaPosPila = State.posMem(state.arrPilaLlamadas[i].inicioRA);

            if ((state.arrPilaLlamadas[i].nombreProcOFunc == nombreProcOFunc) && (State.posMem(state.arrPilaLlamadas[i].inicioRA) == dir)) {
                encontrado = true;
            } else { i += 1; }
        } while (!encontrado);
    }

    //Lineas pila de control
    Tables.remarkElement("tablaPila", 0, desdePosPila, hastaPosPila, Tables.colorResalte);

    //Lineas estado del cómputo
    Tables.remarkElement("tablaVariables", 2, desdePosPila, hastaPosPila, Tables.colorResalte);
    
}


function pintaTablaPila() {
    const muestroRaReducido = View.opt_mostrarRAReducido.checked;
    const muestroTemporales = View.opt_mostrarTemp.checked;
    //TODO: Changed map syntax. Observe it.
    const miMapa = new Map(state.mapPila.entries());
    Tables.limpiaTabla("tablaPila");
    let FlagLinBlanca;

    //Creation of the Table for Stack.
    const columns = ['Dir.', 'Valor', 'Descripción'];
    const tablaPila = Tables.createTable(columns);

    let cuerpoTabla = document.createElement('tbody');
    let qDescripcion;

    for (let key of Array.from(miMapa.keys()).sort(function(a, b) { return a - b; })) {
        let value = miMapa.get(key);
        qDescripcion = State.traeDescripcionPosicion(key, value);

        let muestroLinea = false;

        if (!muestroRaReducido || (muestroRaReducido && State.perteneceRAReducido(qDescripcion)))
            muestroLinea = true;

        if (!muestroTemporales && State.perteneceTemporal(qDescripcion))
            muestroLinea = false;

        if (muestroLinea) {
            if (qDescripcion == 'Valor retorno') {
                FlagLinBlanca = false;
            }
            //Define cells names.
            const cells = [key, value, qDescripcion];
            //Create row
            const fila = Tables.createRow(cells);
            //Add it to the table.
            cuerpoTabla.appendChild(fila);

        } else if (!FlagLinBlanca) {
            FlagLinBlanca = true;
            //Para dejar "Simular" separación del RA en el modo reducido
            for (let step = 0; step < 4; step++) {
                //Define cells names.
                const cells = [' ', '', ''];
                //Create row
                const fila = Tables.createRow(cells);
                //Add it to the table.
                cuerpoTabla.appendChild(fila);
            }
        }
    }

    Tables.setAttTable(tablaPila, "tablaPila", cuerpoTabla, "divpila");
    //Add event listener.
    $('#tablaPila tr').on('click', function() {
        let data = $(this).find('td');
        let dir = data[0].innerText;                                              //Address
        let value = data[1].innerText;                                              //Value
        let desc = data[2].innerText;                                              //Description

        if (dir && desc && value && value != '') {
            Tables.clickTablaPila(dir, value, desc);
        }

    });
}

/**
 * The function create and set the initial format of the Call Stack Table.
 * @param {array} callStackArray the datas in the status module with the Stack of calls.
 */
export function pintaCallStack(callStackArray) {

    Tables.limpiaTabla("tablaPilaLlamadas");

    if (callStackArray.length != 0) {
        const columns = ['Llamada proc-fun', 'Inicio RA', 'Dir.'];
        const tablaPilaLlamadas = Tables.createTable(columns);

        let cuerpoTabla = document.createElement('tbody');
        let i = 0;

        do {
            //create cells names array
            const cellsNames = [callStackArray[i].nombreProcOFunc, callStackArray[i].inicioRA, State.posMem(callStackArray[i].inicioRA)];
            //create row
            const fila = Tables.createRow(cellsNames);
            //add it to the table
            cuerpoTabla.appendChild(fila);
            i += 1;
        } while (i < callStackArray.length);

        Tables.setAttTable(tablaPilaLlamadas, "tablaPilaLlamadas", cuerpoTabla, "divpilaLlamadas");
        //Add event listener.
        $('#tablaPilaLlamadas tr').on('click', function() {
            let dato1 = $(this).find('td:first').html();
            let dato2 = $(this).find('td:last').html();
            clickPilaLlamadas(dato1, dato2);
        });
    }
}

function pintaTablaVariables() {
    let muestroTemporales = View.opt_mostrarTemp.checked;
    let muestroVisibles = View.opt_mostrarVisibles.checked;
    const locMap = new Map();
    locMap.clear()
    Tables.limpiaTabla("tablaVariables");
    //Creation of the Table for variables.
    const columns = ['Variable', 'Dir.', 'Valor', 'Visible'];
    const tablaVariables = Tables.createTable(columns);


    let cuerpoTabla = document.createElement('tbody');
    state.arrMem.forEach((item) => {
        let muestroTemp = false;
        let muestroVis = false;
        if (muestroTemporales || (!muestroTemporales && (item[1].slice(0, 2) != 'T_'))) {
            muestroTemp = true;
        }

        if (!muestroVisibles || (muestroVisibles && !locMap.has(item[1]))) {
            muestroVis = true;
        }

        if (muestroTemp && muestroVis) {
            const cells = [item[1], State.posMem(item[0]), state.mapPila.get(State.posMem(item[0]))];
            //For last cell, it varys its text depending on extra item.
            //add it to the array to create the whole row.
            if (!locMap.has(item[1])) {
                locMap.set(item[1], State.posMem(item[0]));
                cells.push('Si');
            } else {
                cells.push('No');
            }

            //creating the whole row.
            const fila = Tables.createRow(cells);
            //add the row to the table.
            cuerpoTabla.appendChild(fila);
        }
    })

    Tables.setAttTable(tablaVariables, "tablaVariables", cuerpoTabla, "divvariable");
    //Add event listener.
    $('#tablaVariables tr').on('click', function() {
        let dato = $(this).find('td:eq(2)').html();//posicion de la tabla donde se encuentra la dirección
        Tables.clickTablaVariables(dato);
    });
}


function inicializaFase1() {
    mapaCadenas = [];
    State.intermedioReset();
    State.resetState();
    pintaTablas();
    //FIXME: Somehow it is needed to do not show browser buttons at begginig. Solve it to remove this line.
    View.resetFirstPart();
    Tables.limpiaTabla("tablaCodigoFuente");
    Tables.limpiaTabla("tablaCuadruplas");
}



function buscoPosicionPorEnlaceAcceso(variable, indice) {
    let aux, AmbitoElegido, index, pos;
    //busco por EA
    aux = state.arrPilaLlamadas[indice];
    AmbitoElegido = parserUned.yy.tablaAmbitos.get(aux.nombreProcOFunc);

    //parametros
    index = AmbitoElegido.parametros.indexOf(variable);
    if (index != -1) {
        pos = aux.inicioRA
            - 3 //posiciones fijas hasta parámetros
            - (index + 1);
        if (aux.inicioRA == 0) {
            pos = pos + 1;
        }
        return pos;
    }

    //variables
    index = AmbitoElegido.variables.indexOf(variable);
    if (index != -1) {
        pos = aux.inicioRA
            - 4 //posiciones fijas hasta variables
            - AmbitoElegido.numParametros
            - (index + 1);
        if (aux.inicioRA == 0) {
            pos = pos + 1;
        }
        return pos;
    }

    //temporales
    index = AmbitoElegido.temporales.indexOf(variable);
    if (index != -1) {
        pos = aux.inicioRA
            - 4 //posiciones fijas hasta temporales
            - AmbitoElegido.numParametros
            - AmbitoElegido.numVariables
            - (index + 1);
        if (aux.inicioRA == 0) {
            pos = pos + 1;
        }
        return pos;
    }

    //si no encuentra bajo por Enlace de acceso
    let EAPilaLLamadaEncontrada = false;
    while ((!EAPilaLLamadaEncontrada) && (indice < state.arrPilaLlamadas.length - 1)) {
        indice += 1;
        if (aux.EnlaceAcceso == state.arrPilaLlamadas[indice].inicioRA) {
            EAPilaLLamadaEncontrada = true
        }
    }
    if (!EAPilaLLamadaEncontrada)
        throw new Error('Error variable no encontrada');//aqui no debe llegar nunca
    return buscoPosicionPorEnlaceAcceso(variable, indice);
}

/**
* Recupera el valor de una cadena de texto
* @param {String} cadena cadena de texto
*/
function recuperaValorCadena(cadena) {
    return mapaCadenas.get(cadena);
}


/**
* Recupera el valor del enlace de Acceso
* @param {String} nbProcOFunc nombre procedimiento o función
*/
function traeEnlaceDeAcceso(nombreProcOFunc) {
    let enlaceAcceso = 0;
    let i = 0;
    const iMax = state.arrPilaLlamadas.length;
    let encontrado = false;

    if (iMax > 0) {
        do {
            if (state.arrPilaLlamadas[i].nombreProcOFunc != nombreProcOFunc) {
                let AmbitoElegido = parserUned.yy.tablaAmbitos.get(state.arrPilaLlamadas[i].nombreProcOFunc);
                if (AmbitoElegido.simbolos.has(nombreProcOFunc)) {
                    enlaceAcceso = state.arrPilaLlamadas[i].inicioRA;
                    encontrado = true;
                }
            }
            i += 1;
        } while (!encontrado && iMax > i);
    }
    return enlaceAcceso;
}

/**
 * Procedement for HALT label. It stops the machine and paint the tables properly.
 */
function halt(){
    Tables.coloreaTodasInstrucciones();
    state.running = false;
    console.warn("HALT");
    //TODO: it is required due halt() is used in next for SourceCode->getActiveLine, that stops before process halt label.
    //otherwise the buttons doesn't get update properly.
    View.enableControlButtons((state.indice != 0), state.running);
}


//TODO: Function extremally big, try to factorize or modularize it.

function consumeInstruccion() {
    let qLinea, qcuadrupla, qOperacion, qp1, qp2, qp3;
    qcuadrupla = getIns(state.indice);
    qLinea = 0;
    Tables.setPaintSourceCode(true);
    //
    if (!qcuadrupla.startsWith('[')) {
        //Extraigo la parte de la línea si existe
        qLinea = qcuadrupla.slice(0, qcuadrupla.indexOf('['));
        qcuadrupla = qcuadrupla.replace(qLinea, '');
    }
    //Elimino caracteres no necesarios
    qcuadrupla = qcuadrupla.replace(/[^a-zA-Z 0-9._]+/g, '');
    //divido la cuadrupla
    let splitstring = qcuadrupla.split(" ");
    qOperacion = splitstring[0];
    //Check if it is end of program (HALT) then do not read nulls
    if(qOperacion !== "[HALT"){
        qp1 = splitstring[1];
        qp2 = splitstring[2];
        qp3 = splitstring[3];
    }
    
    //Ejecuto instrucción

    switch (qOperacion) {
        case "ADD":
            //EJ:
            //ADD T_8, T_6, T_7]
            //ADD #-18[.IX], #-19[.IX]
            //MOVE .A,#-20[.IX]
            state.regA = State.recuperaValor(qp2) + State.recuperaValor(qp3);
            state.mapPila.set(State.posMem(State.recuperaPosicionMemoria(qp1)), state.regA);
            break;
        case "BR":
            //[BR L_1, null, null]
            state.indice = Tables.traePosicionEtiqueta(qp1);//Salto a la linea donde esté la etiqueta del primer parametro
            break;
        case "BRF":
            //EJ:
            //[BRF T_14, L_1, null]
            //Si el valor del primer parámetro es cero salto a la posición de la etiqueta que viene en el segundo parámetro
            //CMP #0, #-26[.IX]
            //BZ /L_1
            if (State.recuperaValor(qp1) == 0) {
                state.indice = Tables.traePosicionEtiqueta(qp2); //Salto a la linea donde esté la etiqueta del segundo parametro
            }
            break;
        case "CALL":
            //DIRECCION DE RETORNO
            state.mapPila.set(state.regSP, state.indice);
            State.decSP();
            state.indice = Tables.traePosicionEtiqueta(qp1);//Salto a la linea donde esté la etiqueta del primer parametro
            Tables.setPaintSourceCode(false);
            break;  
        case "DEVCALL":
            //Eliminamos de state.arrMem los valores del RA que cerramos
            { state.arrMem = state.arrMem.filter(reg => reg[0] > state.arrPilaLlamadas[0].inicioRA);

            //Guardamos en temporal el valor de la salida del RA
            if (qp2 != "null") {
                state.mapPila.set(State.posMem(State.recuperaPosicionMemoria(qp2)), state.mapPila.get(State.posMem(state.arrPilaLlamadas[0].inicioRA)));
            }

            //Eliminamos de la pila los valores del RA que cerramos
            let k = State.posMem(state.arrPilaLlamadas[0].inicioRA);
            for (let clave of state.mapPila.keys()) {
                if (clave <= k) {
                    state.mapPila.delete(clave);
                }
            };

            state.regSP = State.posMem(state.arrPilaLlamadas[0].inicioRA);
            //Eliminamos la llamada de la pila de llamadas
            state.arrPilaLlamadas.shift();
            break; }
        case "EQ": //comprara los valores del 2º y 3º parámetro. Si son iguales le asigno un 1 al primer parámetro y sino un 0.
            if (State.recuperaValor(qp2) == State.recuperaValor(qp3)) {
                state.mapPila.set(State.posMem(State.recuperaPosicionMemoria(qp1)), 1);
            }
            else {
                state.mapPila.set(State.posMem(State.recuperaPosicionMemoria(qp1)), 0);
            }
            break;
        case "EXIT":
            state.mapPila.set(State.posMem(state.arrPilaLlamadas[0].inicioRA), State.recuperaValor(qp1));
            break;
        case "FINSUBPROGRAMA":
            state.indice = State.traeDireccionRetornoRA(qp1);  //Salto a la linea de la "Direción de retorno" del RA.
            break;
        case "HALT":
            halt();
            break;
        case "MV":
            //Ej: T_1-->-8
            //;Quadruple - [MV T_1, 5, null]
            //MOVE #5, #-8[.IX]
            { const n = Number.parseInt(qp2, 10);
                state.mapPila.set(
                    State.posMem(State.recuperaPosicionMemoria(qp1)),
                    Number.isNaN(n) ? State.recuperaValor(qp2) : n
                );
            break; }
        case "MVA":
            //Ej: T_0-->-7,
            //;Quadruple - [MVA T_0, A, null]
            //SUB .IX, #4
            //MOVE .A, #-7[.IX]
            state.regA = state.regIX + State.recuperaPosicionMemoria(qp2);
            state.mapPila.set(State.posMem(State.recuperaPosicionMemoria(qp1)), state.regA);
            break;
        case "MVP":
            //r  01  02
            //EJ:
            //"MOVE " + o1 + "," + ".R0\n"
            //"MOVE [.R0]," + r
            state.regR1 = State.recuperaValor(qp2);
            state.mapPila.set(State.posMem(State.recuperaPosicionMemoria(qp1)), state.regR1);
            break;
        case "PARAM":
            state.mapPila.set(state.regSP, State.recuperaValor(qp1));
            State.decSP();
            break;
        case "PUNTEROGLOBAL":
        case "PUNTEROLOCAL":
            for (let [key, value] of parserUned.yy.tablaAmbitos) {

                if (value.nombre == qp3) {
                    //Guardo en el ArrMem los parámetros con la posición que les toca
                    //El valor en state.mapPila ya se lo metí con PARAM
                    if (value.parametros.length != 0) {
                        for (let i = 0;i < value.parametros.length;i++) {
                            state.arrMem.unshift([State.posParametro(state.regR0 - i), value.parametros[i]]);
                        }
                    }

                    //Guardo los temporales tanto en state.mapPila como en state.arrMem
                    if (value.temporales.length != 0) {
                        for (const element of value.temporales) {
                            state.mapPila.set(state.regSP, 0);
                            state.arrMem.unshift([State.posPila(), element]);
                            State.decSP();
                        }
                    }

                    //Creo una llamada en la pila de llamadas
                    state.arrPilaLlamadas.unshift(new pilaLLamada(qp3, state.regR0, value.parametros, State.traeEnlaceDeControl(), traeEnlaceDeAcceso(qp3), value.numVariables, value.temporales.length));
                    //Relleno el enlace de control en la pila  pos EC  #-2[.IX]
                    state.mapPila.set(State.posMem(state.arrPilaLlamadas[0].inicioRA - 2), state.arrPilaLlamadas[0].EnlaceControl);
                    //Relleno el enlace de acceso en la pila  pos EC  #-3[.IX]
                    state.mapPila.set(State.posMem(state.arrPilaLlamadas[0].inicioRA - 3), state.arrPilaLlamadas[0].EnlaceAcceso);

                }
            }
            break;
        case "STARTGLOBAL":
        case "STARTSUBPROGRAMAP":
        case "STARTSUBPROGRAMAF":
            //MOVE .SP,.R0
            state.regR0 = State.posPila();
            //PUSH #-1 VALOR RETORNO
            state.mapPila.set(state.regSP, -1);
            State.decSP();
            //PUSH .SR ESTADO MAQUINA
            state.mapPila.set(state.regSP, state.regSR);
            State.decSP();
            //PUSH .IX ENLACE CONTROL
            state.mapPila.set(state.regSP, state.regIX);
            State.decSP();
            //PUSH  .IX ENLACE ACCESO
            state.mapPila.set(state.regSP, 0);
            State.decSP();
            break;
        case "STP":
            //Ej:T_0 -->-7, T_1-->-8
            //;Quadruple - [STP T_0, T_1, null]
            //MOVE #-7[.IX], .R1
            //MOVE #-8[.IX], [.R1]
            state.regR1 = State.recuperaValor(qp1);
            state.mapPila.set(State.posMem(state.regR1), State.recuperaValor(qp2));
            break;
        case "SUB":
            //EJ:
            //[SUB T_8, T_6, T_7]
            //SUB #-18[.IX], #-19[.IX]
            //MOVE .A,#-20[.IX]
            state.regA = State.recuperaValor(qp2) - State.recuperaValor(qp3);
            state.mapPila.set(State.posMem(State.recuperaPosicionMemoria(qp1)), state.regA);
            break;
        case "INL":
            //No hace nada, solo para indicar etiquetas a donde saltar
            break;
        //case "RETORNO":
        //    alert('AQUI NO ENTRA. NO SE USA ESTA INSTRUCCION');
        //    state.mapPila.set(State.posMem(State.recuperaPosicionMemoria(qp2)),  state.mapPila.get(State.posMem(state.arrPilaLlamadas[0].inicioRA)) );
        //  break;

        //case "VARGLOBAL":
        case "VAR":
            state.mapPila.set(state.regSP, Number.parseInt(qp2,10));
            state.arrMem.unshift([State.posPila(), qp1]);
            State.decSP();
            break;
        case "WRITEINT":
            View.txtAreaConsolaSalida.textContent = View.txtAreaConsolaSalida.textContent + State.recuperaValor(qp1) + String.fromCharCode(13);
            break;
        case "WRITETXT":
            //.slice(1, -1) --> quito el primer y último caracter de la cadena que son las comillas ""
            //String.fromCharCode(13) --> retorno de carro
            View.txtAreaConsolaSalida.textContent = View.txtAreaConsolaSalida.textContent + recuperaValorCadena(qp2).slice(1, -1) + String.fromCharCode(13);
            break;
        default:
            //COMPROBACION DE QUE TODAS LAS INSTRUCCIONES ESTAN HECHAS
            alert('FALTA HACER INSTRUCCION ' + qOperacion);
    }

    pintaTablas();
    //TODO: Check if order matters to reduce lines (activeLine)
    if(state.running){
        Tables.coloreaInstrucciones(state.indice, getActiveLine());
        state.lineaActual = getActiveLine();
    } 
    
    State.addLog(state.indice, state.lineaActual);
    state.indice += 1;
    
    //Update the browsing buttons that correspond with the index in process.
    View.enableControlButtons((state.indice != 0), state.running);
}

/**
 * The function shows by the browser console the error launched by an exception or similar event.
 * @param error Error object captured/launched.
 */
function showCatchedErr(error) {
    console.log('=== ERROR DETAILS ===');
    console.log('Message:', error.message);
    console.log('Type:', error.name);
    console.log('Stack:', error.stack);
    console.log('Full Error:', error);
}

/** ===== DOM MANAGEMENT ZONE ===== */

//Para activar las líneas del textarea del código fuente (cajaCodFuente)
$('#cajaCodigoFuente').numberedtextarea();


// Add the listener to the tables for toggle them on click.
document.addEventListener('DOMContentLoaded', () => {
    Tables.initTableToggles();
});


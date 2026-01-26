/*
   PFG UNED
   Fichero : compilador.js
   Autor   : Jaime Alcalá Galicia
   Version : 1.0
   Fecha   : 01/01/2023
   Descripción: Manejo compilador y código final.
*/
//TODO: Changed: import './API.js';
import { intercambioCompilador, pilaLLamada } from './API.js';
//TODO: Changed: import './parserUned.js';
import parserUned from './parserUned.js';
import * as State from './state.js';  //States used in compilator
import * as View from './viewElements.js'
import { loadExercise } from './exercises.js';

const state = State.state;

let pintoCodFuente = true;
let txtPrograma;
let intermedio = [];
let mapaCadenas = [];

inicializaFase1();


View.cajaCodFuente.addEventListener('focusin', () => {
  View.cajaCodFuente.style.backgroundColor= "transparent";
})

View.opt_mostrarTemp.addEventListener('click', (e) => {
  View.pintaTablas();
})

View.opt_mostrarVisibles.addEventListener('click', (e) => {
  View.pintaTablas();
})

View.opt_mostrarRAReducido.addEventListener('click', (e) => {
  View.pintaTablas();
})

View.btn_compilar.addEventListener('click', (e) => {
  let codigoUsuario;
  //Checking empty text box
  //Changed, cajaMsjCompilado is hidded. So it's turned visible when empty box.
  if (View.cajaCodFuente.value == '') {
    //This is more complicated, in another part of the code it is hidden autmatically again, so remains hidden. Must be found this other place.
    //New way and return:
    View.cajaMsjCompilado.textContent = 'Error. No hay código fuente. '
    View.cajaMsjCompilado.style.backgroundColor = "red";
    //Meanwhile by console.
    console.log('Error. No hay código fuente. ');
    return;
  }

  codigoUsuario = View.cajaCodFuente.value
  state.listaCuadruplas = '';
  mapaCadenas = [];

  //Parse code in text format.
  try {
    parserUned.yy = intercambioCompilador();
    state.listaCuadruplas = parserUned.parse(codigoUsuario);

    state.posLine = 0;
    View.cajaCodFuente.disabled= true ;
    View.cajaCodFuente.style.backgroundColor =  "#90fbab";
    View.inicializaFase2();
    //TODO: Find where is consolaSalida declarated cause it seems that is not here, so where?
    consolaSalida.textContent = '';
    View.cajaMsjCompilado.textContent = 'El programa se ha compilado sin errores. '
    View.cajaMsjCompilado.style.backgroundColor =  "#90fbab";

    const tabs2 = document.querySelectorAll('.tabs a');
    tabs2.forEach(tab => tab.classList.remove('active'));

    //EMPEZAMOS EL INTERMEDIO
    intermedio = [];
    intermedio.push("LIN 1 [STARTGLOBAL null, null, null]"); //"addQuadruple("STARTGLOBAL");"

    state.listaCuadruplas = state.listaCuadruplas.filter(Boolean);//eliminamos los undefined del array listaacuadruplas que viene del parseruned

    state.listaCuadruplas.forEach(function(i){  //y meto los valores en el array intermedio
      intermedio.push( i);
    });

    //Meto las cadenas de de texto en el array de intermedio
    mapaCadenas =  parserUned.yy.cadenasTxt;
    for (let [key, value] of parserUned.yy.cadenasTxt) {
      intermedio.push("[CADENA, " + value + ', ' +  key + ", null]");
    }

    state.listaCuadruplas = intermedio;
    View.crearTablaCodFuenteyCuadruplas([state.listaCuadruplas]);

  } catch(error) {
      document.getElementById("ContenedorResultadoCompilacion").style.display = 'block';
      View.cajaCodFuente.disabled = false;
      View.cajaCodFuente.style.backgroundColor= "red";
      View.cajaMsjCompilado.textContent = error;
      View.cajaMsjCompilado.style.backgroundColor= "red";
      //TODO: Added to see errs by console.
      showCatchedErr(error);
      if(error.hash && error.hash.loc && error.hash.loc.first_line) {
        state.posLine = error.hash.loc.first_line;
      }
      
  }

})


View.btn_cargaActividad.addEventListener('click', (e) => {
 	inicializaFase1();
 	let valorSelect = document.getElementById('num-ejercicio').value;
	txtPrograma = loadExercise(valorSelect);
    //TODO: removing JQuery to unify style.
 	//$('#cajaCodigoFuente').val(txtPrograma).change();
    //Alternative
    View.cajaCodFuente.value = txtPrograma;
    View.cajaCodFuente.dispatchEvent(new Event('change'));
})


View.btn_reiniciar.addEventListener('click', (e) => {
  inicializaFase1();
  txtPrograma = "";
  //TODO: removing JQuery to unify style.
  //$('#cajaCodigoFuente').val(txtPrograma).change();
  //Alternative
  View.cajaCodFuente.value = txtPrograma;
  View.cajaCodFuente.dispatchEvent(new Event('change'));

})

View.btn_sigInstruccion.addEventListener('click', (e) => {
  nextInst();
})

//TEMP function to track decoupling view from control. Tested OK.
function nextInst(){
    consumeInstruccion();
}


/**
 * The procedure does a call back action, returning to the previous instruction calculated.
 * <p>
 * This event provoke a restart to the secuence, clearing all previous values from the State and
 *  emulating clicking action on the botton till get the previous instruction using an index.
 */
function backInst(){
    console.log('Testing Ins back function:');
    let index = state.indice
    //TODO: Once finalized, remove logs lines.
    console.log(index);
    //Reset previous values.
    State.resetState();
    //Firstly we will compile the same code again
    View.btn_compilar.click();
    //Finally give as many steps comsuming instructions as we need.
    for(var i = 1; i < index; i++){ nextInst(); }
    console.log(state.indice);
}


View.btn_prevInstruccion.addEventListener('click', (e) => {
    backInst();
})


//WIP
View.btn_prevLinea.addEventListener('click', (e) => {
    console.log('Testing Line back function:');
    let index = state.indice;
    let elementInstruccion = getItemsTable("tablaCuadruplas");
    let lastLine = extraeLinea(elementInstruccion[state.indice].innerText);
    let continuo = true;
    
    console.log(index, lastLine);
    //Reset previous values.
    State.resetState();
    //Firstly we will compile the same code again
    View.btn_compilar.click();
    //Finally give as many steps comsuming instructions as we need.
    while ( isNextInstruction() && continuo ){
  //   if (state.lineaActual != extraeLinea(elementInstruccion[state.indice].innerText)) {
       if (state.lineaActual === lastLine) {
         continuo = false;
       } else {
         consumeInstruccion();
       }
    }
    console.log(state.indice, lastLine);
})

View.btn_sigLinea.addEventListener('click', (e) => {
  let continuo = true;
  let elementInstruccion = getItemsTable("tablaCuadruplas");
  state.lineaActual = extraeLinea(elementInstruccion[state.indice].innerText);
  //TODO: modified, the evaluation continuo === true had not sense at all here.
  while ( isNextInstruction() && continuo  ){
    consumeInstruccion();
    if (state.lineaActual != extraeLinea(elementInstruccion[state.indice].innerText)) {
      continuo = false;
    }
  }

  if (!isNextInstruction()){
      coloreaTodasInstrucciones();
      View.disableControlButtons();
  }
})

/**
 * Execute the full compilation of the code.
 */
View.btn_ejecucionCompleta.addEventListener('click', (e) => {
  while (isNextInstruction()) {  consumeInstruccion(); }
  coloreaTodasInstrucciones();
  View.disableControlButtons();
})

//TODO: ADDED AUXILIARY FUNCTIONS

/**
 * The function returns the items into an array from the referenced table.
 *  It doesn't check if the table exists nor a valid one.
 * <p>The functions works only for tables withe elements tagged by name "tr".
 * @param table name of the table.
 * @return items of the referenced table into an array.
 */
function getItemsTable(table){
    var items = document.getElementById(table).getElementsByTagName("tr");
    return items;
}

/**
 * Auxiliary procedure that indicates when no more instructions nor lines availables.
 * @return True if there is another one. Otherwise False.
 */
function isNextInstruction(){
    //Firstly get a copy as a local variable from the table
    const elementInstruccion = getItemsTable("tablaCuadruplas");
    //Returns the results based on the active index (manipulated in consumeInstruccion() ).
    return elementInstruccion[state.indice].innerText != "[HALT null, null, null]";
}


function extraeLinea(qCuadr){
  let linExtraida = '-1';
  if (qCuadr.indexOf("LIN") == 0){
    linExtraida = qCuadr.substring(4, qCuadr.indexOf("["))};
  return(linExtraida);
}


function inicializaFase1() {
  intermedio = [];
  state.listaCuadruplas = [];
  mapaCadenas = [];
  State.resetState();
  
  View.resetFirstPart();
}

/**
 * Calcula la "posición" de la en la pila respecto a state.regSP
 **/
function posPila() {
  return state.regSP - State.maxAddress ;
}

/**
 * Calcula la "posición" de la en la pila respecto a pos
 * * @param {Int} pos Dir ind
 **/
function posPilaDI(pos) {
  return pos - State.maxAddress ;
}

/**
 * Calcula la "posición" del parametro en la pila respecto al inicio de su RA
 * * @param {Int} pos Posicion
 **/
function posParametro(pos) {
  return   pos - State.tamannoFijoRA;
}

/**
* @param {Int} pos Posicion
*/
function posMem(pos) {
  return State.maxAddress + pos ;
}

/**
* Recupera la posición de memoria que ocupa la variable que se le pasa como parámetro
* @param {String} variable variable
*/
function recuperaPosicionMemoria(variable) {
  for(const memo of state.arrMem){
    if (memo[1] == variable){ return memo[0] }
  }
  throw new Error('Error variable no encontrada');//aqui no debería llegar nunca
}

/**
* Recupera el valor de la variable que se le pasa como parámetro
* @param {String} variable variable
*/
function recuperaValor(variable) {
  for(const memo of state.arrMem){
    if (memo[1] == variable){

      //opcion1
      //busco por Enlace de acceso
      //encontradoEA = buscoPosicionPorEnlaceAcceso(variable,0);
      //if (encontradoEA != memo[0]) window.alert('variable  ' + variable + ' ' + encontradoEA +  '--' + memo[0]);

      //opcion2
      //Busco en la pila
      //return state.mapPila.get(posMem(memo[0]));
      var encontradoArrMem = posMem(memo[0]);
      return state.mapPila.get(encontradoArrMem);
    }
  }
  throw new Error('Error variable no encontrada');//aqui no debería llegar nunca
}

/**
* Recupera la variable de la direccion de memoria que se le pasa como parámetro
* @param {int} qPos posicion de memoriavariable
*/
function recuperaVariableArrMem(qPos) {
  var xx;
  let dInd = posPilaDI(qPos);

  for (var i = 0; i < state.arrMem.length; i++) {
    var index = state.arrMem[i].indexOf(dInd);
    if (index > -1) {
      xx = state.arrMem[i][1];
      return xx;
      //TODO: This has not sense after return... FIX IT
      //i = state.arrMem.length;
    }
  }

  throw new Error('Error variable no encontrada');//aqui no debería llegar nunca
}


function buscoPosicionPorEnlaceAcceso(variable,indice) {
  var aux, AmbitoElegido, index, pos;
  //busco por EA
  aux = state.arrPilaLlamadas[indice];
  AmbitoElegido = parserUned.yy.tablaAmbitos.get(aux.nombreProcOFunc);

  //parametros
  index = AmbitoElegido.parametros.indexOf(variable);
  if (index != -1){
    pos = aux.inicioRA
          -3 //posiciones fijas hasta parámetros
          - (index + 1);
    if (aux.inicioRA == 0){
      pos = pos +1;}
    return pos;
  }

  //variables
  index = AmbitoElegido.variables.indexOf(variable);
  if (index != -1) {
    pos = aux.inicioRA
          -4 //posiciones fijas hasta variables
          - AmbitoElegido.numParametros
          - (index + 1);
    if (aux.inicioRA == 0){
        pos = pos +1;}
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
    if (aux.inicioRA == 0){
      pos = pos +1;}
    return pos;
  }

  //si no encuentra bajo por Enlace de acceso
  let EAPilaLLamadaEncontrada = false;
  while ((!EAPilaLLamadaEncontrada) && (indice < state.arrPilaLlamadas.length-1)){
    indice +=1;
    if (aux.EnlaceAcceso == state.arrPilaLlamadas[indice].inicioRA){
      EAPilaLLamadaEncontrada = true
    }
  }
  if (!EAPilaLLamadaEncontrada)
     throw new Error('Error variable no encontrada');//aqui no debe llegar nunca
  return buscoPosicionPorEnlaceAcceso(variable,indice);
}

/**
* Recupera el valor de una cadena de texto
* @param {String} cadena cadena de texto
*/
function recuperaValorCadena(cadena) {
    return mapaCadenas.get(cadena);
}

/**
* Recupera el valor de la variable que se le pasa como parámetro
* @param {String} etiq etiqueta
*/
function traePosicionEtiqueta(etiq) {
  var i = 0;
  var encontrado = false;
  //TODO: Added elementInstruccion here, originally it wasn't
  var elementInstruccion = getItemsTable("tablaCuadruplas");
  
  //TODO: BUGFIX: bad design, it may enter an infite loop due to while condition.
  do
    if (elementInstruccion[i].innerText.includes('INL ' + etiq)) {
        encontrado = true;
    } else {
      i +=1;
    }
  while (! encontrado);
  return i;
}

/**
* Recupera el valor de la dirección de retorno del RA
* Donde habíamos guardado la línea de código desde la cual se había hecho la llamada
* @param {String} nombreProcOFunc nombre procedimiento o función
*/
function traeDireccionRetornoRA(nombreProcOFunc) {
  var i;
  //TODO: FIXME: this conditional has a asignation instead comparator. I change nombreprocfunc = nombreproc for ... == ...
  if (state.arrPilaLlamadas[0].nombreProcOFunc == nombreProcOFunc){
    i = state.mapPila.get(posMem(state.arrPilaLlamadas[0].inicioRA - State.tamannoFijoRA - state.arrPilaLlamadas[0].parametros.length));
  } else {
    throw new Error('Error al traer dir. retorno RA.');//aqui no debería llegar nunca
  }
  return i;
 }

/**
* Recupera el valor del enlace de Control
*/
function traeEnlaceDeControl() {
  var i;
  i = 0;
  if (state.arrPilaLlamadas.length != 0){
    i = state.arrPilaLlamadas[0].inicioRA;
  }
  return i;
}

/**
* Recupera el valor del enlace de Acceso
* @param {String} nbProcOFunc nombre procedimiento o función
*/
function traeEnlaceDeAcceso(nombreProcOFunc) {
  var i,enlaceAcceso, encontrado;
  enlaceAcceso = 0;
  i = 0;
  encontrado = false;
  
  if (state.arrPilaLlamadas.length != 0){
    do{
      if (state.arrPilaLlamadas[i].nombreProcOFunc != nombreProcOFunc){
        AmbitoElegido=  parserUned.yy.tablaAmbitos.get(state.arrPilaLlamadas[i].nombreProcOFunc);
        if (AmbitoElegido.simbolos.has(nombreProcOFunc)){
          enlaceAcceso = state.arrPilaLlamadas[i].inicioRA;
          encontrado = true;
        }
      }
      i +=1;
    } while (! encontrado);
  }
  return enlaceAcceso;
}

function coloreaInstrucciones(){
  var qLinea = -1;
  //TODO: Added elementInstruccion here, originally it wasn't.
  var elementInstruccion = getItemsTable("tablaCuadruplas");
  var elementLineaCodigoFuente = getItemsTable("tablaCodigoFuente");
  
  for (let step = 0; step < elementInstruccion.length; step++) {
    if (state.indice !=step) {
      elementInstruccion[step].style.backgroundColor = "transparent";
    } else {
      elementInstruccion[step].style.backgroundColor = "#33CCFF";
      qLinea = extraeLinea(elementInstruccion[state.indice].innerText)-1;
    }
  }

  if (pintoCodFuente == true){
    for (let step = 0; step < elementLineaCodigoFuente.length; step++) {
      if (qLinea !=step) {
        elementLineaCodigoFuente[step].style.backgroundColor = "transparent";
      } else {
        elementLineaCodigoFuente[step].style.backgroundColor = "#33CCFF";
      }
    }
  }
}


function coloreaTodasInstrucciones(){
    //TODO: Added elementInstruccion here, it wasn't previously
    var elementInstruccion = getItemsTable("tablaCuadruplas");
    var elementLineaCodigoFuente = getItemsTable("tablaCodigoFuente");
  //Coloreo todo el intermedio
  for (let step = 0; step < elementInstruccion.length; step++) {
      elementInstruccion[step].style.backgroundColor = "#33CCFF";
  }
  //Coloreo todo el codigo fuente
  for (let step = 0; step <  elementLineaCodigoFuente.length; step++) {
    elementLineaCodigoFuente[step].style.backgroundColor = "#33CCFF";
  }
}

//TODO: Function extremally big, try to factorize or modularize it.

function consumeInstruccion() {
  var qLinea, qcuadrupla, qOperacion, qp1,qp2,qp3;

  var elementLineaCodigoFuente = getItemsTable("tablaCodigoFuente");
  var elementInstruccion = getItemsTable("tablaCuadruplas");
  
  //TODO: This is too often repeated => it needs a particular function.
  if (!isNextInstruction()){
      coloreaTodasInstrucciones();
      View.disableControlButtons();
  } else {
      qcuadrupla = elementInstruccion[state.indice].innerText;
      qLinea = 0;
      pintoCodFuente = true;
      if (qcuadrupla.indexOf('[') != 0) {
        //Extraigo la parte de la línea si existe
        qLinea = qcuadrupla.slice(0,qcuadrupla.indexOf('['));
        qcuadrupla = qcuadrupla.replace(qLinea,'');
      }
      //Elimino caracteres no necesarios
      qcuadrupla = qcuadrupla.replace(/[^a-zA-Z 0-9._]+/g,'');
      //divido la cuadrupla
      var splitstring = qcuadrupla.split(" ");
      qOperacion = splitstring[0];
      qp1 = splitstring[1];
      qp2 = splitstring[2];
      qp3 = splitstring[3];

      //Ejecuto instrucción

      switch (qOperacion) {
        case "STARTGLOBAL":
        case "STARTSUBPROGRAMAP":
        case "STARTSUBPROGRAMAF":
           //MOVE .SP,.R0
           state.regR0 = posPila();
           //PUSH #-1 VALOR RETORNO
           state.mapPila.set(state.regSP,-1);
           state.regSP -=1;
           //PUSH .SR ESTADO MAQUINA
           state.mapPila.set(state.regSP,state.regSR);
           state.regSP -=1;
           //PUSH .IX ENLACE CONTROL
           state.mapPila.set(state.regSP,state.regIX);
           state.regSP -=1;
           //PUSH  .IX ENLACE ACCESO
           state.mapPila.set(state.regSP,0);
           state.regSP -=1;
           break;
        //case "VARGLOBAL":
        case "VAR":
          state.mapPila.set(state.regSP,parseInt(qp2));
          state.arrMem.unshift([posPila(),qp1]);
          state.regSP -=1;
          break;
        case "PARAM":
          state.mapPila.set(state.regSP,recuperaValor(qp1));
          state.regSP -=1;
          break;
        case "PUNTEROGLOBAL":
        case "PUNTEROLOCAL":
          for (var [key, value] of parserUned.yy.tablaAmbitos) {

            if (value.nombre == qp3){
              //Guardo en el ArrMem los parámetros con la posición que les toca
              //El valor en state.mapPila ya se lo metí con PARAM
              if (value.parametros.length !=0){
                for (let i = 0; i < value.parametros.length;i++) {
                  state.arrMem.unshift([posParametro( state.regR0 - i),value.parametros[i]]);
                }
              }

              //Guardo los temporales tanto en state.mapPila como en state.arrMem
              if (value.temporales.length !=0){
                for (let i = 0; i < value.temporales.length;i++) {
                  state.mapPila.set(state.regSP,0);
                  state.arrMem.unshift([posPila(),value.temporales[i]]);
                  state.regSP -=1;
                }
              }

              //Creo una llamada en la pila de llamadas
              state.arrPilaLlamadas.unshift(new pilaLLamada(qp3,state.regR0,value.parametros,traeEnlaceDeControl(),traeEnlaceDeAcceso(qp3),value.numVariables,value.temporales.length));
              //Relleno el enlace de control en la pila  pos EC  #-2[.IX]
              state.mapPila.set(posMem(state.arrPilaLlamadas[0].inicioRA - 2),state.arrPilaLlamadas[0].EnlaceControl);
              //Relleno el enlace de acceso en la pila  pos EC  #-3[.IX]
              state.mapPila.set(posMem(state.arrPilaLlamadas[0].inicioRA - 3),state.arrPilaLlamadas[0].EnlaceAcceso);

            }
          }
          break;
        case "MV":
          //Ej: T_1-->-8
          //;Quadruple - [MV T_1, 5, null]
          //MOVE #5, #-8[.IX]
          if (!isNaN(qp2)) {
            state.mapPila.set(posMem(recuperaPosicionMemoria(qp1)),parseInt(qp2));
          }
          else{
            state.mapPila.set(posMem(recuperaPosicionMemoria(qp1)),recuperaValor(qp2));
          }
          break;
        case "MVA":
          //Ej: T_0-->-7,
          //;Quadruple - [MVA T_0, A, null]
          //SUB .IX, #4
          //MOVE .A, #-7[.IX]
          state.regA = state.regIX + recuperaPosicionMemoria(qp2);
          state.mapPila.set(posMem(recuperaPosicionMemoria(qp1)),state.regA);
          break;
        case "STP":
          //Ej:T_0 -->-7, T_1-->-8
          //;Quadruple - [STP T_0, T_1, null]
          //MOVE #-7[.IX], .R1
          //MOVE #-8[.IX], [.R1]
          state.regR1 = recuperaValor(qp1);
          state.mapPila.set(   posMem(state.regR1) ,recuperaValor(qp2));
          break;
        case "MVP":
          //r  01  02
          //EJ:
          //"MOVE " + o1 + "," + ".R0\n"
          //"MOVE [.R0]," + r
          state.regR1 = recuperaValor(qp2);
          state.mapPila.set(posMem(recuperaPosicionMemoria(qp1)),state.regR1);
          break;
        case "ADD":
          //EJ:
          //ADD T_8, T_6, T_7]
          //ADD #-18[.IX], #-19[.IX]
          //MOVE .A,#-20[.IX]
          state.regA = recuperaValor(qp2) + recuperaValor(qp3);
          state.mapPila.set(   posMem(recuperaPosicionMemoria(qp1)) ,state.regA);
          break;
        case "SUB":
          //EJ:
          //[SUB T_8, T_6, T_7]
          //SUB #-18[.IX], #-19[.IX]
          //MOVE .A,#-20[.IX]
          state.regA = recuperaValor(qp2) - recuperaValor(qp3);
          state.mapPila.set(   posMem(recuperaPosicionMemoria(qp1)) ,state.regA);
          break;
        case "EQ": //comprara los valores del 2º y 3º parámetro. Si son iguales le asigno un 1 al primer parámetro y sino un 0.
          if (recuperaValor(qp2) == recuperaValor(qp3)){
            state.mapPila.set(   posMem(recuperaPosicionMemoria(qp1)) ,1);
          }
          else{
            state.mapPila.set(   posMem(recuperaPosicionMemoria(qp1)) ,0);
          }
          break;
        case "BRF":
          //EJ:
          //[BRF T_14, L_1, null]
          //Si el valor del primer parámetro es cero salto a la posición de la etiqueta que viene en el segundo parámetro
          //CMP #0, #-26[.IX]
          //BZ /L_1
          if (recuperaValor(qp1) == 0){
            state.indice = traePosicionEtiqueta(qp2); //Salto a la linea donde esté la etiqueta del segundo parametro
          }
          break;
        case "BR":
          //[BR L_1, null, null]
          state.indice =traePosicionEtiqueta(qp1);//Salto a la linea donde esté la etiqueta del primer parametro
          break;
        case "INL":
          //No hace nada, solo para indicar etiquetas a donde saltar
          break;
        case "WRITEINT":
          consolaSalida.textContent = consolaSalida.textContent +  recuperaValor(qp1) + String.fromCharCode(13);
          break;
        case "WRITETXT":
          //.slice(1, -1) --> quito el primer y último caracter de la cadena que son las comillas ""
          //String.fromCharCode(13) --> retorno de carro
          consolaSalida.textContent =   consolaSalida.textContent +  recuperaValorCadena(qp2).slice(1, -1) + String.fromCharCode(13);
          break;
        case "CALL":
          //DIRECCION DE RETORNO
          state.mapPila.set(state.regSP,state.indice);
          state.regSP -=1;
          state.indice =traePosicionEtiqueta(qp1);//Salto a la linea donde esté la etiqueta del primer parametro
          pintoCodFuente = false;
          break;
        case "FINSUBPROGRAMA":
          state.indice =  traeDireccionRetornoRA(qp1);  //Salto a la linea de la "Direción de retorno" del RA.
          break;
        case "EXIT":
          state.mapPila.set(posMem(state.arrPilaLlamadas[0].inicioRA),recuperaValor(qp1));
          break;
        //case "RETORNO":
        //    window.alert('AQUI NO ENTRA. NO SE USA ESTA INSTRUCCION');
        //    state.mapPila.set(posMem(recuperaPosicionMemoria(qp2)),  state.mapPila.get(posMem(state.arrPilaLlamadas[0].inicioRA)) );
        //  break;
        case "DEVCALL":
            //Eliminamos de state.arrMem los valores del RA que cerramos
            state.arrMem = state.arrMem.filter(reg => reg[0] > state.arrPilaLlamadas[0].inicioRA);

            //Guardamos en temporal el valor de la salida del RA
            if (qp2 != "null"){
              state.mapPila.set(posMem(recuperaPosicionMemoria(qp2)), state.mapPila.get(posMem(state.arrPilaLlamadas[0].inicioRA)) );
            }

            //Eliminamos de la pila los valores del RA que cerramos
            var k = posMem(state.arrPilaLlamadas[0].inicioRA);
            for (let clave of state.mapPila.keys()) {
              if (clave <= k){
                state.mapPila.delete(clave);
              }
            };

            state.regSP = posMem(state.arrPilaLlamadas[0].inicioRA);
            //Eliminamos la llamada de la pila de llamadas
            state.arrPilaLlamadas.shift();
          break;
        default:
            //COMPROBACION DE QUE TODAS LAS INSTRUCCIONES ESTAN HECHAS
            window.alert('FALTA HACER INSTRUCCION ' + qOperacion);
      }

      View.pintaTablas();
      coloreaInstrucciones();
      state.indice +=1;
   }
}

/**
 * The function shows by the browser console the error launched by an exception or similar event.
 * @param error Error object captured/launched.
 */
function showCatchedErr(error){
    console.log('=== ERROR DETAILS ===');
    console.log('Message:', error.message);
    console.log('Type:', error.name);
    console.log('Stack:', error.stack);
    console.log('Full Error:', error);
}

//Manejo del DOM
//Para activar las líneas del textarea del código fuente (cajaCodFuente)
$('#cajaCodigoFuente').numberedtextarea();


// Obtener las pestañas y el contenido
const tabs = document.querySelectorAll('.tabs a');
const tabContents = document.querySelectorAll('.tab-content');


// Función para cambiar la pestaña activa
function changeActiveTab(e) {
    e.preventDefault();

    // Cambiar la clase active de la pestaña seleccionada
    tabs.forEach(tab => tab.classList.remove('active'));
    e.target.classList.add('active');

    // Cambiar la clase active del contenido correspondiente
    tabContents.forEach(tabContent => tabContent.classList.remove('active'));
    const href = e.target.getAttribute('href');
    const tabContent = document.querySelector(href);
    tabContent.classList.add('active');
}

// Agregar el evento click a cada pestaña
tabs.forEach(tab => tab.addEventListener('click', changeActiveTab));

emb/**
 * Module to include the elements from the view like:
 *  bottons, text fields, options, etc. Also it includes the functions
 *  to set, inicialize and change their attributes and listeners.
 */

// DOM Elements
export const btn_compilar       = document.getElementById('btn_Compilar');
export const btn_reiniciar      = document.getElementById('btn_Reiniciar');
export const btn_cargaActividad = document.getElementById('btn_CargaActividad');
export const btn_sigInstruccion = document.getElementById("btn_sigInstruccion");
export const btn_prevInstruccion = document.getElementById("btn_prevInstruccion");
export const btn_prevLinea      = document.getElementById("btn_prevLinea");
export const btn_sigLinea       = document.getElementById("btn_sigLinea");
export const btn_ejecucionCompleta = document.getElementById("btn_ejecucionCompleta")

export const tbl_pilaLlamadas   = document.getElementById('tablaPilaLLamadas');

export const opt_mostrarTemp      = document.getElementById('mostrarTemp');
export const opt_mostrarVisibles  = document.getElementById('mostrarVisibles');
export const opt_mostrarRAReducido= document.getElementById('mostrarRAReducido');

export const cajaCodFuente      = document.getElementById('cajaCodigoFuente');
export const cajaMsjCompilado   = document.getElementById('resultadoCompilacion');
export const cajaSimbolos       = document.getElementById('cajaSimbolo');
export const cajaTipos          = document.getElementById('cajaTipo');

const colorResalte = "#FFFF00";
const colorRojo    = "#ff0000";


//Functions
export function inicializaFase2() {
  document.getElementById("ContenedorResultadoCompilacion").style.display = 'block';
  document.getElementById("Fase2A").style.display = 'block';
  document.getElementById("Fase2B").style.display = 'block';
  //Buttons
  btn_sigInstruccion.style.display = 'inline-block';
  btn_prevInstruccion.style.display = 'inline-block';
  btn_sigLinea.style.display = 'inline-block';
  btn_prevLinea.style.display = 'inline-block';
  btn_ejecucionCompleta.style.display = 'block';
}

/**
 * The procedure restart main components from the fist part of the main Window view.
 *  It particularly reset tables, and controls in the Phase 2 of the compiler view where the results
 *  are shown.
 */
export function resetFirstPart(){
    cajaCodFuente.style.backgroundColor = "transparent";
    cajaCodFuente.disabled= false;
    cajaMsjCompilado.textContent = '';
    
    pintaTablas();
    document.getElementById("ContenedorResultadoCompilacion").style.display = 'none';
    document.getElementById("Fase2A").style.display = 'none';
    document.getElementById("Fase2B").style.display = 'none';
    limpiaTabla("tablaCodigoFuente");
    limpiaTabla("tablaCuadruplas");
}

/**
 * Auxiliary procedure to disable buttons.
 * Main use: When no more instructions/lines to process.
 **/
export function disableControlButtons(){
    btn_sigInstruccion.style.display = 'none';
    btn_sigLinea.style.display = 'none';
    btn_ejecucionCompleta.style.display = 'none';
    //TODO: Add controls to keep disable back bottons when we are in line 0.
    
}

export function crearTablaCodFuenteyCuadruplas(datosTabla) {
  State.resetState();
  View.pintaTablas();
  limpiaTabla("tablaCodigoFuente");
  limpiaTabla("tablaCuadruplas");
  limpiaTabla("tablaPila");
  limpiaTabla("tablaVariables");

  //TABLA CUADRUPLAS
  let tablaCuadrupla = document.createElement('table');
  let cuerpoTablaCuadrupla = document.createElement('tbody');

  datosTabla.forEach(function(datosFilas) {
    datosFilas.forEach(function(datosCeldas) {
      let fila = document.createElement('tr');
      let celda = document.createElement('td');
      celda.appendChild(document.createTextNode(datosCeldas));
      fila.appendChild(celda);
      cuerpoTablaCuadrupla.appendChild(fila);
    });
  });

  setAttTable(tablaCuadrupla, "tablaCuadruplas", cuerpoTablaCuadrupla, "tabTablaCuadruplas");

  //TABLA COD FUENTE
  let lines = View.cajaCodFuente.value.split("\n");
  let tablaCodigoFuente = document.createElement('table');
  let cuerpoTablaCodigoFuente = document.createElement('tbody');

  for(let i = 0;i < lines.length;i++){
    let fila = document.createElement('tr');
    let celda = document.createElement('td');
    celda.appendChild(document.createTextNode(i + 1 + '.' ));
    celda.appendChild(document.createTextNode(lines[i]));
    fila.appendChild(celda);
    cuerpoTablaCodigoFuente.appendChild(fila);
  }

  setAttTable(tablaCodigoFuente, "tablaCodigoFuente", cuerpoTablaCodigoFuente, "tabCodigoFuente");
}


function perteneceRAReducido(qDesc) {
  return (qDesc == 'Valor retorno' || qDesc.includes('Enlace control') || qDesc.includes('Enlace acceso') );
}

function perteneceTemporal(qDesc) {
  return qDesc.includes('Temporal');
}

function toggleTabla(tablaId) {
  let tabla = document.getElementById(tablaId);
  if (tabla.style.display === "none") {
    tabla.style.display = "block";
  } else {
    tabla.style.display = "none";
  }
}

function pintaTablas(){
  pintaTablaPila();
  pintaTablaVariables();
  pintaCallStack();
}

function limpiaTabla(qTabla){
  if (document.getElementById(qTabla)){
     document.getElementById(qTabla).remove();
  }
}

/**
 * Ilumina las posiciones relacionadas con la variable seleccionada
 * * @param {Int} dir Direccion de la variable
 **/
function clickTablaVariables(dir) {
    let i;
  pintaTablas();
  //Lineas pila de llamadas
  const elementPilaLlamadas = getItemsTable("tablaPilaLlamadas");
  
  if ( elementPilaLlamadas.length >1){
    i =1;
    do{
      if ( elementPilaLlamadas[i].cells[2].innerHTML >= dir) {
          elementPilaLlamadas[i].style.backgroundColor = colorResalte;
          i = elementPilaLlamadas.length;
      }
      i +=1;
    } while ( elementPilaLlamadas.length > i);
  }

  //Lineas pila de control
  const elementPila = getItemsTable("tablaPila");

  if ( elementPila.length >1){
    i =1;
    do{
      if ( elementPila[i].cells[0].innerHTML == dir) {
        elementPila[i].style.backgroundColor = colorResalte;
        i = elementPila.length;
      }
      i +=1;
    } while ( elementPila.length >i);
  }

  //Lineas estado del cómputo
  const elementTabVariables = getItemsTable("tablaVariables");
  if (elementTabVariables.length >1){
    i =1;
    do{
      if (elementTabVariables[i].cells[2].innerHTML == dir) {
        elementTabVariables[i].style.backgroundColor = colorResalte;
        i=elementTabVariables.length;
      }
      i +=1;
    } while (elementTabVariables.length >i);
  }
}

/**
 * Ilumina las posiciones relacionadas con la variable seleccionada
 * * @param {Int} dir Direccion de la variable
 * * @param {String} descrip Descripción de la variable
 **/
function clickTablaPila(dir,descrip) {
   //TODO: This function is a little complexe to understand. Many loops repeated
   //It requires a huge refactoring and restructuration.
   let i;
  pintaTablas();
  //Me quedo con la parte interesante de la descripción

  if (descrip.includes('Enlace')){
    descrip = descrip.replace('Enlace acceso ', '');
    descrip = descrip.replace('Enlace control ', '');
    descrip = descrip.replaceAll('-', '');
    descrip = descrip.replace('>', '');
    descrip = descrip.replace('&gt; ', '');
  }


  //Lineas pila de llamadas
  const elementPilaLlamadas = getItemsTable("tablaPilaLlamadas");

    if ( elementPilaLlamadas.length > 1){
        i = 1;
        do{
          if ( elementPilaLlamadas[i].cells[2].innerHTML >= dir) {
              elementPilaLlamadas[i].style.backgroundColor = colorResalte;
              i = elementPilaLlamadas.length;
          }
          i += 1;
        }
        while ( elementPilaLlamadas.length > i);
    }

  if ( elementPilaLlamadas.length > 1){
    i = 1;
    do{
      if (elementPilaLlamadas[i].cells[2].innerHTML >= descrip) {
          elementPilaLlamadas[i].style.color = colorRojo;
          i = elementPilaLlamadas.length;
      }
      i += 1;
    } while (elementPilaLlamadas.length > i);
  }

  //Lineas pila de control
  const elementPila = getItemsTable("tablaPila");

  if (elementPila.length > 1){
    i = 1;
    do{

      if (elementPila[i].cells[0].innerHTML == dir){
        elementPila[i].style.backgroundColor = colorResalte;
      }

      if (elementPila[i].cells[0].innerHTML == descrip){
        elementPila[i].style.color = colorRojo;
      }

      i += 1;
    } while (elementPila.length >i);
  }

  //Lineas estado del cómputo
  const elementTabVariables = getItemsTable("tablaVariables");
  
  if (elementTabVariables.length > 1){
    i = 1;
    do{
      if (elementTabVariables[i].cells[2].innerHTML ==dir)
      {
        elementTabVariables[i].style.backgroundColor = colorResalte;
        i=elementTabVariables.length;
      }
      i += 1;
    }
    while (elementTabVariables.length >i);

  }
}

/**
 * Ilumina las posiciones de la pila de control de la llamada que se ha seleccionado
 * * @param {String} nombreProcOFunc Nombre de la llamada
 * * @param {Int} dir Direccion inicial del RA de la llamada
 **/
function clickPilaLlamadas(nombreProcOFunc,dir) {
    let encontrado,desdePosPila, hastaPosPila, i;
    pintaTablas();
    //Lineas pila de llamadas
    //TODO: This was detected like local var, I have added the var declaration. Be aware in case of error.
    const elementPilaLlamadas = getItemsTable("tablaPilaLlamadas");
      
      if (elementPilaLlamadas.length >1){
        i =1;
        do{
          if ((elementPilaLlamadas[i].cells[0].innerHTML ==nombreProcOFunc) &&
              (elementPilaLlamadas[i].cells[2].innerHTML == dir))
              elementPilaLlamadas[i].style.backgroundColor = colorResalte;
          i +=1;
        } while (elementPilaLlamadas.length >i);

      }

      //Lineas pila de control
      const elementPila = getItemsTable("tablaPila");
      
      desdePosPila = 0;
      hastaPosPila = 0;
      i = 0;
      encontrado = false;

      if (state.arrPilaLlamadas.length != 0){
        do{
          desdePosPila = hastaPosPila +1;
          hastaPosPila = posMem(state.arrPilaLlamadas[i].inicioRA);

          if ((state.arrPilaLlamadas[i].nombreProcOFunc == nombreProcOFunc) && (posMem(state.arrPilaLlamadas[i].inicioRA)==dir)){
              encontrado = true;
          } else {  i +=1;}

        } while (! encontrado);
      }

      if (elementPila.length >1){
        i =1;
        do{
            let item = elementPila[i].cells[0].innerHTML;
            if ((item >=desdePosPila) && (item <=hastaPosPila) && (item != "") ){
              elementPila[i].style.backgroundColor = colorResalte;
            }
            i +=1;
        } while (elementPila.length >i);

      }
      //Lineas estado del cómputo
      let elementTabVariables = getItemsTable("tablaVariables");
      
      if (elementTabVariables.length >1){
        i =1;
        do{
            let item = elementTabVariables[i].cells[2].innerHTML;
            if ((item >=desdePosPila) && (item <=hastaPosPila) && (item != "") ){
                elementTabVariables[i].style.backgroundColor = colorResalte;
          }
          i +=1;
        } while (elementTabVariables.length >i);

      }
}

function traeDescripcionPosicion(pos,dir) {
  if (state.arrPilaLlamadas.length !=0){
    for (let i = 0; i <= state.arrPilaLlamadas.length-1; i++) {
      let voyPor,valRet, EsMaq,EC,EA,ParamDesde,ParamHasta,DireRet,VarDesde,VarHasta,TempDesde,TempHasta,qcorrespondeALlamada;
      let a = posMem(state.arrPilaLlamadas[i].inicioRA);
     
       if (pos <= a){
        qcorrespondeALlamada = state.arrPilaLlamadas[i].nombreProcOFunc;
        valRet = posMem(state.arrPilaLlamadas[i].inicioRA);
        EsMaq = valRet-1;
        EC = EsMaq - 1;
        EA = EC - 1;
        voyPor = EA

        if (state.arrPilaLlamadas[i].parametros.length !=0) {
          ParamDesde = voyPor - 1;
          ParamHasta = ParamDesde-state.arrPilaLlamadas[i].parametros.length + 1;
          voyPor = ParamHasta;
        }

        if (i != state.arrPilaLlamadas.length-1){// al del main no le pongo dirección de retorno
          DireRet = voyPor - 1;
          voyPor = DireRet;
        }

        if (state.arrPilaLlamadas[i].numVariables !=0){
          VarDesde = voyPor -1;
          VarHasta = VarDesde -state.arrPilaLlamadas[i].numVariables + 1 ;
          voyPor = VarHasta;
        }

        if (state.arrPilaLlamadas[i].numTemporales !=0){
          TempDesde =  voyPor -1;
          TempHasta = TempDesde - state.arrPilaLlamadas[i].numTemporales + 1;
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
        } else if (  (state.arrPilaLlamadas[i].parametros.length !=0) && (ParamDesde >= pos) && (ParamHasta <= pos) ) {
            return 'Parámetro --> '  + recuperaVariableArrMem(pos)
        } else if   (pos == DireRet) {
            return 'Dir. retorno'
        } else if (  (state.arrPilaLlamadas[i].numVariables !=0) && (VarDesde >= pos) && (VarHasta <= pos) ) {
            return 'Variable --> '  + recuperaVariableArrMem(pos)
        } else if (  (state.arrPilaLlamadas[i].numTemporales !=0) && (TempDesde >= pos ) && (TempHasta <= pos) ) {
            return 'Temporal --> '  + recuperaVariableArrMem(pos)
        } else { return ''}

      }
    }
  }
  return '';
}

export function pintaTablaPila() {
  let muestroRaReducido = document.getElementById("mostrarRAReducido").checked;
  let muestroTemporales = document.getElementById("mostrarTemp").checked;

  const miMapa = new Map([...state.mapPila.entries()].sort());
  limpiaTabla("tablaPila");
  let FlagLinBlanca;
  
  //Creation of the Table for Stack.
  const columns = ['Dir.', 'Valor', 'Descripción'];
  const tablaPila = createTable(columns);

  let cuerpoTabla = document.createElement('tbody');
  let qDescripcion;
  for (let [key, value] of miMapa) {
    qDescripcion = traeDescripcionPosicion(key,value);

    let muestroLinea = false;

    if (!muestroRaReducido || (muestroRaReducido && perteneceRAReducido(qDescripcion)))
        muestroLinea = true;

    if (!muestroTemporales && perteneceTemporal(qDescripcion))
        muestroLinea = false;

    if (muestroLinea){
        if (qDescripcion == 'Valor retorno') {
            FlagLinBlanca = false;
        }
        //Define cells names.
        const cells = [key, value, qDescripcion];
        //Create row
        const fila = createRow(cells);
        //Add it to the table.
        cuerpoTabla.appendChild(fila);
  
    } else if (!FlagLinBlanca){
        FlagLinBlanca = true;
        //Para dejar "Simular" separación del RA en el modo reducido
        for (let step = 0; step < 4; step++) {
            //Define cells names.
            const cells = [' ', '', ''];
            //Create row
            const fila = createRow(cells);
            //Add it to the table.
            cuerpoTabla.appendChild(fila);
        }
    }
  }

  setAttTable(tablaPila, "tablaPila", cuerpoTabla, "divpila");
  //Add event listener.
  $('#tablaPila tr').on('click', function(){
    let dato1 = $(this).find('td:first').html();//Dirección
    let dato2 = $(this).find('td:last').html();//Descripcion dirección
    if (dato2 != '')
      clickTablaPila(dato1,dato2);
  });
}

/**
 * Auxiliar method to add some common attributes to a table.
 *  It sets the border width to 2, assing an identificator (id), add a bodty to that table (very common in the functions of use) and
 *  add it to the document (HTML).
 * @param table the table to modify to manipulate.
 * @param id the string to assign to that table as ID.
 * @param body the body of the table, usually with the cells.
 * @param label identificator into the document (div or another) where to place the table with its attributes.
 */
function setAttTable(table, id, body, label){
    table.setAttribute("border", 2);
    table.setAttribute("id", id);
    table.appendChild(body);
    document.getElementById(label).appendChild(table);   
}

/**
 * Auxiliar function to creates a table with the header with its columns names.
 *  The columns names comes from the array passed by reference.
 * @param columns it's an array with the name of each column.
 * @return table the conformed table.
 */
function createTable(columns){
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const row   = document.createElement('tr');
    
    columns.forEach(text => {
        const cell = document.createElement('th');
        cell.txtContent = text;
        row.appendChild(cell);
    });
    
    thead.appendChild(row);
    table.appendChild(thead);
    return table;
}

/**
 * The function create a row for a table with texts as values into each cell.
 *  For that purpose it receives an arrawy with the text values of each cell of 'td' type.
 * @param rowsList array with each text in order to assign to every cell.
 * @return the row conformed to the requiriments.
 */
function createRow(rowsList){
    const row = document.createElement('tr');
    
    rowsList.forEach(text => {
        const cell = document.createElement('td');
        cell.appendChild(document.createTextNode(text));
        row.appendChild(cell);
    });
    
    return row;
}

export function pintaTablaVariables() {
  let muestroTemporales = document.getElementById("mostrarTemp").checked;
  let muestroVisibles = document.getElementById("mostrarVisibles").checked;
  const locMap = new Map();
  locMap.clear()
  limpiaTabla("tablaVariables");
  //Creation of the Table for variables.
  const columns = ['Variable', 'Valor', 'Dir.', 'Visible'];
  const tablaVariables = createTable(columns);
  

  let cuerpoTabla = document.createElement('tbody');
  state.arrMem.forEach((item)=>{
    let muestroTemp = false;
      let muestroVis = false;
      if (muestroTemporales || (!muestroTemporales && ( item[1].slice(0,2) != 'T_' ))){
          muestroTemp = true;
      }

      if (!muestroVisibles || (muestroVisibles && !locMap.has(item[1]) ) ){
          muestroVis = true;
      }

      if (muestroTemp && muestroVis){
        const cells = [item[1], state.mapPila.get(posMem(item[0])), posMem(item[0])];
        //For last cell, it varys its text depending on extra item.
        let txt3;

        if( !locMap.has(item[1]) ) {
            locMap.set(item[1],posMem(item[0]));
            txt3 = 'Si';
        }else{
            txt3 = 'No';
        }
        //add it to the array to create the whole row.
        cells.push(txt3);
        //creating the whole row.
        const fila = createRow(cells);
        //add the row to the table.
        cuerpoTabla.appendChild(fila);
      }
    })
  
  setAttTable(tablaVariables, "tablaVariables", cuerpoTabla, "divvariable");
  //Add event listener.
  $('#tablaVariables tr').on('click', function(){
    let dato = $(this).find('td:eq(2)').html();//posicion de la tabla donde se encuentra la dirección
    clickTablaVariables(dato);
  });
}


export function pintaCallStack() {
    
  limpiaTabla("tablaPilaLlamadas");
  
  if (state.arrPilaLlamadas.length != 0){
    const columns = ['Llamada proc-fun', 'Inicio RA', 'Dir.'];
    const tablaPilaLlamadas = createTable(columns);

    let cuerpoTabla = document.createElement('tbody');
    let i = 0;
    
    do {
        //create cells names array
        const cellsNames = [state.arrPilaLlamadas[i].nombreProcOFunc, state.arrPilaLlamadas[i].inicioRA, posMem(state.arrPilaLlamadas[i].inicioRA)];
        //create row
        const fila = createRow(cellsNames);
        //add it to the table
        cuerpoTabla.appendChild(fila);
        i += 1;
    } while (i < state.arrPilaLlamadas.length);

    setAttTable(tablaPilaLlamadas, "tablaPilaLlamadas", cuerpoTabla, "divpilaLlamadas");
    //Add event listener.
    $('#tablaPilaLlamadas tr').on('click', function(){

      let dato1 = $(this).find('td:first').html();
      let dato2 = $(this).find('td:last').html();
      clickPilaLlamadas(dato1,dato2);
    });
  }
}


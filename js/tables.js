/**
 * This file contains functions and attributes for the tables.
 * Mainly it unload other modules of code that should be grouped here.
 */

export const colorRojo = "rgb(255, 255, 0)";            //Rojo
export const colorResalte = "rgb(255, 255, 0)";         //Amarillo
export const colorResalte2 = "rgb(0, 255, 0)";          //Verde

export const COLOR_LIGHTGREEN = "rgb(144, 251, 171)";  //"#90fbab"; //Light green
export const colorMalva = "rgb(140, 100, 200)";         //Morado
export const colorInstruccion = "rgb(51, 204, 255)";    //Celeste
export const NOCOLOR = '';

export const tbl_pilaLlamadas = document.getElementById('tablaPilaLLamadas');

let elementInstruccion = [];  //TODO: It may fail since it was LET and now const in order to export it. Some functions create a new one.

let pintoCodFuente = true;

//TODO AUX ZONE


/**
 * Set the flag that indicates if the source coude must be painted or not.
 * @param {boolean} v : True for painting the source code, otherwise False.
 */
export function setPaintSourceCode(v){
    pintoCodFuente = v;
}

export function coloreaTodasInstrucciones() {
    //TODO: Added elementInstruccion here, it wasn't previously
    const elementInstruccion = getItemsTable("tablaCuadruplas");
    const elementLineaCodigoFuente = getItemsTable("tablaCodigoFuente");
    //Coloreo todo el intermedio
    for (const element of elementInstruccion) {
        element.style.backgroundColor = colorInstruccion;
    }
    //Coloreo todo el codigo fuente
    for (const element of elementLineaCodigoFuente) {
        element.style.backgroundColor = colorInstruccion;
    }
}

/**
 * This function roll up/down hidding a table on. If the table is rolled,
 *  it unroll it, in the other case it rolls it on.
 * @param tablaId the ID of the table to roll up or down.
 * @return nothing, just in case the table doesn't exist it execute a return to the previous function.
 */
function toggleTabla(tablaId) {
    let tabla = document.getElementById(tablaId);
    //Check firstly if the table already exists.
    if (!tabla) return;
    //If it exists go ahead with the rest.
    if (tabla.style.visibility === "hidden") {
        tabla.style.visibility = "visible";
    } else {
        tabla.style.visibility = "hidden";
    }
}

export function limpiaTabla(qTabla) {
    if (document.getElementById(qTabla)) {
        document.getElementById(qTabla).remove();
    }
}





//TODO: Imported function... check if I have already implemented. Sounds to me that yes.
export function resetColoresCodigoIntermedio() {
    for (const element of elementInstruccion) {
        let color = element.style.backgroundColor;
        if (color == colorResalte) {
            element.style.backgroundColor = "transparent";
        }
        if (color == colorResalte2) {
            element.style.backgroundColor = colorInstruccion;
        }
    }
}

/**
 * Reset the colors on the table.
 * The function is key to refresh the marked cells on the table after
 *  another click on a row or cell. So it allows to repaint it properly
 *  after the reset.
 */
export function resetTableColors() {
    const tables = ['tablaPila', 'tablaPilaLlamadas', 'tablaVariables'];

    tables.forEach(tableId => {
        const items = getItemsTable(tableId);
        if (items) {
            for (const element of items) {
                element.style.backgroundColor = NOCOLOR;  // Reset background
                element.style.color = NOCOLOR;            // Reset text color.
            }
        }
    });
}

/**
 * Expects a index from state to work with.
 * @param {number} index index from status to start with.
 * @param {*} activeLine 
 */
export function coloreaInstrucciones(index, activeLine) {
    let qLinea = -1;
    //TODO: Added elementInstruccion here, originally it wasn't.
    const elementInstruccion = getItemsTable("tablaCuadruplas");
    const elementLineaCodigoFuente = getItemsTable("tablaCodigoFuente");

    for (let step = 0;step < elementInstruccion.length;step++) {
        if (index != step) {
            elementInstruccion[step].style.backgroundColor = "transparent";
        } else {
            elementInstruccion[step].style.backgroundColor = colorInstruccion;
            qLinea = activeLine - 1;
        }
    }

    if (pintoCodFuente) {
        for (let step = 0;step < elementLineaCodigoFuente.length;step++) {
            if (qLinea != step) {
                elementLineaCodigoFuente[step].style.backgroundColor = "transparent";
            } else {
                elementLineaCodigoFuente[step].style.backgroundColor = colorInstruccion;
            }
        }
    }
}

/** ====== CREATE ZONE ====== */ 

/**
* Recupera el valor de la variable que se le pasa como parámetro
* @param {String} etiq etiqueta
*/
export function traePosicionEtiqueta(etiq) {
    let i = 0;
    let encontrado = false;
    //TODO: getItemsTable may returns NULL and here is not control about it.
    const elementInstruccion = getItemsTable("tablaCuadruplas");

    //FIXME: bad design, it may enter an infite loop due to while condition.
    do
        if (elementInstruccion && elementInstruccion[i].innerText.includes('INL ' + etiq)) {
            encontrado = true;
        } else {
            i += 1;
        }
    while (!encontrado);
    return i;
}

/**
 * Returns the table rows as an HTMLCollection.
 *  It doesn't check if the table exists nor a valid one.
 * <p>The functions works only for tables withe elements tagged by name "tr". And in case
 *  the table doesn't exist or doesn't contains elements yet, it returns null.
 * @param {string} tableID name of the table.
 * @return {HTMLCollection|null} items of the referenced table into an array. Null otherwise
 */
export function getItemsTable(tableID) {
    const table = document.getElementById(tableID);
    //Check if the table exists to returns elements, otherwise abort and return null.
    return table ? table.getElementsByTagName("tr") : null;
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
export function setAttTable(table, id, body, label) {
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
export function createTable(columns) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const row = document.createElement('tr');

    columns.forEach(text => {
        const cell = document.createElement('th');
        cell.textContent = text;
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
export function createRow(rowsList) {
    const row = document.createElement('tr');

    rowsList.forEach(text => {
        const cell = document.createElement('td');
        cell.textContent = text;
        row.appendChild(cell);
    });

    return row;
}

export function crearTablaCodFuenteyCuadruplas(datosTabla, cajaCodFuente) {

    limpiaTabla("tablaCodigoFuente");
    limpiaTabla("tablaCuadruplas");
    limpiaTabla("tablaPila");
    limpiaTabla("tablaVariables");

    //TABLA CUADRUPLAS
    let tablaCuadrupla = document.createElement('table');
    let cuerpoTablaCuadrupla = document.createElement('tbody');

    let j = 0;
    elementInstruccion = [];
    //
    datosTabla.forEach(function(datosFilas) {
        datosFilas.forEach(function(datosCeldas) {
            let fila = document.createElement('tr');
            let celda = document.createElement('td');
            //Firstly add the cell on the index column for numbers.
            celda.appendChild(document.createTextNode(j + '.'));
            fila.appendChild(celda);
            //new cell for the data
            celda = document.createElement('td');
            celda.appendChild(document.createTextNode(datosCeldas));
            fila.appendChild(celda);
            elementInstruccion.push(fila);                                            //TODO: figure it out, I am not sure the global purpose.
            cuerpoTablaCuadrupla.appendChild(fila);
            j++;
        });
    });

    setAttTable(tablaCuadrupla, "tablaCuadruplas", cuerpoTablaCuadrupla, "tabTablaCuadruplas");

    //TABLA COD FUENTE
    let lines = cajaCodFuente.value.split("\n");
    let tablaCodigoFuente = document.createElement('table');
    let cuerpoTablaCodigoFuente = document.createElement('tbody');

    for (let i = 0;i < lines.length;i++) {
        let fila = document.createElement('tr');
        // cell for index
        let cellIndex = document.createElement('td');
        cellIndex.textContent = (i + 1) + '.';
        // cell for source code contain.
        let cellSourceCode = document.createElement('td');
        cellSourceCode.textContent = lines[i];
        //
        fila.append(cellIndex, cellSourceCode);
        cuerpoTablaCodigoFuente.appendChild(fila);
    }

    setAttTable(tablaCodigoFuente, "tablaCodigoFuente", cuerpoTablaCodigoFuente, "tabCodigoFuente");
}

/**
 * Auxiliar to remark elements that belongs to a column into a table from a point to another one with a specific colour.
 *  Mainly the col (column) parameter store an address (dir), but it may vary on need.
 * @param {string} table table name to operate with.
 * @param {number} col number of the colum where the searching filter must be applied.
 * @param {number} from position on the table (row) to start the operation.
 * @param {number} to last position on the table (row) to apply the operation.
 * @param {color} color color to use in the remark (from available in Tables.js) 
 */
export function remarkElement(table, col, from, to, color){
    //Lineas estado del cómputo
    const elements = Tables.getItemsTable(table);

    if (elements && elements.length > 1) {
        let i = 1;
        do {
            let item = elements[i].cells[col].innerHTML;
            if ((item >= from) && (item <= to) && (item != "")) {
                elements[i].style.backgroundColor = color;
            }
            i += 1;
        } while (elements.length > i);
    }
}

/**
 * The function remarks the address (dir) or values in the referenced table that
 *  match the value parameter. This function requires the Column in the table where the
 *  column of data (addr/val/dir) is placed.
 *  The functon doesn't check if the parameters are valid.
 * @param {string} tableName name of the table to explore to remarks lines.
 * @param {number} col column number of the table that reflects the address value (dir).
 * @param {number} value address number or value to match to remark on the table.
 * @param {color} color Color to use to remark the line.
 */
function remarkValueLine(tableName, col, value, color){
    //Get elements for the table
    const elements = getItemsTable(tableName);
    //Explore the elements array and remarks whose elements match the DIR (address).
    if (elements && elements.length > 1) {
        let i = 1;
        do {
            if (Number(elements[i].cells[col].innerHTML) == value) {
                elements[i].style.backgroundColor = color;
                i = elements.length;
            }
            i += 1;
        } while (elements.length > i);
    }
}


/**
 * The function remarks the addresses (dirs) in the referenced table that are Equal or Greater
 *  than the referenced value. This function requires the Column in the table where the
 *  address (dir) are placed.
 *  The functon doesn't check if the parameters are valid.
 * @param {string} tableName name of the table to explore to remarks lines.
 * @param {number} col column number of the table that reflects the address value (dir).
 * @param {number} dir address number to match to remark on the table. 
 */
function remarkValueLineEG(tableName, col, dir){
    //Get elements for the table
    const elements = getItemsTable(tableName);
    //Check if it is not null and contains data to calc. Same for the others.
    //Explore the elements array and remarks whose elements match the DIR (address).
    if (elements && elements.length > 1) {
        let i = 1;
        do {
            if (Number(elements[i].cells[col].innerHTML) >= dir) {
                elements[i].style.backgroundColor = colorResalte;
                i = elements.length;
            }
            i += 1;
        } while (elements.length > i);
    }
}

/**
 * Function to add a listener to the tables to controle the click action on them.
 *  Basically to show in the web page (HTML) when remark one table or another one.
 *  This function/listener relays on the function toggleTabla(var) and is only used here and in the HTML.
 */
export function initTableToggles() {
    // Event delegation: escuchar en el documento, ejecutar solo si coincide
    document.addEventListener('click', (e) => {
        const toggleElement = e.target.closest('[data-toggle-table]');
        if (toggleElement) {
            const tableId = toggleElement.getAttribute('data-toggle-table');
            toggleTabla(tableId);
        }
    });
}

/**
 * Ilumina las posiciones relacionadas con la variable seleccionada
 * * @param {Int} dir Direccion de la variable
 **/
export function clickTablaVariables(dir) {
    //Check if dir == null in such a case do not proceed with the rest.
    if (!dir) return;
    //reset previous colors
    resetTableColors();
    //TODO one of those above or behind is or must innecesary? Seems they have diferent purpose.
    resetColoresCodigoIntermedio();

    //Lineas pila de llamadas
    remarkValueLineEG("tablaPilaLlamadas", 2, dir);

    //Lineas pila de control
    remarkValueLine("tablaPila", 0, dir, colorResalte);

    //Lineas estado del cómputo
    remarkValueLine("tablaVariables", 2, dir, colorResalte);
}


/**
 * Remarks on the tables all the lines that match the Address (DIR), description or/and value
 *  passed by parameters.
 * @param {Int} dir address of the var to remark.
 * @param {number} valor value for intermediate code to remark. It's a number.
 * @param {String} descrip description of the var to remark.
 **/
export function clickTablaPila(dir, valor, descrip) {
    //Added checked for paramameters null. By now if any of them is null => return.
    if (!dir || !descrip) return;
    //reset previous colors
    resetTableColors();
    //TODO: Added, I think it is not necessary cause implemented somehow. Requires revision.
    resetColoresCodigoIntermedio();

    //Me quedo con la parte interesante de la descripción

    if (descrip.includes('Enlace')) {
        descrip = descrip.replace('Enlace acceso ', '');
        descrip = descrip.replace('Enlace control ', '');
        descrip = descrip.replaceAll('-', '');
        descrip = descrip.replace('>', '');
        descrip = descrip.replace('&gt; ', '');
    }


    //Lines for Call Stack (pila de llamadas)
    remarkValueLineEG("tablaPilaLlamadas", 2, dir);
    // Now remark description match
    remarkValueLine("tablaPilaLlamadas", 2, descrip, colorMalva);

    //Lines for Control Stack (Pila de control)
    remarkValueLine("tablaPila", 0, dir, colorResalte);
    //
    remarkValueLine("tablaPila", 0, descrip, colorMalva);
    //Lineas estado del cómputo
    remarkValueLine("tablaVariables", 2, dir, colorResalte);


    // Linea codigo intermedio
    if (descrip == "Dir. retorno") {
        let color = elementInstruccion[valor].style.backgroundColor;
        if (color == colorInstruccion || color == colorResalte2) {
            elementInstruccion[valor].style.backgroundColor = colorResalte2;
        } else {
            elementInstruccion[valor].style.backgroundColor = colorResalte;
        }
    }
}


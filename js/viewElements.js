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
export const btn_ejecucionCompleta = document.getElementById("btn_ejecucionCompleta")

export const tbl_pilaLlamadas = document.getElementById('tablaPilaLLamadas');

export const opt_mostrarTemp = document.getElementById('mostrarTemp');
export const opt_mostrarVisibles = document.getElementById('mostrarVisibles');
export const opt_mostrarRAReducido = document.getElementById('mostrarRAReducido');

export const cajaCodFuente = document.getElementById('cajaCodigoFuente');
export const cajaMsjCompilado = document.getElementById('resultadoCompilacion');
export const cajaSimbolos = document.getElementById('cajaSimbolo');
export const cajaTipos = document.getElementById('cajaTipo');

export const colorRojo = "rgb(255, 255, 0)";            //Rojo
export const colorResalte = "rgb(255, 255, 0)";         //Amarillo
export const colorResalte2 = "rgb(0, 255, 0)";          //Verde
export const colorMalva = "rgb(140, 100, 200)";         //Morado
export const colorInstruccion = "rgb(51, 204, 255)";    //Celeste
export const NOCOLOR = '';
let elementInstruccion = [];

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
    limpiaTabla("tablaCodigoFuente");
    limpiaTabla("tablaCuadruplas");
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
    //TODO: Delete if all works fine with the toggle tables (clicking on their titles)
    //initTableToggles();
}

//TODO AUX ZONE

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

export function perteneceRAReducido(qDesc) {
    return (qDesc == 'Valor retorno' || qDesc.includes('Enlace control') || qDesc.includes('Enlace acceso'));
}

export function perteneceTemporal(qDesc) {
    return qDesc.includes('Temporal');
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

export function limpiaTabla(qTabla) {
    if (document.getElementById(qTabla)) {
        document.getElementById(qTabla).remove();
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
        //DELETEME: cell.appendChild(document.createTextNode(text));
        cell.textContent = text;
        row.appendChild(cell);
    });

    return row;
}

//TODO: CREATE ZONE

export function crearTablaCodFuenteyCuadruplas(datosTabla) {

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

/**
 * Ilumina las posiciones relacionadas con la variable seleccionada
 * * @param {Int} dir Direccion de la variable
 **/
export function clickTablaVariables(dir) {

    let i;
    //Check if dir == null in such a case do not proceed with the rest.
    if (!dir) return;
    //reset previous colors
    resetTableColors();
    //TODO one of those above or behind is or must innecesary
    resetColoresCodigoIntermedio();

    //Lineas pila de llamadas
    const elementPilaLlamadas = getItemsTable("tablaPilaLlamadas");

    //Check if it is not null and contains data to calc. Same for the others.
    if (elementPilaLlamadas && elementPilaLlamadas.length > 1) {
        i = 1;
        do {
            if (Number(elementPilaLlamadas[i].cells[2].innerHTML) >= dir) {
                elementPilaLlamadas[i].style.backgroundColor = colorResalte;
                i = elementPilaLlamadas.length;
            }
            i += 1;
        } while (elementPilaLlamadas.length > i);
    }

    //Lineas pila de control
    const elementPila = getItemsTable("tablaPila");
    if (elementPila && elementPila.length > 1) {
        i = 1;
        do {
            if (Number(elementPila[i].cells[0].innerHTML) == dir) {
                elementPila[i].style.backgroundColor = colorResalte;
                i = elementPila.length;
            }
            i += 1;
        } while (elementPila.length > i);
    }

    //Lineas estado del cómputo
    const elementTabVariables = getItemsTable("tablaVariables");

    if (elementTabVariables && elementTabVariables.length > 1) {
        i = 1;
        do {
            if (Number(elementTabVariables[i].cells[2].innerHTML) == dir) {
                elementTabVariables[i].style.backgroundColor = colorResalte;
                i = elementTabVariables.length;
            }
            i += 1;
        } while (elementTabVariables.length > i);
    }
}

/**
 * Ilumina las posiciones relacionadas con la variable seleccionada
 * * @param {Int} dir Direccion de la variable
 * * @param {String} descrip Descripción de la variable
 **/
export function clickTablaPila(dir, valor, descrip) {
    //TODO: This function is a little hard to understand. Many loops repeated
    //It requires a huge refactoring and restructuration.
    let i;

    //TODO: Added checked for paramameters null. By now if any of them is null => return.
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


    //Lineas pila de llamadas
    const elementPilaLlamadas = getItemsTable("tablaPilaLlamadas");
    //Check if it is not null and contains data to calc. Same for the others.
    if (elementPilaLlamadas && elementPilaLlamadas.length > 1) {
        i = 1;
        do {
            if (Number(elementPilaLlamadas[i].cells[2].innerHTML) >= dir) {
                elementPilaLlamadas[i].style.backgroundColor = colorResalte;
                i = elementPilaLlamadas.length;
            }
            i += 1;
        }
        while (elementPilaLlamadas.length > i);
    }

    if (elementPilaLlamadas && elementPilaLlamadas.length > 1) {
        i = 1;
        do {
            if (Number(elementPilaLlamadas[i].cells[2].innerHTML) == descrip) {
                elementPilaLlamadas[i].style.backgroundColor = colorMalva;
                i = elementPilaLlamadas.length;
            }
            i += 1;
        } while (elementPilaLlamadas.length > i);
    }

    //Lineas pila de control
    const elementPila = getItemsTable("tablaPila");

    if (elementPila && elementPila.length > 1) {
        i = 1;
        do {
            if (Number(elementPila[i].cells[0].innerHTML) == dir) {
                elementPila[i].style.backgroundColor = colorResalte;
            }

            if (Number(elementPila[i].cells[0].innerHTML) == descrip) {
                elementPila[i].style.backgroundColor = colorMalva;
            }
            i += 1;
        } while (elementPila.length > i);
    }

    //Lineas estado del cómputo
    const elementTabVariables = getItemsTable("tablaVariables");

    if (elementTabVariables && elementTabVariables.length > 1) {
        i = 1;
        do {
            if (Number(elementTabVariables[i].cells[2].innerHTML) == dir) {
                elementTabVariables[i].style.backgroundColor = colorResalte;
                i = elementTabVariables.length;
            }
            i += 1;
        } while (elementTabVariables.length > i);
    }


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


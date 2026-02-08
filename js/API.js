/*
   PFG UNED
   Fichero : API.js
   Autor   : Jaime Alcalá Galicia
   Version : 1.0
   Fecha   : 01/01/2023
   Descripción: API
*/

var intercambioCompilador = function() {
    return {
        // Ámbitos. Pila ámbitos. Para controlar los abiertos
        ambitos: { stack: [] },

        // Tabla de símbolos. Map con los simbolos de cada ámbito
        //Key nombre del simbolo declarado
        //Value un array con los TipoDeSimbolo abiertos en un determinado momento
        tablaSimbolos: new Map(),

        // Tabla de ámbitos. TODOS.
        tablaAmbitos: new Map(),

        // Tabla de tipos.
        tablaTipos: new Map([]),

        //Variables  temporales.
        variableTemporal: new String(''),

        // Cadenas texto.
        cadenasTxt: new Map([]),

        // Etiquetas.
        etiqueta: new String(''),

        /**
         * Devuelve el ámbito actual.
         */
        traeAmbitoActual: function() {
            return this.ambitos.stack[this.ambitos.stack.length - 1];
        },

        /**
         * Devuelve el nombre del ámbito actual.
         */
        traeNombreAmbitoActual: function() {
            return this.ambitos.stack[this.ambitos.stack.length - 1].nombre;
        },

        /**
         * Crea un ámbito con el nombre proporcionado mediante parámetro.
         * @param {string} nombreAmbito El nombre del ámbito.
         */
        abrirAmbito: function(nombreAmbito) {
            this.ambitos.stack.push(new Ambito(nombreAmbito, this.ambitos.stack.length));
        },


        /**
         * Cierra el ámbito actual.
         */
        cierraAmbitoActual: function() {
            if (this.tablaAmbitos.has(this.traeNombreAmbitoActual())) {
                throw new Error('Error en ámbito ' + this.traeNombreAmbitoActual() + '. Ámbito duplicado.');
            } else {
                this.tablaAmbitos.set(this.traeNombreAmbitoActual(), this.traeAmbitoActual());
            }

            // Obtenemos los símbolos del ámbito que se va a cerrar.
            var simbolos = this.traeAmbitoActual().simbolos.keys();
            // Para cada símbolo del ámbito, desapilamos en la tabla de símbolos.
            var simbolo = simbolos.next();
            while (!simbolo.done) {
                // Si el símbolo está en la tabla de símbolos, desapilamos.
                if (this.tablaSimbolos.has(simbolo.value)) {
                    //quitamos la última entrada del array
                    this.tablaSimbolos.get(simbolo.value).pop();
                    //Si no hay mas instancias de ese simbolo abiertas en otras partes de la aplicación la quitamos de la tabla de simbolos
                    if (this.tablaSimbolos.get(simbolo.value).length === 0) {
                        this.tablaSimbolos.delete(simbolo.value);
                    }
                }
                simbolo = simbolos.next();
            }
            // Desapilamos el ámbito.
            this.ambitos.stack.pop();
        },

        /**
         * Indica si un símbolo es visible o no.
         * @param {string} nombreSimbolo Nombre del símbolo.
         */
        esVisible(nombreSimbolo) {
            return this.tablaSimbolos.has(nombreSimbolo);
        },

        /**
         * Error si un símbolo no es visible.
         * No es visible si en ese momento no hay entradas del mismo en la tablaSimbolos.
         * @param {string} nombreSimbolo Nombre del símbolo.
         * @param {number} noLinea Número de línea.
         */
        errorVisibilidad(nombreSimbolo, noLinea) {
            if (!this.tablaSimbolos.has(nombreSimbolo)) {
                throw new Error('Error en línea ' + noLinea + ': El identificador \'' + nombreSimbolo + '\' no existe.');
            }
        },

        /**
        * Devuelve el vínculo actual asociado al identificador.
        *
        * @param {string} nombreSimbolo
        * dev {TipoDeSimbolo}
        */
        traeTipoSimbolo(nombreSimbolo) {
            var tipoSimbolo = this.tablaSimbolos.get(nombreSimbolo);
            return tipoSimbolo[tipoSimbolo.length - 1];
        },

        /**
        * Devuelve el símbolo cuyo identificador se indica mediante parámetro.
        * @param {string} nombreSimbolo El nombre del símbolo.
        */
        traeSimbolo(nombreSimbolo) {
            return this.traeTipoSimbolo(nombreSimbolo).simbolo;
        },

        /**
        * Añade una variable de tipo simple a la tabla de símbolos.
        * @param {number} noLinea El número de línea.
        * @param {string} nombreVariable El nombre de la variable.
        * @param {string} tipo El tipo de la variable.
        */
        nuevoSimboloVariable: function(noLinea, nombreVariable, tipo) {
            var ambitoActual = this.traeAmbitoActual();

            if (!ambitoActual.simbolos.has(nombreVariable)) {
                ambitoActual.simbolos.set(nombreVariable);
                ambitoActual.numVariables += 1;
                var tipoSimbolo = new TipoDeSimbolo(new SimboloDeVariable(nombreVariable, tipo), ambitoActual.nombre);

                if (this.tablaSimbolos.has(nombreVariable)) {
                    this.tablaSimbolos.get(nombreVariable).push(tipoSimbolo);
                } else {
                    this.tablaSimbolos.set(nombreVariable, [tipoSimbolo]);
                }
            } else {
                throw new Error('Error en línea ' + noLinea + ': Variable \'' + nombreVariable + '\'. Identificador ya declarado.');
            }
        },

        /**
        * Añade la lista de variables al Arr variables del ambito en su irden correcto
        * @param {} arrVariables array de variables
        */
        insertaVariablesEnAmbito: function(arrVariables) {
            var ambitoActual = this.traeAmbitoActual();
            if (arrVariables.length != 0) {
                for (let step = 0;step < arrVariables.length;step++) {
                    ambitoActual.variables.push(arrVariables[step]); //
                }
            }
        },

        /**
        * Añade un parámetro de una función p procedimiento a la tabla de símbolos.
        * @param {number} noLinea El número de línea.
        * @param {string} nombreParametro El nombre del parámetro.
        * @param {string} tipo El tipo del parámetro.
        * @param {string} nombreFuncOProc El nombre de la función.
        */
        nuevoSimboloParametro: function(noLinea, nombreParametro, tipo, nombreFuncOProc) {
            var ambitoActual = this.traeAmbitoActual();
            var simboloFuncionOProcedimiento = this.traeTipoSimbolo(nombreFuncOProc).simbolo;

            if ((!(simboloFuncionOProcedimiento instanceof SimboloDeFuncion)) && (!(simboloFuncionOProcedimiento instanceof SimboloDeProcedimiento))) {
                throw new Error('Error en línea ' + noLinea + '. ' + nombreFuncOProc + ' no está declarado como procedimiento o función.');
            }

            if (!ambitoActual.simbolos.has(nombreParametro)) {
                ambitoActual.simbolos.set(nombreParametro);
                ambitoActual.numParametros += 1;
                ambitoActual.parametros.unshift(nombreParametro);
                var tipoSimbolo = new TipoDeSimbolo(new SimboloDeParametro(nombreParametro, tipo, nombreFuncOProc), ambitoActual.nombre);
                simboloFuncionOProcedimiento.parametros.unshift(new SimboloDeParametro(nombreParametro, tipo, nombreFuncOProc));

                if (this.tablaSimbolos.has(nombreParametro)) {
                    this.tablaSimbolos.get(nombreParametro).push(tipoSimbolo);
                } else {
                    this.tablaSimbolos.set(nombreParametro, [tipoSimbolo]);
                }
            } else {
                throw new Error('Error en línea ' + noLinea + ': Parámetro \'' + nombreParametro + '\' de la función \'' + nombreFuncOProc + '\'. Identificador ya declarado.');
            }
        },

        /**
         * Añade un símbolo de función a la tabla de símbolos.
         * @param {number} noLinea El número de línea.
         * @param {string} nombreFuncion El nombre de la función.
         * @param {string} tipo El tipo que retorna la función.
         * @param {*} parametros Los parámetros de la función.
         */
        nuevoSimboloFuncion: function(noLinea, nombreFuncion, tipo, parametros) {
            var ambitoActual = this.traeAmbitoActual();

            if (!ambitoActual.simbolos.has(nombreFuncion)) {
                ambitoActual.simbolos.set(nombreFuncion);
                var tipoSimbolo = new TipoDeSimbolo(new SimboloDeFuncion(nombreFuncion, tipo, parametros), ambitoActual.nombre);

                if (this.tablaSimbolos.has(nombreFuncion)) {
                    this.tablaSimbolos.get(nombreFuncion).push(tipoSimbolo);
                } else {
                    this.tablaSimbolos.set(nombreFuncion, [tipoSimbolo]);
                }
            } else {
                throw new Error('Error en línea ' + noLinea + ': Función \'' + nombreFuncion + '\'. Identificador ya declarado.');
            }
        },

        nuevoSimboloProcedimiento: function(noLinea, nombreProcedimiento, parametros) {
            var ambitoActual = this.traeAmbitoActual();

            if (!ambitoActual.simbolos.has(nombreProcedimiento)) {
                ambitoActual.simbolos.set(nombreProcedimiento);
                var tipoSimbolo = new TipoDeSimbolo(new SimboloDeProcedimiento(nombreProcedimiento, parametros), ambitoActual.nombre);

                if (this.tablaSimbolos.has(nombreProcedimiento)) {
                    this.tablaSimbolos.get(nombreProcedimiento).push(tipoSimbolo);
                } else {
                    this.tablaSimbolos.set(nombreProcedimiento, [tipoSimbolo]);
                }
            } else {
                throw new Error('Error en línea ' + noLinea + ': Procedimiento \'' + nombreProcedimiento + '\'. Identificador ya declarado.');
            }
        },

        /**
         * Indica si el símbolo es o no una variable de tipo simple.
         * @param {string} nombreSimbolo  El nombre del símbolo.
         */
        esVariable(nombreSimbolo) {
            var tipoSimbolo;

            if (this.esVisible(nombreSimbolo)) {
                tipoSimbolo = this.traeTipoSimbolo(nombreSimbolo);
                return tipoSimbolo.simbolo instanceof SimboloDeVariable;
            }
            else {
                return false;
            }
        },

        /**
        * Indica si el símbolo es o no un parametro
        * @param {string} nombreSimbolo  El nombre del símbolo.
        */
        esParametro(nombreSimbolo) {
            var tipoSimbolo;

            if (this.esVisible(nombreSimbolo)) {
                tipoSimbolo = this.traeTipoSimbolo(nombreSimbolo);
                return tipoSimbolo.simbolo instanceof SimboloDeParametro;
            }
            else {
                return false;
            }
        },

        /**
         * Indica si un símbolo no es variable.
         * @param {string} nombreSimbolo Nombre del símbolo.
         * @param {number} noLinea Número de línea.
         */
        errorNoEsVariableoParametro(nombreSimbolo, noLinea) {

            if ((!this.esVariable(nombreSimbolo)) && (!this.esParametro(nombreSimbolo))) {
                throw new Error('Error en línea ' + noLinea + ': El identificador \'' + nombreSimbolo + '\' no es una variable ni un parametro.');
            }
        },

        /**
         * Indica si el símbolo es o no una función.
         * @param {string} nombreSimbolo  El nombre del símbolo.
         */
        esFuncion(nombreSimbolo) {
            var tipoSimbolo;

            if (this.esVisible(nombreSimbolo)) {
                tipoSimbolo = this.traeTipoSimbolo(nombreSimbolo);
                return tipoSimbolo.simbolo instanceof SimboloDeFuncion;
            } else {
                return false;
            }
        },

        /**
         * Indica si un símbolo no es función.
         * @param {string} nombreSimbolo Nombre del símbolo.
         * @param {number} noLinea Número de línea.
         */
        errorNoEsFuncion(nombreSimbolo, noLinea) {
            if (!this.esFuncion(nombreSimbolo)) {
                throw new Error('Error en línea ' + noLinea + ': El identificador \'' + nombreSimbolo + '\' no es una función.');
            }
        },

        /**
         * Indica si el símbolo es o no un procedimiento
         * @param {string} nombreSimbolo  El nombre del símbolo.
         */
        esProcedimiento(nombreSimbolo) {
            var tipoSimbolo;

            if (this.esVisible(nombreSimbolo)) {
                tipoSimbolo = this.traeTipoSimbolo(nombreSimbolo);
                return tipoSimbolo.simbolo instanceof SimboloDeProcedimiento;
            } else {
                return false;
            }
        },

        /**
         * Indica si un símbolo no es procedimiento.
         * @param {string} nombreSimbolo Nombre del símbolo.
         * @param {number} noLinea Número de línea.
         */
        errorNoEsProcedimiento(nombreSimbolo, noLinea) {
            if (!this.esProcedimiento(nombreSimbolo)) {
                throw new Error('Error en línea ' + noLinea + ': El identificador \'' + nombreSimbolo + '\' no es un procedimiento.');
            }
        },

        /**
        * Comprueba el número de parámetros en la llamada a una función o procedimiento.
        * @param {string} nombreFuncOProc El nombre de la función/procedimiento.
        * @param {number} numeroParametros El número de parametros de llamada.
        * @param {number} noLinea El número de línea desde donde se le llama.
        */
        compruebaNumeroParametros: function(nombreFuncOProc, numeroParametros, noLinea) {

            var Simbolo = this.traeTipoSimbolo(nombreFuncOProc).simbolo;
            if (!(Simbolo.parametros.length == numeroParametros)) {
                throw new Error('Error en línea ' + noLinea + ': El número de parámetros de llamada(' + numeroParametros + ') de la función/procedimiento \'' + nombreFuncOProc + '\' no coincide con los de su declaración(' + Simbolo.parametros.length + ').');
            }
        },

        /**
        * Creamos una variable temporal para el código intermedio
        */
        creaTemporal() {
            if (this.variableTemporal == '') {
                this.variableTemporal = 'T_0';
            } else {
                this.variableTemporal = this.variableTemporal.replace(/\d+$/, function(n) { return ++n });
            }

            this.traeAmbitoActual().temporales.push(this.variableTemporal);
            return (this.variableTemporal);
        },

        /**
         * Creamos una variable temporal para el código intermedio
         */
        creaEtiqueta() {
            if (this.etiqueta == '') {
                this.etiqueta = 'L_0';
            } else {
                this.etiqueta = this.etiqueta.replace(/\d+$/, function(n) { return ++n });
            }

            return (this.etiqueta)
        },

        /**
         * Creamos un mapa con las etiquetas temporales y su cadena asociada
         * @param {string} txtCadena Cadena de texto encontrada en el código
         */
        creaCadenaTxt(txtCadena) {
            if (this.etiqueta == '') {
                this.etiqueta = 'L_0';
            } else {
                this.etiqueta = this.etiqueta.replace(/\d+$/, function(n) { return ++n });
            }

            this.cadenasTxt.set(this.etiqueta, txtCadena);
            return (this.etiqueta)
        },

        /**
         * Sacamos el tamaño actual del regitro de activacion
         *
         * # 0[.IX] Valor de Retorno
         * #-1[.IX] Estado de la máquina
         * #-2[.IX] Enlace de Control
         * #-3[.IX] Enlace de Acceso
         * #-4[.IX] Parámetro (opcional)
         * #-5[.IX] Dirección de Retorno
         * #-6[.IX] Variable de Local (opcional)
         * #-7[.IX] Temporal Local (opcional)
         */
        tamanoRA(nombreAmbito) {
            var TamaRA, variables, parametros, temporales, i, encontrado;
            TamaRA = 0;
            i = 0
            encontrado = false;

            while ((!encontrado) && (i < this.ambitos.stack.length)) {

                if (nombreAmbito == this.ambitos.stack[i].nombre)
                    encontrado = true;
                else
                    i += 1;
            }

            TamaRA += 1;                                         //# 0[.IX] Valor de Retorno
            TamaRA += 1;                                         //#-1[.IX] Estado de la máquina
            TamaRA += 1;                                         //#-2[.IX] Enlace de Control
            TamaRA += 1;                                         //#-3[.IX] Enlace de Acceso
            parametros = this.ambitos.stack[i].numParametros;    //#-4[.IX] Parámetro (opcional)
            TamaRA += 1;                                         //#-5[.IX] Dirección de Retorno
            variables = this.ambitos.stack[i].numVariables;      //#-6[.IX] Variable de Local (opcional)
            temporales = this.ambitos.stack[i].temporales.length;//#-7[.IX] Temporal Local (opcional)
            return (TamaRA + variables + parametros + temporales);
        }
    };
}

function Ambito(nombre, nivel) {
    this.nombre = nombre;
    this.simbolos = new Map();
    this.temporales = [];
    this.parametros = [];
    this.variables = [];
    this.numVariables = 0;
    this.numParametros = 0;
    this.numTemporales = 0;
    this.nivel = nivel;
}

/**
* Crea un Tipo de símbolo para el símbolo.
* @constructor
* @param {*} simbolo El símbolo.
* @param {string} nombreAmbito El nombre del ámbito.
*/
function TipoDeSimbolo(simbolo, nombreAmbito) {
    this.simbolo = simbolo;
    this.nombreAmbito = nombreAmbito;
}

/**
* Crea un nuevo símbolo de variable.
* @constructor
* @param {string} nombre El nombre de la variable.
* @param {string} tipo El tipo de la variable.
*/
function SimboloDeVariable(nombre, tipo) {
    this.nombre = nombre;
    this.tipo = tipo;
}

/**
* Crea un símbolo de función.
* @param {string} nombre El nombre de la función.
* @param {string} tipo El tipo que retorna la función.
* @param {*} parametros Los parámetros de la función.
*/
function SimboloDeFuncion(nombre, tipo, parametros) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.parametros = parametros;
}

/**
* Crea un símbolo de Procedimiento
* @param {string} nombre El nombre del procedimiento
* @param {*} parametros Los parámetros del procedimiento.
*/
function SimboloDeProcedimiento(nombre, parametros) {
    this.nombre = nombre;
    this.parametros = parametros;
}

/**
* Crea un símbolo párametro de función.
* @param {string} nombre El nombre del parámetro.
* @param {string} tipo El tipo del parámetro.
* @param {string} nombreFuncOProc El nombre de la función/procedimiento al que pertenece el parámetro.
*/
function SimboloDeParametro(nombre, tipo, nombreFuncOProc) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.nombreFuncOProc = nombreFuncOProc;
}

/**
* Crea una Llamada para la pila de llamadas de procedimientos y funciones.
* @param {string} nombreProcOFunc El nombre del procedimiento o función.
* @param {number} inicioRA Línea de CI desde dónde se le llama.
* @param {*}      parametros Parámetros del procedimiento o función.
* @param {number} EnlaceControl RA_LLamante  Enlace control
* @param {number} EnlaceAcceso RA_Anidante  Enclace Acceso
* @param {number} numVariables Número de variables
* @param {number} numTemporales Número de temporales
*/
function pilaLLamada(nombreProcOFunc, inicioRA, parametros, EnlaceControl, EnlaceAcceso, numVariables, numTemporales) {
    this.nombreProcOFunc = nombreProcOFunc;
    this.inicioRA = inicioRA;
    this.parametros = parametros;
    this.EnlaceControl = EnlaceControl;
    this.EnlaceAcceso = EnlaceAcceso;
    this.numVariables = numVariables;
    this.numTemporales = numTemporales;
}

//TODO: We need to export those functions to be visible and able to use from Compilador.js
export { intercambioCompilador, pilaLLamada };

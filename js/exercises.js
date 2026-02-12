/**
 * File containing the main exercises for students.
 * 
 * This module is used by viewElements.js, thus it must be imported there.
 */

//MAIN FUNTIONS FOR SELECT IN DOM


export const exercises = {
    Actividad1: {
        title: "Actividad 1 - Programa simple.",
        code: getActividad1()
    },
    Actividad2: {
        title: "Actividad 2 - Prueba de IF.",
        code: getActividad2()
    },
    Actividad3: {
        title: "Actividad 3 - Invocación a subprograma.",
        code: getActividad3()
    },
    Actividad4: {
        title: "Actividad 4 - Llamada a función.",
        code: getActividad4()
    },
    Actividad5: {
        title: "Actividad 5 - Recursividad Procedimientos.",
        code: getActividad5()
    },
    Actividad6: {
        title: "Actividad 6 - Recursividad Funciones. Prog. Tetraédrico",
        code: getActividad6()
    },
    Actividad7: {
        title: "Actividad 7 - Recursividad Funciones. Prog. Fibonacci",
        code: getActividad7()
    },
    Actividad8: {
        title: "Actividad 8 - Anidamientos variables no locales",
        code: getActividad8()
    }  
};


//ZONE FOR EXCERSISES


function getActividad1() {
    return (
        '// Actividad 1\r\r' +
        '/* \r' +
        'Prueba programa simple\r' +
        '*/\r\r' +
        'Program Actividad1;\r' +
        '    var a:integer;\r' +
        '\r' +
        'begin\r' +
        '  a := 5;\r' +
        '  writeln(a);\r' +
        'end.\r'
    )
}

function getActividad2() {
    return (
        '// Actividad 2\r\r' +
        '/* \r' +
        'Prueba de IF \r' +
        '*/\r\r' +
        'Program Actividad2;\r' +
        '    var a,b,c,salida:integer;\r' +
        '        d:integer;\r' +
        '        e,f,k:integer;\r' +
        'begin\r' +
        '  a := 5;\r' +
        '  k := a + 5;\r' +
        '  if k = 0 then\r' +
        '  begin\r' +
        '    salida := 1;\r' +
        '  end\r' +
        '  else begin\r' +
        '    salida := k + k + 1;\r' +
        '  end;\r' +
        '  writeln(salida);\r' +
        'end.\r'
    )
}

function getActividad3() {
    //
    return (
        '// Actividad 3\r\r' +
        '/* \r' +
        'Prueba de invocacion subprogramas\r' +
        '*/\r\r' +
        'Program Actividad3;\r' +
        '  var z:integer;\r' +
        '  procedure decrementa(x:integer);\r' +
        '    var y:integer;\r' +
        '  begin\r' +
        '    y := x - 1;\r' +
        '    writeln("y(2) = ");\r' +
        '    writeln(y);\r' +
        '  end;\r' +
        '\r' +
        'begin\r' +
        '  writeln("Invocación de subprogramas");\r' +
        '  z := 3;\r' +
        '  decrementa(z);\r' +
        '  writeln("FIN.");\r' +
        'end.\r'
    )
}

function getActividad4() {
    return (
        '// Actividad 4\r\r' +
        '/* \r' +
        'Prueba de funcion\r' +
        '*/\r\r' +
        'Program Actividad4;\r' +
        '    var a:integer;\r' +
        '  function disminuye(n:integer):integer;\r' +
        '  begin\r' +
        '    n := n -1;\r' +
        '    exit(n);\r' +
        '  end;\r' +
        '\r' +
        'begin\r' +
        '  a := disminuye(4);\r' +
        '  writeln("a =");\r' +
        '  writeln(a);\r' +
        '  writeln("fin");\r' +
        'end.\r'
    )
}

function getActividad5() {
    return (
        '// Actividad 5\r\r' +
        '/* \r' +
        'Prueba de procedimiento recursivo\r' +
        '*/\r\r' +
        'Program Actividad5;\r' +
        '    var a:integer;\r' +
        '  procedure compara(x:integer);\r' +
        '    var b:integer;\r' +
        '  begin\r' +
        '    writeln("X = ");\r' +
        '    writeln(x);\r' +
        '    b := x -1;\r' +
        '    if b = 3 then\r' +
        '    begin\r' +
        '      writeln("menor");\r' +
        '    end\r' +
        '    else begin\r' +
        '      compara(b);\r' +
        '    end;\r' +
        '  end;\r' +
        '\r' +
        'begin\r' +
        '  a := 11;\r' +
        '  compara(a);\r' +
        '  writeln("fin");\r' +
        'end.\r'
    )
}

function getActividad6() {
    return (
        '// Actividad 6\r\r' +
        '/* \r' +
        'Prueba de recursividad\r' +
        '*/\r\r' +
        'Program Actividad6;\r' +
        '  function tetraedrico(n:integer):integer;\r' +
        '    var salida:integer;\r' +
        '    function triangular(k:integer):integer;\r' +
        '      var salida:integer;\r' +
        '      begin\r' +
        '        if k = 0 then\r' +
        '        begin\r' +
        '          salida := 0;\r' +
        '        end\r' +
        '        else begin\r' +
        '          salida := k + triangular(k-1);\r' +
        '        end;\r' +
        '        exit(salida);\r' +
        '      end;\r' +
        '  begin\r' +
        '    if n = 0 then\r' +
        '    begin\r' +
        '      salida := 0;\r' +
        '    end\r' +
        '    else begin\r' +
        '      salida := triangular(n)+tetraedrico(n-1);\r' +
        '    end;\r' +
        '    exit(salida);\r' +
        '  end;\r' +
        '\r' +
        'begin\r' +
        '  writeln(tetraedrico(3));\r' +
        'end.\r'
    )
}

function getActividad7() {
    return (
        '// Actividad 7\r\r' +
        '/* \r' +
        'Prueba de recursividad\r' +
        '*/\r\r' +
        'Program Actividad7;\r' +
        '  var a:integer;\r' +
        '  function fib(i:integer):integer;\r' +
        '    var salFib:integer;\r' +
        '    function fibAux(x:integer,y:integer,z:integer):integer;\r' +
        '      var salida:integer;\r' +
        '    begin\r' +
        '      if x = 0 then\r' +
        '      begin\r' +
        '        salida := z;\r' +
        '      end\r' +
        '      else\r' +
        '      begin\r' +
        '          if x = 1 then\r' +
        '          begin\r' +
        '            salida := y;\r' +
        '          end\r' +
        '          else\r' +
        '          begin\r' +
        '            salida := fibAux(x-1,y+z,y);\r' +
        '          end;\r' +
        '      end;\r' +
        '      exit(salida);\r' +
        '    end;\r' +
        '  begin\r' +
        '    salFib := fibAux(i,1,1);\r' +
        '    exit(salFib);\r' +
        '  end;\r' +
        'begin\r' +
        '  a := fib(4);\r' +
        '  writeln("Fibonacci =");\r' +
        '  writeln(a);\r' +
        '  writeln("fin");\r' +
        'end.\r'
    )
}

function getActividad8() {
    return (
        '// Actividad 8\r\r' +
        '/* \r' +
        'Prueba de anidamientos variables no locales\r' +
        '*/\r\r' +
        'Program Actividad8;\r' +
        '  var valor:integer;\r' +
        '  procedure funcionAnidada();\r' +
        '  var valor:integer;\r' +
        '  begin\r' +
        '    valor := 20;\r' +
        '    writeln("Valor en función anidada es = ");\r' +
        '    writeln(valor);\r' +
        '  end;\r' +
        'begin\r' +
        '  valor := 10;\r' +
        '  writeln("Valor en función padre antes es = ");\r' +
        '  writeln(valor);\r' +
        '  funcionAnidada();\r' +
        '  writeln("Valor en función padre después es = ");\r' +
        '  writeln(valor);\r' +
        'end.\r'
    )
}
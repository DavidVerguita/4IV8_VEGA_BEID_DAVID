var instrucciones = [
    "Utiliza las flechas de navegación de tu teclado para mover las piezas.",
    "Para ordenar las piezas de forma correcta, guíate por la imagen Objetivo."
];

var movimientos = [];

// Matriz dinámica que representa el tablero actual
var rompe = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// Matriz patrón para comprobar la victoria
var rompeCorrecta = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// Coordenadas de la pieza vacía (Pieza 9 -> Fila 2, Columna 2 en base 0)
var filaVacia = 2;
var columnaVacia = 2;

// Muestra las instrucciones en el HTML
function mostrarInstrucciones(instrucciones) {
    for (var i = 0; i < instrucciones.length; i++) {
        mostrarInstruccionesLista(instrucciones[i], "lista-instrucciones");
    }
}

function mostrarInstruccionesLista(instruccion, idLista) {
    var ul = document.getElementById(idLista);
    var li = document.createElement("li");
    li.textContent = instruccion;
    ul.appendChild(li);
}

// Actualiza de forma visual las imágenes en el HTML basándose en el orden de la matriz
function actualizarDestinos() {
    for (var f = 0; f < 3; f++) {
        for (var c = 0; c < 3; c++) {
            var numeroPieza = rompe[f][c];
            var indiceMapeado = (f * 3) + c + 1;
            var cajaElemento = document.getElementById("pieza" + indiceMapeado);
            
            if (numeroPieza === 9) {
                cajaElemento.innerHTML = ""; // Celda vacía
                cajaElemento.className = "piezas blanco";
            } else {
                cajaElemento.innerHTML = '<img src="./images/' + (numeroPieza * 10) + '.jpg" alt="' + numeroPieza + '">';
                cajaElemento.className = "piezas";
            }
        }
    }
}

// Intercambia los valores en la matriz y actualiza la pantalla
function intercambiarPosiciones(f1, c1, f2, c2) {
    var pos1 = rompe[f1][c1];
    var pos2 = rompe[f2][c2];
    
    rompe[f1][c1] = pos2;
    rompe[f2][c2] = pos1;
    
    actualizarDestinos();
}

// Actualiza el texto del último movimiento en la interfaz gráfica
function actualizarUltimoMovimiento(direccion) {
    var divFlecha = document.getElementById("flecha");
    divFlecha.innerHTML = "<span>" + direccion + "</span>";
}

// Verifica si el estado actual de la matriz coincide con la solución ganadora
function checarSiGano() {
    for (var f = 0; f < 3; f++) {
        for (var c = 0; c < 3; c++) {
            if (rompe[f][c] !== rompeCorrecta[f][c]) {
                return false;
            }
        }
    }
    return true;
}

// Lógica de desplazamiento por teclado
function moverFilaColumna(direccion) {
    var nuevaFila = filaVacia;
    var nuevaColumna = columnaVacia;
    
    // Mover una pieza significa arrastrarla hacia el hueco vacío
    if (direccion === "ABAJO") {
        nuevaFila = filaVacia - 1; // La pieza de arriba cae al hueco
    } else if (direccion === "ARRIBA") {
        nuevaFila = filaVacia + 1; // La pieza de abajo sube al hueco
    } else if (direccion === "DERECHA") {
        nuevaColumna = columnaVacia - 1; // La pieza izquierda se mueve a la derecha
    } else if (direccion === "IZQUIERDA") {
        nuevaColumna = columnaVacia + 1; // La pieza derecha se mueve a la izquierda
    }
    
    // Validamos que el movimiento esté dentro de los límites de la matriz 3x3
    if (nuevaFila >= 0 && nuevaFila < 3 && nuevaColumna >= 0 && nuevaColumna < 3) {
        intercambiarPosiciones(filaVacia, columnaVacia, nuevaFila, nuevaColumna);
        filaVacia = nuevaFila;
        columnaVacia = nuevaColumna;
        
        movimientos.push(direccion);
        actualizarUltimoMovimiento(direccion);
        
        // Retardo mínimo para permitir que el DOM renderice el último cambio antes del alert
        setTimeout(function() {
            if (checarSiGano()) {
                alert("¡Felicidades! Has resuelto el misterio del rompecabezas con éxito.");
            }
        }, 200);
    }
}

// Captura las flechas del teclado de forma global
window.onkeydown = function(evento) {
    if (evento.key === "ArrowUp") {
        moverFilaColumna("ARRIBA");
        evento.preventDefault();
    } else if (evento.key === "ArrowDown") {
        moverFilaColumna("ABAJO");
        evento.preventDefault();
    } else if (evento.key === "ArrowLeft") {
        moverFilaColumna("IZQUIERDA");
        evento.preventDefault();
    } else if (evento.key === "ArrowRight") {
        moverFilaColumna("DERECHA");
        evento.preventDefault();
    }
};

// Función para mezclar aleatoriamente el tablero simulando movimientos válidos
function mezclarPiezas() {
    var direcciones = ["ARRIBA", "ABAJO", "IZQUIERDA", "DERECHA"];
    
    // Realizamos 50 movimientos aleatorios automáticos para garantizar que sea resoluble
    for (var i = 0; i < 50; i++) {
        var indiceAleatorio = Math.floor(Math.random() * direcciones.length);
        var dir = direcciones[indiceAleatorio];
        
        var nf = filaVacia;
        var nc = columnaVacia;
        
        if (dir === "ABAJO") nf = filaVacia - 1;
        else if (dir === "ARRIBA") nf = filaVacia + 1;
        else if (dir === "DERECHA") nc = columnaVacia - 1;
        else if (dir === "IZQUIERDA") nc = columnaVacia + 1;
        
        if (nf >= 0 && nf < 3 && nc >= 0 && nc < 3) {
            var p1 = rompe[filaVacia][columnaVacia];
            var p2 = rompe[nf][nc];
            rompe[filaVacia][columnaVacia] = p2;
            rompe[nf][nc] = p1;
            filaVacia = nf;
            columnaVacia = nc;
        }
    }
    
    movimientos = []; // Reseteamos historial
    actualizarUltimoMovimiento("Ninguno");
    actualizarDestinos();
}

// Inicialización automática al cargar el archivo
window.onload = function() {
    mostrarInstrucciones(instrucciones);
    actualizarDestinos(); // Dibuja el estado inicial
};
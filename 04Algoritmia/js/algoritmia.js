function problema1(){
    var input = document.querySelector('#p1-input').value;
    // Dividimos las palabras por el espacio vacío, invertimos el arreglo y volvemos a unir
    var palabrasInvertidas = input.split(' ').reverse().join(' ');
    
    document.querySelector('#p1-output').textContent = input ? palabrasInvertidas : "Por favor, ingresa texto válido.";
}

function problema2(){
    // Corrección de selectores: cambiados de '_' a '-' para coincidir con los IDs del HTML
    var p2_x1 = document.querySelector("#p2-x1").value;
    var p2_x2 = document.querySelector('#p2-x2').value;
    var p2_x3 = document.querySelector('#p2-x3').value;
    var p2_x4 = document.querySelector('#p2-x4').value;
    var p2_x5 = document.querySelector('#p2-x5').value;

    var p2_y1 = document.querySelector('#p2-y1').value;
    var p2_y2 = document.querySelector('#p2-y2').value;
    var p2_y3 = document.querySelector('#p2-y3').value;
    var p2_y4 = document.querySelector('#p2-y4').value;
    var p2_y5 = document.querySelector('#p2-y5').value;

    // Convertimos las entradas a valores numéricos flotantes
    var v1 = [parseFloat(p2_x1), parseFloat(p2_x2), parseFloat(p2_x3), parseFloat(p2_x4), parseFloat(p2_x5)];
    var v2 = [parseFloat(p2_y1), parseFloat(p2_y2), parseFloat(p2_y3), parseFloat(p2_y4), parseFloat(p2_y5)];

    // Si hay campos vacíos, cancelamos para evitar NaN
    if(v1.includes(NaN) || v2.includes(NaN)){
        document.querySelector('#p2-output').textContent = "Por favor, llena todos los campos de los vectores.";
        return;
    }

    // Para obtener el producto escalar MÍNIMO, ordenamos un vector de menor a mayor y el otro de mayor a menor
    v1 = v1.sort(function(a,b){return a-b});
    v2 = v2.sort(function(a,b){return b-a});

    var p2_producto = 0;
    for(var i=0; i < v1.length; i++){
        p2_producto += v1[i] * v2[i];
    }
    document.querySelector('#p2-output').textContent = "El producto escalar mínimo es de: " + p2_producto;
}

function problema3(){
    var input = document.querySelector('#p3-input').value;
    // Separamos las palabras por comas
    var palabras = input.split(',');
    var maxUnicos = -1;
    var palabraGanadora = "";

    palabras.forEach(function(palabra) {
        // Limpiamos espacios laterales y convertimos a mayúsculas
        var palabraLimpia = palabra.trim().toUpperCase();
        if(palabraLimpia === "") return;

        // Usamos un Set para obtener solo letras únicas (no duplicadas)
        var letrasUnicas = new Set(palabraLimpia.replace(/[^A-Z]/g, ''));
        
        if(letrasUnicas.size > maxUnicos){
            maxUnicos = letrasUnicas.size;
            palabraGanadora = palabraLimpia;
        }
    });

    if(palabraGanadora !== "") {
        document.querySelector('#p3-output').textContent = "La palabra con más caracteres únicos es: " + palabraGanadora + " (Contiene " + maxUnicos + " letras únicas)";
    } else {
        document.querySelector('#p3-output').textContent = "Por favor, ingresa palabras válidas.";
    }
}
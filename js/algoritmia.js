// Problema 1
function problema1() {
    const input = document.querySelector('#p1-input').value;
    const output = document.querySelector('#p1-output');
    
    // Validación: que no esté vacío
    if (input.trim() === '') {
        output.textContent = 'Error: Por favor ingresa al menos una palabra.';
        return;
    }

    // Separamos por espacios (incluso múltiples espacios), invertimos y unimos
    const palabras = input.trim().split(/\s+/);
    const palabrasInvertidas = palabras.reverse().join(' ');
    
    output.textContent = 'Resultado: ' + palabrasInvertidas;
}


// Problema 2
function problema2() {
    const output = document.querySelector('#p2-output');
    let v1 = [];
    let v2 = [];

    // Recolectar datos y validar
    for (let i = 1; i <= 5; i++) {
        let xVal = document.querySelector(`#p2-x${i}`).value;
        let yVal = document.querySelector(`#p2-y${i}`).value;

        // Validación: Ningún campo puede estar vacío
        if (xVal === '' || yVal === '') {
            output.textContent = 'Error: Llena todos los campos numéricos de ambos vectores.';
            return;
        }

        v1.push(parseFloat(xVal));
        v2.push(parseFloat(yVal));
    }

    // Para obtener el producto escalar mínimo, ordenamos un vector 
    // de forma ascendente y el otro de forma descendente.
    v1.sort((a, b) => a - b);
    v2.sort((a, b) => b - a);

    let productoMinimo = 0;
    for (let i = 0; i < v1.length; i++) {
        productoMinimo += (v1[i] * v2[i]);
    }

    output.textContent = 'El producto escalar mínimo es: ' + productoMinimo;
}


// Problema 3
function problema3() {
    const input = document.querySelector('#p3-input').value;
    const output = document.querySelector('#p3-output');

    // Validación general de estructura (A-Z y comas, sin espacios)
    const regex = /^[A-Z,]+$/;
    
    if (input.trim() === '') {
        output.textContent = 'Error: Ingresa las palabras.';
        return;
    }

    if (!regex.test(input)) {
        output.textContent = 'Error: Formato inválido. Usa solo letras mayúsculas (A-Z) separadas por coma, sin espacios.';
        return;
    }

    const palabras = input.split(',');
    let maximaLongitud = 0;
    let palabraGanadora = '';

    palabras.forEach(function(palabra) {
        if(palabra === '') return; // Ignorar si hay comas juntas ej: A,,B
        
        // Un Set almacena únicamente valores únicos
        const caracteresUnicos = new Set(palabra).size;
        
        if (caracteresUnicos > maximaLongitud) {
            maximaLongitud = caracteresUnicos;
            palabraGanadora = palabra;
        }
    });

    if(palabraGanadora === '') {
        output.textContent = 'Error: No se encontraron palabras válidas.';
    } else {
        output.textContent = `La palabra con más caracteres únicos es: ${palabraGanadora}\nCaracteres únicos: ${maximaLongitud}`;
    }
}
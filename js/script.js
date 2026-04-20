const regexValidar = /^\d+(\.\d{1,2})?$/; // RegEx para números positivos

function validar(valor) {
    return regexValidar.test(valor);
}

// 1. Inversión (2% mensual) [cite: 4]
function ejercicio1() {
    const cap = document.getElementById('cap1').value;
    if(!validar(cap)) return alert("Dato inválido");
    let ganancia = parseFloat(cap) * 0.02;
    document.getElementById('res1').innerText = `Ganarás $${ganancia.toFixed(2)} al mes.`;
}

// 2. Vendedor (10% comisión por 3 ventas) [cite: 5]
function ejercicio2() {
    const sueldo = document.getElementById('sueldoBase').value;
    const v1 = document.getElementById('v1').value;
    const v2 = document.getElementById('v2').value;
    const v3 = document.getElementById('v3').value;
    if(![sueldo, v1, v2, v3].every(validar)) return alert("Revisa los montos");

    let comision = (parseFloat(v1) + parseFloat(v2) + parseFloat(v3)) * 0.10;
    let total = parseFloat(sueldo) + comision;
    document.getElementById('res2').innerText = `Comisiones: $${comision.toFixed(2)}, Total: $${total.toFixed(2)}`;
}

// 3. Descuento (15%) [cite: 6]
function ejercicio3() {
    const compra = document.getElementById('compra').value;
    if(!validar(compra)) return alert("Dato inválido");
    let pago = parseFloat(compra) * 0.85;
    document.getElementById('res3').innerText = `Total con descuento: $${pago.toFixed(2)}`;
}

// 4. Calificación Final (55%, 30%, 15%) [cite: 8, 9, 10, 11]
function ejercicio4() {
    const p1 = document.getElementById('p1').value, p2 = document.getElementById('p2').value, p3 = document.getElementById('p3').value;
    const ex = document.getElementById('ex').value, tr = document.getElementById('tr').value;
    if(![p1, p2, p3, ex, tr].every(validar)) return alert("Revisa las notas");

    let promedioP = (parseFloat(p1) + parseFloat(p2) + parseFloat(p3)) / 3;
    let notaFinal = (promedioP * 0.55) + (parseFloat(ex) * 0.30) + (parseFloat(tr) * 0.15);
    document.getElementById('res4').innerText = `Final: ${notaFinal.toFixed(2)}`;
}

// 5. Porcentaje H/M [cite: 12]
function ejercicio5() {
    const h = document.getElementById('hombres').value;
    const m = document.getElementById('mujeres').value;
    if(!validar(h) || !validar(m)) return alert("Pon números válidos");

    let total = parseInt(h) + parseInt(m);
    let porH = (parseInt(h) / total) * 100;
    let porM = (parseInt(m) / total) * 100;
    document.getElementById('res5').innerText = `Hombres: ${porH.toFixed(1)}%, Mujeres: ${porM.toFixed(1)}%`;
}

// 6. Edad Exacta [cite: 13]
function ejercicio6() {
    const fecha = document.getElementById('fechaNac').value;
    if(!fecha) return alert("Selecciona una fecha");
    const hoy = new Date();
    const nac = new Date(fecha);
    let edad = hoy.getFullYear() - nac.getFullYear();
    if (hoy.getMonth() < nac.getMonth() || (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())) {
        edad--;
    }
    document.getElementById('res6').innerText = `Tienes ${edad} años.`;
}
function validar(formulario) {
    // 1. Validar longitud del nombre
    if (formulario.nombre.value.trim().length < 3) {
        alert("Por favor ingrese un nombre mayor de 3 caracteres");
        formulario.nombre.focus();
        return false;
    }

    // 2. Validar que solo sean letras en el nombre
    var abcOK = "QWERTYUIOPPÑLKJHGFDSAZXCVBNM" + "qwertyuiopñlkjhgfdsazxcvbnm " + "áéíóúÁÉÍÓÚüÜ";
    var checkString = formulario.nombre.value;
    var allValid = true;

    for (var i = 0; i < checkString.length; i++) {
        var caracteres = checkString.charAt(i);
        if (abcOK.indexOf(caracteres) == -1) {
            allValid = false;
            break;
        }
    }
    
    if (!allValid) {
        alert("Por favor escriba únicamente letras en el campo nombre");
        formulario.nombre.focus();
        return false;
    }

    // 3. Validar que solo sean números en la edad
    var numerosOK = "1234567890";
    var checkEdad = formulario.edad.value;
    var edadValid = true;

    if (checkEdad.length === 0) {
        alert("Por favor ingrese su edad");
        formulario.edad.focus();
        return false;
    }

    for (var i = 0; i < checkEdad.length; i++) {
        var caracteres = checkEdad.charAt(i);
        if (numerosOK.indexOf(caracteres) == -1) {
            edadValid = false;
            break;
        }
    }
    
    if (!edadValid) {
        alert("Por favor escriba únicamente números en el campo edad");
        formulario.edad.focus();
        return false;
    }

    // 4. Corrección de la Expresión Regular para el Email
    // Esta regex sí es compatible con los estándares de correos reales
    var correoelectronico = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    var txt = formulario.email.value.trim();

    if (!correoelectronico.test(txt)) {
        alert("Por favor ingrese un correo electrónico válido (ejemplo@dominio.com)");
        formulario.email.focus();
        return false; // Evita que se envíe si está mal
    }

    // Si todo pasa con éxito
    alert("Formulario validado correctamente. Enviando datos...");
    return true;
}
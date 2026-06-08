function problema1(){
    //tarea
}

function problema2(){
    //primero necesito obtener todos los valores de la tabla
    var p2_x1 = document.querySelector("#p2_x1").value;
    var p2_x2 = document.querySelector('#p2_x2').value;
    var p2_x3 = document.querySelector('#p2_x3').value;
    var p2_x4 = document.querySelector('#p2_x4').value;
    var p2_x5 = document.querySelector('#p2_x5').value;

    //vector 2
    var p2_y1 = document.querySelector('#p2_y1').value;
    var p2_y2 = document.querySelector('#p2_y2').value;
    var p2_y3 = document.querySelector('#p2_y3').value;
    var p2_y4 = document.querySelector('#p2_y4').value;
    var p2_y5 = document.querySelector('#p2_y5').value;

    //creamos los vectores
    var v1 = [p2_x1, p2_x2, p2_x3, p2_x4, p2_x5];
    var v2 = [p2_y1, p2_y2, p2_y3, p2_y4, p2_y5];

    //primero vamos a ordenar los elementos para permutarlos
    v1 = v1.sort(function(a,b){return b-a});
    v2 = v2.sort(function(a,b){return b-a});

    //para hacer la permutacion
    v2 = v2.reverse();

    //para multuplicar necesitamos un for
    var p2_producto = 0;

    for(var i=0; i < v1.length; i++){
        p2_producto += v1[i] * v2[i];
    }
    document.querySelector('#p2_output').textContent = "El producto escalar minimo es de: " + p2_producto;
}


function problema3(){
    //tarea
}
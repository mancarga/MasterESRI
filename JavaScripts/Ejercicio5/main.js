var letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'];

dni = prompt("Introduce el Numero de DNI");
cal_letra = letras[dni % 23];
if (dni < 0 || dni > 99999999) {
    alert("Número erroneo");

}
alert(cal_letra);
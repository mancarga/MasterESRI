const notas = [6, 7, 2, 9, 3, 4, 5, 8, 2]

// Utilizando for:
let nota = 0;
for (let i = 0; i < notas.length; i++) {
    nota += notas[i];
};
console.log(' Con el bucle FOR se obtiene: ' + nota);

// Utilizando un for ... of:
let ptt = 0;
for (let notaof of notas) {
    ptt += notaof;
};
console.log('Con el bucle FOR OF se obtiene:' + ptt);
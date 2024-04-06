const dadosExerciciosSalvos = localStorage.getItem('dadosExercicios');
let dadosExercicios;

if (dadosExerciciosSalvos) {
    dadosExercicios = JSON.parse(dadosExerciciosSalvos);
    ac = dadosExercicios.reduce((total, exercicio) => total + Number(exercicio.tempo), 0);
    document.getElementById('counter').textContent = ac;
} else {
    dadosExercicios = [];
}


const tbody = document.querySelector("tbody");

function limpaTabela () {
    while (tbody.rows.length > 0) {
        tbody.deleteRow(0);
    }
}

function atualizaTabela () {
    dadosExercicios.forEach((exercicio, i) => {
        const newRow = tbody.insertRow(i);
        newRow.innerHTML = `
            <td>${exercicio.tempo}h</td>
            <td>${exercicio.tipo}</td>
            <td>${exercicio.data}</td>
            <td class="acao"><span class="delete-icon" onclick="removerExercicio(${i})"><img src="./assets/delete.png" class="delete-img"></span></td>
        `;
        newRow.addEventListener("mouseenter", () => {
            newRow.querySelector(".delete-img").style.display = "inline";
        });
        newRow.addEventListener("mouseleave", () => {
            newRow.querySelector(".delete-img").style.display = "none";
        });
    });
    localStorage.setItem('dadosExercicios',
    JSON.stringify(dadosExercicios));
}

function removerExercicio(index) {
    dadosExercicios.splice(index, 1); 

    limpaTabela();
    atualizaTabela();

    ac = dadosExercicios.reduce((total, exercicio) => total + Number(exercicio.tempo), 0);
    document.getElementById('counter').textContent = ac;
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");

    let ac = 0;
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const timeSpent = form.querySelector("[id='timeInput']");
        const type = form.querySelector("[id='workoutTypeInput']");
        const date = form.querySelector("[id='dateInput']");
        const newRow = document.createElement("tr");
        if (!timeSpent.value || !type.value || !date.value || timeSpent.value <= 0){
            if(!timeSpent.value || timeSpent.value <= 0){
                timeSpent.classList.add("error-border");
            } else {
                timeSpent.classList.remove("error-border");              
            }
            if(!type.value){
                type.classList.add("error-border");
            } else {
                type.classList.remove("error-border");}
            if(!date.value){
                date.classList.add("error-border");
            } else {
                date.classList.remove("error-border");}
            return
        }

        timeSpent.classList.remove("error-border");              
        type.classList.remove("error-border");
        date.classList.remove("error-border");

        const novoExercicio = {
            tempo: timeSpent.value,
            tipo: type.value,
            data: new Date(date.value + 'T24:00:00Z').toLocaleDateString('pt-BR')
        };

        dadosExercicios.unshift(novoExercicio);

        limpaTabela();
        atualizaTabela();

        ac = dadosExercicios.reduce((total, exercicio) => total + Number(exercicio.tempo), 0);
        document.getElementById('counter').textContent = ac;

        tbody.appendChild(newRow);
        form.reset();
        console.log(dadosExercicios);
    });
});

let ascTempo = false;
let ascData = false;
let ascTipo = false;

function ordenarTempo() {
    function compararPorTempo(a, b) {
        return a.tempo - b.tempo;
      }
    dadosExercicios.sort(compararPorTempo);

    if (ascTempo) {
        dadosExercicios.reverse();
        ascTempo = false;
    } else {
        ascTempo = true;
    }

    ascData = false;
    ascTipo = false;
    limpaTabela();
    atualizaTabela();
}

function ordenarData() {

    function converterFormatoData(data) {
        const partes = data.split('/');
        const [dia, mes, ano] = partes;
        return `${ano}-${mes}-${dia}`;
    }

    function compararPorData(a, b) {
        var dataA = new Date(converterFormatoData(a.data)).getTime();
        var dataB = new Date(converterFormatoData(b.data)).getTime();
        return dataA - dataB;
    }

    dadosExercicios.sort(compararPorData);
    
    if (ascData) {
        dadosExercicios.reverse();
        ascData = false;
    } else {
        ascData = true;
    }

    ascTempo = false;
    ascTipo = false;
    limpaTabela();
    atualizaTabela();
}

function ordenarTipo() {
    function compararPorTipo(a, b) {
        if (a.tipo < b.tipo) {
            return -1;
          }
        if (a.tipo > b.tipo) {
            return 1;
        }
            return 0;
        };

    dadosExercicios.sort(compararPorTipo);

    if (ascTipo) {
        dadosExercicios.reverse();
        ascTipo = false;
    } else {
        ascTipo = true;
    }

    ascData = false;
    limpaTabela();
    atualizaTabela();
}

atualizaTabela ()
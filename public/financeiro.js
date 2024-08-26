var idatual = "";
// var idfazenda = "";
// var txtFazenda = document.getElementById("txtFazenda");
// var txtRecursosHumanos = document.getElementById("txtRecursosHumanos");
// var txtConciliacao = document.getElementById("txtConciliacao");
// var txtFechamento = document.getElementById("txtFechamento");
var txtAcoes = document.getElementById("txtAcoes");

// var editFazenda = document.getElementById("editFazenda");
// var editRecursosHumanos = document.getElementById("editRecursosHumanos");
// var editConciliacao = document.getElementById("editConciliacao");
// var editFechamento = document.getElementById("editFechamento");
// var editAcoes = document.getElementById("editAcoes");

var selectFuncionario = document.getElementById("newFuncionario");
var selectFazenda = document.getElementById("newFazenda");
var selectRH = document.getElementById("newRecursosHumanos");
var selectConcilicao = document.getElementById("newConciliacao");
var selectFechamento = document.getElementById("newFechamento");

var txtPesquisa = document.getElementById("txtPesquisa");

const modalEdit = new bootstrap.Modal(document.getElementById('modalEditar'));
const modalAdd = new bootstrap.Modal(document.getElementById('modalNovoRegistro'));
const modalExcluir = new bootstrap.Modal(document.getElementById('modalExcluir'));

function listar() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "<tr><td colspan=11>Carregando...</td></tr>";

    fetch("http://127.0.0.1:3333/cad_funcionario_atividade")
    .then(resp => resp.json())
    .then(dados => {
        // console.log(dados);
        
        if (dados == "") {
            const lista = document.getElementById("lista");
            lista.innerHTML = "";
            lista.innerHTML = "<tr><td colspan='9'>Nenhum registro encontrado</td></tr>";
        } else {
            mostrar(dados);
        };
    });
};

function mostrar(dados) {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    for (var i in dados) {
        let id = dados[i].idfuncionario;
        let nomeFunc = dados[i].nome_func;
        let nomeFazenda = dados[i].atividades[0].nome_fazenda;
        // let idfazenda = dados[i].atividades[0].idfazenda;

        let recursosHumanosStatus = "-";
        let conciliacaoStatus = "-";
        let fechamentoStatus = "-";

        for (var j in dados[i].atividades) {
            let atividade = dados[i].atividades[j];
            let descricaoAtividade = atividade.atividade;

            if (descricaoAtividade === "Recursos Humanos") {
                recursosHumanosStatus = atividade.status == undefined || atividade.status == "" ? "-" : atividade.status;
            } else if (descricaoAtividade === "Conciliação") {
                conciliacaoStatus = atividade.status == undefined || atividade.status == "" ? "-" : atividade.status;
            } else if (descricaoAtividade === "Fechamento") {
                fechamentoStatus = atividade.status == undefined || atividade.status == "" ? "-" : atividade.status;
            }
        };

        lista.innerHTML += "<tr>"
            + "<td>" + nomeFunc + "</td>"
            + "<td>" + nomeFazenda + "</td>"
            + "<td>" + recursosHumanosStatus + "</td>"
            + "<td>" + conciliacaoStatus + "</td>"
            + "<td>" + fechamentoStatus + "</td>"
            + "<td>"
            +   "<button type='button' class='btn btn-primary' onclick='alterar("+JSON.stringify(dados[i])+")'>Alterar</button>"
            +   " "
            +   "<button type='button' class='btn btn-danger' onclick='excluir("+id+")'>Excluir</button>"
            + "</td>"
            + "</tr>";
    }
};

function setRegistro() {
    
    const dados = {
        idfuncionario: selectFuncionario.value,
        idfazenda: selectFazenda.value,
        atividades : [
            {
                idatividade: 4,
                idStatusRh: selectRH.value
            },
            {
                idatividade: 5,
                idStatusConcilicao: selectConcilicao.value
            },
            {
                idatividade: 6,
                idStatusFechamento: selectFechamento.value
            }
        ]
    };

    url = "http://127.0.0.1:3333/cad_funcionario_dados";
    metodo = "POST";

    fetch(url,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: metodo, 
            body: JSON.stringify(dados)
        }
    ).then(() => {
        modalAdd.hide();
        listar();
    })
};

function alterar(dados) {

    modalEdit.style.display = "grid";

    document.getElementById("editFuncionario").value = dados.nome_func;
    document.getElementById("editFazenda").value = dados.atividades[0].nome_fazenda;
    
    // const dados = {
    //     idfuncionario: selectFuncionario.value,
    //     idfazenda: selectFazenda.value,
    //     atividades : [
    //         {
    //             idatividade: 4,
    //             idStatusRh: selectRH.value
    //         },
    //         {
    //             idatividade: 5,
    //             idStatusConcilicao: selectConcilicao.value
    //         },
    //         {
    //             idatividade: 6,
    //             idStatusFechamento: selectFechamento.value
    //         }
    //     ]
    // };

    // url = "http://127.0.0.1:3333/cad_funcionario_dados";
    // metodo = "POST";

    // fetch(url,
    //     {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //             },
    //         method: metodo, 
    //         body: JSON.stringify(dados)
    //     }
    // ).then(() => {
    //     modalAdd.hide();
    //     listar();
    // })
};

function excluir(id) {
    idatual = id;
    modalExcluir.show();
};

function excluirSim() {

    url = `http://127.0.0.1:3333/cad_funcionario_atividade/${idatual}`;
    metodo = "DELETE";
    
    fetch(url,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: metodo, 
            body: ""
        }
    ).then(() => {
        modalExcluir.hide();
        listar();
    })
};

function filtroTabela(elemento, table) {
    var linhas = document.querySelectorAll("#" + table + " tbody tr");

    linhas.forEach((linha) => {
        var q = elemento.value.toLowerCase();
        var contem = q == "" ? true : false;
        linha.querySelectorAll('td').forEach((celula) => {
            if (celula.textContent.trim().toLowerCase().includes(q)) {
                contem = true
            }
        });
        contem ? linha.style.display = '' : linha.style.display = 'none';
    });
};

listar();
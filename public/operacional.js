var idatual = "";
var idfuncionario_update = "";
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
var selectControleEstoque = document.getElementById("newRecursosHumanos");
var selectCadernoPontos= document.getElementById("newConciliacao");
var selectRastreamento = document.getElementById("newFechamento");

var editFuncionario = document.getElementById("editFuncionario");
var editFazenda = document.getElementById("editFazenda");
var editControleEstoque = document.getElementById("editRecursosHumanos");
var editCadernoPontos = document.getElementById("editConciliacao");
var editRastreamento = document.getElementById("editFechamento");

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

        let controle_Estoque_Status = "-";
        let caderno_Pontos_Status = "-";
        let rastreamento_Status= "-";

        for (var j in dados[i].atividades) {
            let atividade = dados[i].atividades[j];
            let descricaoAtividade = atividade.atividade;

            if (descricaoAtividade === "Controle de Ponto") {
                controle_Estoque_Status = atividade.status == undefined || atividade.status == "" ? "-" : atividade.status;
            } else if (descricaoAtividade === "Caderno de Ponto") {
                caderno_Pontos_Status = atividade.status == undefined || atividade.status == "" ? "-" : atividade.status;
            } else if (descricaoAtividade === "Rastreamento") {
                rastreamento_Status= atividade.status == undefined || atividade.status == "" ? "-" : atividade.status;
            }
        };

        lista.innerHTML += "<tr>"
            + "<td>" + nomeFunc + "</td>"
            + "<td>" + nomeFazenda + "</td>"
            + "<td>" + controle_Estoque_Status + "</td>"
            + "<td>" + caderno_Pontos_Status + "</td>"
            + "<td>" + rastreamento_Status + "</td>"
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
                idatividade: 1,
                idStatusControleEstoque: selectControleEstoque.value
            },
            {
                idatividade: 2,
                idStatusCadernoPonto: selectCadernoPontos.value
            },
            {
                idatividade: 3,
                idStatusRastreamento: selectRastreamento.value
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

    modalEdit.show();

    idfuncionario_update = "";
    document.getElementById("editFuncionario").value = "";
    document.getElementById("editFazenda").value = "";
    document.getElementById("editControleEstoque").value = "";
    document.getElementById("editCadernoPontos").value = "";
    document.getElementById("editRastreamento").value = "";

    idfuncionario_update = dados.idfuncionario;

    document.getElementById("editFuncionario").value = dados.nome_func;
    document.getElementById("editFazenda").value = dados.atividades[0].nome_fazenda;

    for (atividade of dados.atividades) {
        if (atividade.idatividade == 1) {
            document.getElementById("editControleEstoque").value = atividade.idstatus;
        } else if (atividade.idatividade == 2) {
            document.getElementById("editCadernoPontos").value = atividade.idstatus;
        } else if (atividade.idatividade == 3) {
            document.getElementById("editRastreamento").value = atividade.idstatus;
        };
    };
};

function alterarSim() {

    const dados = {
        idfuncionario: idfuncionario_update,
        atividades : [
            {
                idatividade: 1,
                idStatusControleEstoque: editControleEstoque.value
            },
            {
                idatividade: 2,
                idStatusCadernoPonto: editCadernoPontos.value
            },
            {
                idatividade: 3,
                idStatusRastreamento: editRastreamento.value
            }
        ]
    };

    // console.log(dados);
    
    url = `http://127.0.0.1:3333/cad_funcionario_dados`;
    metodo = "PUT";

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
        modalEdit.hide();
        listar();
    })
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

function fecharModal() {
    modalExcluir.hide();
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
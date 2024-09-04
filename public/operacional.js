var idatual = "";
var idfuncionario_update = "";
var idfazenda_update = "";

var txtAcoes = document.getElementById("txtAcoes");

var selectFuncionario = document.getElementById("newFuncionario");
var selectFazenda = document.getElementById("newFazenda");
var selectControleEstoque = document.getElementById("newControleEstoque");
var selectCadernoPontos = document.getElementById("newCadernoPontos");
var selectRastreamento = document.getElementById("newRastreamento");

var editFuncionario = document.getElementById("editFuncionario");
var editFazenda = document.getElementById("editFazenda");
var editControleEstoque = document.getElementById("editControleEstoque");
var editCadernoPontos = document.getElementById("editCadernoPontos");
var editRastreamento = document.getElementById("editRastreamento");

var txtPesquisa = document.getElementById("txtPesquisa");

const modalEdit = new bootstrap.Modal(document.getElementById('modalEditar'));
const modalAdd = new bootstrap.Modal(document.getElementById('modalNovoRegistro'));
const modalExcluir = new bootstrap.Modal(document.getElementById('modalExcluir'));

function listar() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "<tr><td colspan=11>Carregando...</td></tr>";

    fetch("http://127.0.0.1:3333/cad_funcionario_operacao")
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

    url = "http://127.0.0.1:3333/cad_funcionario_dados_operacao";
    metodo = "POST";

    if (selectFuncionario.value == "") {
        alert("Selecione um funcionário para continuar!")
        return
    };

    if (selectFazenda.value == "") {
        alert("Selecione uma fazenda para continuar!")
        return
    };

    if (selectControleEstoque.value == "" || selectCadernoPontos.value == "" || selectRastreamento.value == "") {
        alert("Selecione um status para todas as atividades")
        return
    };

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

function alterarSim() {

    const dados = {
        idfuncionario: idfuncionario_update,
        idfazenda: idfazenda_update,
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
    if (editControleEstoque.value == "" || editCadernoPontos.value == "" || editRastreamento.value == "") {
        alert("Selecione um status para todas as atividades")
        return
    };

    
    url = `http://127.0.0.1:3333/cad_funcionario_dados_operacao`;
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

    url = `http://127.0.0.1:3333/cad_funcionario_operacao/${idatual}`;
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

function mostrar(dados) {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    let statusControle = "";
    let statusCaderno = "";
    let statusRastreamento = "";

    for (var i in dados) {
        let id = dados[i].idfuncionario;
        let nomeFunc = dados[i].nome_func;

        const fazendas = {};

        for (var j in dados[i].atividades) {
            let atividade = dados[i].atividades[j];
            let nomeFazenda = atividade.nome_fazenda;
            let idFazenda = atividade.idfazenda;

            if (!fazendas[nomeFazenda]) {
                fazendas[nomeFazenda] = {
                    idFazenda: idFazenda,
                    recursosHumanosStatus: "-",
                    conciliacaoStatus: "-",
                    fechamentoStatus: "-"
                };
            };

            let descricaoAtividade = atividade.atividade;

            if (descricaoAtividade === "Controle de Estoque") {
                fazendas[nomeFazenda].controle_Estoque_Status = atividade.status || "-";
            } else if (descricaoAtividade === "Caderno de Ponto") {
                fazendas[nomeFazenda].caderno_Pontos_Status = atividade.status || "-";
            } else if (descricaoAtividade === "Rastreamento") {
                fazendas[nomeFazenda].rastreamento_Status = atividade.status || "-";
            };


            statusControle = fazendas[nomeFazenda].controle_Estoque_Status == undefined ? "-" : fazendas[nomeFazenda].controle_Estoque_Status;
            statusCaderno = fazendas[nomeFazenda].caderno_Pontos_Status == undefined ? "-" : fazendas[nomeFazenda].caderno_Pontos_Status;
            statusRastreamento = fazendas[nomeFazenda].rastreamento_Status == undefined ? "-" : fazendas[nomeFazenda].rastreamento_Status;

        };

        for (let nomeFazenda in fazendas) {
            lista.innerHTML += "<tr>"
                + "<td>" + nomeFunc + "</td>"
                + "<td>" + nomeFazenda + "</td>"
                + "<td>" + statusControle + "</td>"
                + "<td>" + statusCaderno + "</td>"
                + "<td>" + statusRastreamento + "</td>"
                + "<td>"
                +   "<button type='button' class='btn btn-primary' onclick='alterar("+JSON.stringify(dados[i])+", \""+nomeFazenda+"\", "+fazendas[nomeFazenda].idFazenda+")'>Alterar</button>"
                +   " "
                +   "<button type='button' class='btn btn-danger' onclick='excluir("+id+")'>Excluir</button>"
                + "</td>"
                + "</tr>";
        };
    };
};

function alterar(dados, nomeFazenda, idFazenda) {

    modalEdit.show();

    idfuncionario_update = "";
    document.getElementById("editFuncionario").value = "";
    document.getElementById("editFazenda").value = "";
    document.getElementById("editControleEstoque").value = "";
    document.getElementById("editCadernoPontos").value = "";
    document.getElementById("editRastreamento").value = "";

    idfuncionario_update = dados.idfuncionario;
    idfazenda_update = idFazenda;

    document.getElementById("editFuncionario").value = dados.nome_func;
    document.getElementById("editFazenda").value = nomeFazenda;

    for (atividade of dados.atividades) {
        if (atividade.idfazenda === idFazenda) {
            if (atividade.idatividade == 1) {
                document.getElementById("editControleEstoque").value = atividade.idstatus;
            } else if (atividade.idatividade == 2) {
                document.getElementById("editCadernoPontos").value = atividade.idstatus;
            } else if (atividade.idatividade == 3) {
                document.getElementById("editRastreamento").value = atividade.idstatus;
            };
        }
    }
};
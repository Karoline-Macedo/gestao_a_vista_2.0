var idatual = "";
var idfuncionario_update = "";
var idfazenda_update = "";

var txtAcoes = document.getElementById("txtAcoes");

var selectFuncionario = document.getElementById("newFuncionario");
var selectFazenda = document.getElementById("newFazenda");
var selectRH = document.getElementById("newRecursosHumanos");
var selectConcilicao = document.getElementById("newConciliacao");
var selectFechamento = document.getElementById("newFechamento");

var editFuncionario = document.getElementById("editFuncionario");
var editFazenda = document.getElementById("editFazenda");
var editRH = document.getElementById("editRecursosHumanos");
var editConcilicao = document.getElementById("editConciliacao");
var editFechamento = document.getElementById("editFechamento");

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

    if (selectFuncionario.value == "") {
        alert("Selecione um funcionário para continuar!")
        return
    };

    if (selectFazenda.value == "") {
        alert("Selecione uma fazenda para continuar!")
        return
    };

    if (selectRH.value == "" || selectConcilicao.value == "" || selectFechamento.value == "") {
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
                idatividade: 4,
                idStatusRh: editRH.value
            },
            {
                idatividade: 5,
                idStatusConcilicao: editConcilicao.value
            },
            {
                idatividade: 6,
                idStatusFechamento: editFechamento.value
            }
        ]
    };

    // console.log(dados);
    if (editRH.value == "" || editConcilicao.value == "" || editFechamento.value == "") {
        alert("Selecione um status para todas as atividades")
        return
    }; 
    
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

function mostrar(dados) {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

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

            if (descricaoAtividade === "Recursos Humanos") {
                fazendas[nomeFazenda].recursosHumanosStatus = atividade.status || "-";
            } else if (descricaoAtividade === "Conciliação") {
                fazendas[nomeFazenda].conciliacaoStatus = atividade.status || "-";
            } else if (descricaoAtividade === "Fechamento") {
                fazendas[nomeFazenda].fechamentoStatus = atividade.status || "-";
            }
        };

        for (let nomeFazenda in fazendas) {
            lista.innerHTML += "<tr>"
                + "<td>" + nomeFunc + "</td>"
                + "<td>" + nomeFazenda + "</td>"
                + "<td>" + fazendas[nomeFazenda].recursosHumanosStatus + "</td>"
                + "<td>" + fazendas[nomeFazenda].conciliacaoStatus + "</td>"
                + "<td>" + fazendas[nomeFazenda].fechamentoStatus + "</td>"
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
    document.getElementById("editRecursosHumanos").value = "";
    document.getElementById("editConciliacao").value = "";
    document.getElementById("editFechamento").value = "";

    idfuncionario_update = dados.idfuncionario;
    idfazenda_update = idFazenda;

    document.getElementById("editFuncionario").value = dados.nome_func;
    document.getElementById("editFazenda").value = nomeFazenda;

    for (atividade of dados.atividades) {
        if (atividade.idfazenda === idFazenda) {
            if (atividade.idatividade == 4) {
                document.getElementById("editRecursosHumanos").value = atividade.idstatus;
            } else if (atividade.idatividade == 5) {
                document.getElementById("editConciliacao").value = atividade.idstatus;
            } else if (atividade.idatividade == 6) {
                document.getElementById("editFechamento").value = atividade.idstatus;
            }
        }
    }
};

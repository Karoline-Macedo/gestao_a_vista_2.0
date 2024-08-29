

async function connect() {
    if (global.connection && global.connection.state !== 'disconnected')
        return global.connection;
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'testeagro'
    });

    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

// INSERT - cad_funcionario_atividade
// exports.insertFuncionarioAtividade = async (req, res, next) => {
//     const conn = await connect();
//     const sql = "INSERT INTO cad_funcionario_atividade (idfuncionario, idatividade) VALUES (?, ?)";
//     const values = [req.body.idfuncionario, req.body.idatividade];
//     await conn.query(sql, values);
//     res.status(201).send('Atividade do funcionário inserida com sucesso!');
// };

// UPDATE - cad_funcionario_atividade
// exports.updateFuncionarioAtividade = async (req, res, next) => {
//     const conn = await connect();
//     const sql = "UPDATE cad_funcionario_atividade SET idatividade = ? WHERE idfuncionario = ?";
//     const values = [req.body.idatividade, req.body.idfuncionario];
//     await conn.query(sql, values);
//     res.status(200).send('Atividade do funcionário atualizada com sucesso!');
// };

// INSERT - cad_funcionario_fazenda
// exports.insertFuncionarioFazenda = async (req, res, next) => {
//     const conn = await connect();
//     const sql = "INSERT INTO cad_funcionario_fazenda (idfuncionario, idfazenda) VALUES (?, ?)";
//     const values = [req.body.idfuncionario, req.body.idfazenda];
//     await conn.query(sql, values);
//     res.status(201).send('Fazenda do funcionário inserida com sucesso!');
// };

// UPDATE - cad_funcionario_fazenda
// exports.updateFuncionarioFazenda = async (req, res, next) => {
//     const conn = await connect();
//     const sql = "UPDATE cad_funcionario_fazenda SET idfazenda = ? WHERE idfuncionario = ?";
//     const values = [req.body.idfazenda, req.body.idfuncionario];
//     await conn.query(sql, values);
//     res.status(200).send('Fazenda do funcionário atualizada com sucesso!');
// };

// INSERT - cad_status_func_atividade
// exports.insertStatusFuncAtividade = async (req, res, next) => {
//     const conn = await connect();
//     const sql = "INSERT INTO cad_status_func_atividade (idstatus, idfuncionario, idfazenda, idatividade) VALUES (?, ?, ?, ?)";
//     const values = [req.body.idstatus, req.body.idfuncionario, req.body.idfazenda, req.body.idatividade];
//     await conn.query(sql, values);
//     res.status(201).send('Status da atividade do funcionário inserido com sucesso!');
// };

// UPDATE - cad_status_func_atividade
// exports.updateStatusFuncAtividade = async (req, res, next) => {
//     const conn = await connect();
//     const sql = "UPDATE cad_status_func_atividade SET idstatus = ? WHERE idfuncionario = ? AND idfazenda = ? AND idatividade = ?";
//     const values = [req.body.idstatus, req.body.idfuncionario, req.body.idfazenda, req.body.idatividade];
//     await conn.query(sql, values);
//     res.status(200).send('Status da atividade do funcionário atualizado com sucesso!');
// };




// exports.insertFuncionario_financeiro = async (req, res, next) => {
//     const conn = await connect();

//     try {
//         await conn.beginTransaction();

//         const sqlAtividade = "INSERT INTO cad_funcionario_atividade (idfuncionario, idatividade, idfazenda) VALUES (?, ?, ?)";
//         const valuesAtividade = [req.body.idfuncionario, req.body.idatividade, req.body.idfazenda];
//         const [resultAtividade] = await conn.query(sqlAtividade, valuesAtividade);

//         if (resultAtividade.affectedRows === 0) {
//             await conn.rollback();
//             return res.status(500).send('Erro ao inserir atividade do funcionário.');
//         };

//         const SELECTId = "SELECT idfunc_atividade FROM cad_funcionario_atividade ORDER BY idfunc_atividade LIMIT 1";
//         const resultSelect = await conn.query(SELECTId);

//         const sqlStatus = "INSERT INTO cad_status_func_atividade (idstatus, idfunc_ativ_faz) VALUES (?, ?)";
//         const valuesStatus = [req.body.idstatus, resultSelect];
//         await conn.query(sqlStatus, valuesStatus);

//         if (resultFazenda.affectedRows === 0) {
//             await conn.rollback();
//             return res.status(500).send('Erro ao inserir status da atividade.');
//         };

//         await conn.commit();

//         res.status(201).send('Dados do funcionário inseridos com sucesso!');
//     } catch (error) {
//         await conn.rollback();
//         res.status(500).send(error.message);
//     } finally {
//         conn.release();
//     };
// };


exports.insertFuncionario_financeiro = async (req, res, next) => {
    const conn = await connect();

    try {
        await conn.beginTransaction();

        const atividades = req.body.atividades;

        for (const atividade of atividades) {
            const sqlAtividade = `
                INSERT INTO cad_funcionario_atividade (idfuncionario, idatividade, idfazenda)
                VALUES (?, ?, ?)`;
            const valuesAtividade = [
                req.body.idfuncionario,
                atividade.idatividade,
                req.body.idfazenda
            ];
            const [resultAtividade] = await conn.query(sqlAtividade, valuesAtividade);

            if (resultAtividade.affectedRows === 0) {
                await conn.rollback();
                return res.status(500).send('Erro ao inserir atividade do funcionário.');
            };

            const idFuncAtividade = resultAtividade.insertId;

            let idStatus;
            if (atividade.idatividade === 4) {
                idStatus = atividade.idStatusRh;
            } else if (atividade.idatividade === 5) {
                idStatus = atividade.idStatusConcilicao;
            } else if (atividade.idatividade === 6) {
                idStatus = atividade.idStatusFechamento;
            } else {
                await conn.rollback();
                return res.status(500).send('Atividade desconhecida.');
            };

            const sqlStatus = `
                INSERT INTO cad_status_func_atividade (idstatus, idfunc_ativ_faz)
                VALUES (?, ?)`;
            const valuesStatus = [idStatus, idFuncAtividade];
            const [resultStatus] = await conn.query(sqlStatus, valuesStatus);

            if (resultStatus.affectedRows === 0) {
                await conn.rollback();
                return res.status(500).send('Erro ao inserir status da atividade.');
            };
        };

        await conn.commit();
        res.status(201).send('Dados do funcionário inseridos com sucesso!');
    } catch (error) {
        await conn.rollback();
        res.status(500).send(error.message);
    }
};

exports.updateFuncionario_financeiro = async (req, res, next) => {
    // const conn = await connect();

    // try {
    //     await conn.beginTransaction();

    //     // Update na tabela cad_funcionario_atividade
    //     const sqlAtividade = "UPDATE cad_funcionario_atividade SET idatividade = ?, idfazenda = ?, idstatus = ?  WHERE idfunc_atividade = ?";
    //     const valuesAtividade = [req.body.idatividade, req.body.idfuncionario];
    //     const [resultFazenda] = await conn.query(sqlAtividade, valuesAtividade);

    //     if (resultFazenda.affectedRows === 0) {
    //         await conn.rollback();
    //         return res.status(500).send('Erro ao atualizar atividade do funcionário.');
    //     };

    //     // Update na tabela cad_funcionario_fazenda
    //     const sqlFazenda = "UPDATE cad_funcionario_fazenda SET idfazenda = ? WHERE idfuncionario = ?";
    //     const valuesFazenda = [req.body.idfazenda, req.body.idfuncionario];
    //     [resultFazenda] = await conn.query(sqlFazenda, valuesFazenda);

    //     if (resultFazenda.affectedRows === 0) {
    //         await conn.rollback();
    //         return res.status(500).send('Erro ao atualizar fazenda do funcionário.');
    //     };

    //     // Update na tabela cad_status_func_atividade
    //     const sqlStatus = "UPDATE cad_status_func_atividade SET idstatus = ? WHERE idfuncionario = ? AND idfazenda = ? AND idatividade = ?";
    //     const valuesStatus = [req.body.idstatus, req.body.idfuncionario, req.body.idfazenda, req.body.idatividade];
    //     const [resultStatusAtividade] = await conn.query(sqlStatus, valuesStatus);

    //     if (resultStatusAtividade.affectedRows === 0) {
    //         await conn.rollback();
    //         return res.status(500).send('Erro ao atualizar status da atividade.');
    //     };

    //     await conn.commit();

    //     res.status(200).send('Dados do funcionário atualizados com sucesso!');
    // } catch (error) {
    //     await conn.rollback();
    //     res.status(500).send(error.message);
    // } finally {
    //     conn.release();
    // };

    const conn = await connect();

    try {
        await conn.beginTransaction();

        let atividades = req.body.atividades;

        for (let atividade of atividades) {
            let idStatus;
            if (atividade.idatividade === 4) {
                idStatus = atividade.idStatusRh;
            } else if (atividade.idatividade === 5) {
                idStatus = atividade.idStatusConcilicao;
            } else if (atividade.idatividade === 6) {
                idStatus = atividade.idStatusFechamento;
            } else {
                await conn.rollback();
                return res.status(500).send('Atividade desconhecida.');
            };

            let sqlUpdateStatus = `
                UPDATE cad_status_func_atividade
                SET idstatus = ?
                WHERE idfunc_ativ_faz = (SELECT idfunc_atividade FROM cad_funcionario_atividade WHERE idfuncionario = ? AND idatividade = ? and data_desativacao is null)`;
            let valuesUpdateStatus = [idStatus, req.body.idfuncionario, atividade.idatividade];
            let [resultUpdateStatus] = await conn.query(sqlUpdateStatus, valuesUpdateStatus);

            if (resultUpdateStatus.affectedRows === 0) {
                await conn.rollback();
                return res.status(500).send('Erro ao atualizar status da atividade.');
            };
        };

        await conn.commit();
        res.status(200).send('Status das atividades do funcionário atualizados com sucesso!');
    } catch (error) {
        await conn.rollback();
        res.status(500).send(error.message);
    }
};

exports.get = async (req, res, next) => {

    const conn = await connect();

    const sql = "SELECT"
                +"   cfa.idfuncionario,"
                +"   cf.nome_func,"
                +"   co.descricao as operacao,"
                +"   JSON_ARRAYAGG("
                +"       JSON_OBJECT(" 
                +"           'idatividade', cfa.idatividade, "
                +"           'atividade', ca.descricao, "
                +"           'idfazenda', cfa.idfazenda, "
                +"           'nome_fazenda', cfz.nome_fazenda, " 
                +"            'idstatus', csfa.idstatus, "
                +"            'status', cs.descricao" 
                +"        )"
                +"    ) AS atividades " 
                +"FROM"
                +"    cad_funcionario_atividade cfa "
                +"INNER JOIN"
                +"    cad_atividade ca ON ca.idatividade = cfa.idatividade "
                +"INNER JOIN"
                +"    cad_funcionario cf ON cf.idfuncionario = cfa.idfuncionario "
                +"INNER JOIN"
                +"    cad_fazenda cfz ON cfz.idfazenda = cfa.idfazenda "
                +"INNER JOIN"
                +"    cad_status_func_atividade csfa ON csfa.idfunc_ativ_faz = cfa.idfunc_atividade "
                +"INNER JOIN"
                +"    cad_status cs ON cs.idstatus = csfa.idstatus "
                +" inner join"
                +"    cad_atividade_operacao cao on cao.idatividade = cfa.idatividade "
                +"inner join "
                +"    cad_operacoes co on co.idoperacao = cao.idoperacao "
                +"where "
                +"     co.descricao like '%financeiro%' and cfa.data_desativacao is null "
                +"GROUP BY"
                +"    cf.idfuncionario, cf.nome_func,co.descricao "
                +"ORDER BY"
                +"    cf.nome_func";

    const [rows] = await conn.query(sql);
    res.status(200).send(rows);
};

exports.deleteFuncionario_financeiro = async (req, res, next) => {
    let id = req.params.id;
    const conn = await connect();

    const sqlDelete = "UPDATE cad_funcionario_atividade SET data_desativacao = now() WHERE idfuncionario = ? and data_desativacao is null";
    const valuesDelete = [id];
    await conn.query(sqlDelete, valuesDelete);

    res.status(200).send('Dado deletado com sucesso!');
};
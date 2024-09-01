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
};

exports.post = async (req, res, next) => {
    const conn = await connect();
    
    try {

        let sql = `
            SELECT usuario, senha
            FROM cad_login
            WHERE usuario = ?
        `;

        let [rows] = await conn.query(sql, [req.body.user]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        };

        let { usuario, senha } = rows[0];

        if (req.body.senha === senha) {
            return res.status(200).json({ message: "Autenticação bem-sucedida" });
        } else {
            return res.status(403).json({ message: "Usuário ou senha incorretos" });
        };

    } catch (error) {
        console.error("Erro ao realizar autenticação:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
};
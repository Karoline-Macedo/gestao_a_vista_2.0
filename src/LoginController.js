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

exports.get = async (req, res, next) => {

    const conn = await connect();
  
    const sql = "SELECT"
                +"   usuario,"
                +"   senha " 
                +"FROM"
                +"    cad_login";
  
    const rows = await conn.query(sql);
    
    let sqlUser = rows.usuario;
    let sqlSenha = rows.senha;

    if (req.body.user == sqlUser && req.body.senha == sqlSenha) {
        res.status(200).send("success");
    } else {
        res.status(403).send("false")
    };

  };
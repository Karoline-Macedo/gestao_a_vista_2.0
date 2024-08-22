async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection(
       {host:'127.0.0.1', user: 'root', 
       password:'root', database: 'testeagro'});
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
 }
 
 //CREATE
 exports.post = async (req, res, next) => {
    const conn = await connect();
    const sql = "INSERT INTO cad_fazenda " +
                " (nome_fazenda, proprietario, telefone) " +
                "VALUES (?, ?, ?)";
    const values = [req.body.nome_fazenda, req.body.proprietario, req.body.telefone];
        console.log(values);
    await conn.query(sql, values);
    res.status(201).send('Rota POST!');
 };
 //UPDATE  
 exports.put = async (req, res, next) => {
    let id = req.params.id;
    const conn = await connect();
    const sql = "UPDATE cad_fazenda " +
                "SET nome_fazenda = ?, proprietario = ?, telefone = ?" +
                "WHERE idfazenda = ?";
    const values = [req.body.nome_fazenda, req.body.proprietario, req.body.telefone, id];
    await conn.query(sql, values);
    res.status(201).send(`Rota PUT com ID! ${id}`);
  };
//DELETE   
  exports.delete = async (req, res, next) => {
    let id = req.params.id;
    const conn = await connect();
    const sql = "DELETE FROM cad_fazenda " +
                "WHERE idfazenda = ?";
    const values = [id];
    await conn.query(sql, values);
    res.status(200).send("Rota DELETE com ID! " + id);
  };
//READ   
  exports.get = async (req, res, next) => {
     const conn = await connect();
     const pesquisa = req.query.pesquisa;
     const sql = "SELECT * FROM cad_fazenda" +
                 "WHERE nome_fazenda like ? " +
                 "ORDER BY nome_fazenda";
     const values = ["%" + pesquisa + "%"];
     const [rows] = await conn.query(sql, values);
     res.status(200).send(rows);
  };
//READ PELO ID   
  exports.getById = async (req, res, next) => {
     let id = req.params.id;
     const conn = await connect();
     const sql = "SELECT * FROM cad_fazenda WHERE idfazenda = " + id;
     const [rows] = await conn.query(sql);
     if (rows.length > 0) {
       res.status(200).send(rows[0]);
     } else {
       res.status(404).send("ID inexistente!");
     }    
  };
 
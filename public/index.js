const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com o banco de dados MySQL
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'seu_usuario',
//   password: 'sua_senha',
//   database: 'gestao_a_vista'
// });

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


db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado ao banco de dados');
});

// Rota para a página de login
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Certifique-se de que o caminho para o arquivo HTML está correto
});

// Rota para processar o login
app.post('/', (req, res) => {
  const usuario = req.body.usuario;
  const senha = req.body.senha;

  const query = 'SELECT * FROM cad_login WHERE usuario = ? AND senha = ?';
  db.query(query, [usuario, senha], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
        res.redirect('/menu.html'); // Redirecione para o dashboard ou outra página
    } else {
      res.send('Usuário ou senha incorretos!');
    }
  });
});

// Iniciar o servidor
app.listen(3333, () => {
  console.log('Servidor rodando na porta 3333');
});

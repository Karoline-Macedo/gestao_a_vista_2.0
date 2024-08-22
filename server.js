//server.js
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware para permitir CORS
app.use(cors());

// Middleware para parsing de JSON
app.use(express.json());

// Adiciona a pasta 'public' para servir arquivos estáticos
app.use(express.static("public"));

// Importa as rotas do arquivo src/index.js e passa o app do Express para ele
require('./src/menu')(app);

// Inicia o servidor na porta 3333
app.listen(3333, () => {
  console.log("Servidor iniciado na porta 3333");
});





//    http://127.0.0.1:3333/usuario
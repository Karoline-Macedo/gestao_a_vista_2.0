const FuncionarioController = require('./FuncionarioController');
module.exports = (app) => {
   app.post('/funcionario', FuncionarioController.post);
   app.put('/funcionario/:id', FuncionarioController.put);
   app.delete('/funcionario/:id', FuncionarioController.delete);
   app.get('/funcionario', FuncionarioController.get);
   app.get('/funcionario/:id', FuncionarioController.getById);
};
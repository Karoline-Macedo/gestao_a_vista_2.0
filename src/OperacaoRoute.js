// const OperacaoController = require('./OperacaoController');
// module.exports = (app) => {
//    app.post('/operacao', OperacaoController.post);
//    app.put('/operacao/:id', OperacaoController.put);
//    app.delete('/operacao/:id', OperacaoController.delete);
//    app.get('/operacao', OperacaoController.get);
//    app.get('/operacao/:id', OperacaoController.getById);
// };


const OperacaoController = require('./OperacaoController');

module.exports = (app) => {
   app.post('/cad_funcionario_dados', OperacaoController.insertFuncionario_operacao);
   
   app.put('/cad_funcionario_dados', OperacaoController.updateFuncionario_operacao);

   app.delete('/cad_funcionario_atividade/:id', OperacaoController.deleteFuncionario_operacao);

   app.get('/cad_funcionario_atividade', OperacaoController.get);
};
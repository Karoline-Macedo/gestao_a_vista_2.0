const OperacaoController = require('./OperacaoController');

module.exports = (app) => {
   app.post('/cad_funcionario_dados_operacao', OperacaoController.insertFuncionario_operacao);
   
   app.put('/cad_funcionario_dados_operacao', OperacaoController.updateFuncionario_operacao);

   app.delete('/cad_funcionario_operacao/:id', OperacaoController.deleteFuncionario_operacao);

   app.get('/cad_funcionario_operacao', OperacaoController.get);
};
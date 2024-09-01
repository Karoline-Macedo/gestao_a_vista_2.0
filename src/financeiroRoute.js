const financeiroController = require('./financeiroController');

module.exports = (app) => {
   app.post('/cad_funcionario_dados', financeiroController.insertFuncionario_financeiro);
   
   app.put('/cad_funcionario_dados', financeiroController.updateFuncionario_financeiro);

   app.delete('/cad_funcionario_atividade/:id', financeiroController.deleteFuncionario_financeiro);

   app.get('/cad_funcionario_atividade', financeiroController.get);
};

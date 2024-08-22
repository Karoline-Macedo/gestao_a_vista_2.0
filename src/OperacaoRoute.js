const OperacaoController = require('./OperacaoController');
module.exports = (app) => {
   app.post('/operacao', OperacaoController.post);
   app.put('/operacao/:id', OperacaoController.put);
   app.delete('/operacao/:id', OperacaoController.delete);
   app.get('/operacao', OperacaoController.get);
   app.get('/operacao/:id', OperacaoController.getById);
};
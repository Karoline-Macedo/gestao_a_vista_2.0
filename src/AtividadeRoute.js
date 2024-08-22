const AtividadeController = require('./AtividadeController.js');
module.exports = (app) => {
   app.post('/atividade', AtividadeController.post);
   app.put('/atividade/:id', AtividadeController.put);
   app.delete('/atividade/:id', AtividadeController.delete);
   app.get('/atividade', AtividadeController.get);
   app.get('/atividade/:id', AtividadeController.getById);
};
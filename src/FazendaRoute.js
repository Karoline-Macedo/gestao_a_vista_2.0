const FazendaController = require('./FazendaController');
module.exports = (app) => {
   app.post('/fazenda', FazendaController.post);
   app.put('/fazenda/:id', FazendaController.put);
   app.delete('/fazenda/:id', FazendaController.delete);
   app.get('/fazenda', FazendaController.get);
   app.get('/fazenda/:id', FazendaController.getById);
};
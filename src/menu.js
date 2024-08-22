//index.js
const AtividadeRoute = require('./AtividadeRoute');
const FazendaRoute = require('./FazendaRoute');
const FuncionarioRoute = require('./FuncionarioRoute');
const OperacaoRoute = require('./OperacaoRoute');
const FinanceiroRoute = require('./financeiroRoute');
module.exports = (app) => {
    AtividadeRoute(app)
    FazendaRoute(app)
    FuncionarioRoute(app)
    OperacaoRoute(app)
    FinanceiroRoute(app)
}

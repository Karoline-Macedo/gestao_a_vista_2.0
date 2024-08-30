const LoginController = require('./LoginController');

module.exports = (app) => {
    app.get('/get_login_user', LoginController.get);
}
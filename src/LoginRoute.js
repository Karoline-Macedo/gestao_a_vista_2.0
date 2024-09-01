const LoginController = require('./LoginController');

module.exports = (app) => {
    app.post('/get_login_user', LoginController.post);
}
const express =require('express');
const router = express.Router();
const passport =require('passport');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(users.register);

router.route('/login')
    .get(users.renderLogin)
    .post(users.login);

router.get('/logout', users.logout);

module.exports = router;

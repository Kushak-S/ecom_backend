const router = require('express').Router();
const userController = require('../Controllers/user.controllers');
const jwt = require('../Helpers/jwt.validator');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout/:uid', jwt.verify_user, userController.logout);
router.post('/delete/:uid', jwt.verify_user, userController.delete);

module.exports = router;
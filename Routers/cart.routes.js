const router = require('express').Router();
const cartController = require('../Controllers/cart.controllers');
const jwt = require('../Helpers/jwt.validator');

router.get('/:uid', jwt.verify_user, cartController.getById);
router.post('/add/:uid', jwt.verify_user, cartController.add);
router.post('/remove/:uid', jwt.verify_user, cartController.remove);
router.delete('/clear/:uid', jwt.verify_user, cartController.clear);

module.exports = router;
const router = require('express').Router();
const orderController = require('../Controllers/order.controllers');
const jwt = require('../Helpers/jwt.validator');

router.get('/:uid', jwt.verify_admin, orderController.getAll);
router.get('/get/:uid', jwt.verify_user, orderController.getByUid);
router.get('/checkout/:uid',jwt.verify_user, orderController.checkout);
router.post('/confirm/:uid', jwt.verify_user, orderController.confirm);
router.post('/cancel/:uid', jwt.verify_user, orderController.cancel);

module.exports = router;
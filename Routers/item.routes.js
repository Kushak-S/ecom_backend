const router = require('express').Router();
const itemController = require('../Controllers/item.controllers');
const jwt = require('../Helpers/jwt.validator');

router.get('/', itemController.getAll);
router.get('/:id', itemController.getById);
router.post('/add/:uid', jwt.verify_admin, itemController.add);
router.post('/delete/:uid', jwt.verify_admin, itemController.delete);

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userCtrl = require('../controllers/user');

router.post('/registryuser', userCtrl.register);
router.post('/connectuser', userCtrl.login);
router.patch('/putuser/:id',auth, userCtrl.putUser);
router.get('/getuser/:id',auth, userCtrl.getUser);
router.delete('/deleteuser/:id', auth, userCtrl.deleteUser);

module.exports = router


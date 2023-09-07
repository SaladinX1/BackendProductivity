const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const commentCtrl = require('../controllers/comment');

router.post('/post/:id/comment', auth, commentCtrl.createComment);
router.get('/post/:id/comments',auth, commentCtrl.getComments);
router.get('/post/:id/commentone/:id',auth, commentCtrl.getOneComment);
router.put('/post/:id/commentput/:id', auth, commentCtrl.putComment);
router.delete('/post/:id/commentdelete/:id', auth, commentCtrl.deleteComment);


module.exports = router
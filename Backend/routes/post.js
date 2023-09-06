const express = require('express');
const multer = require('multer');
const multerConfig = require('../middlewares/multer');
const router = express.Router();
const auth = require('../middlewares/auth');
const postCtrl = require('../controllers/post');

// destination du fichier
const upload = multerConfig; 

router.get('/allposts', auth,  postCtrl.allPosts);
router.get('/post/:id', auth, postCtrl.onePost);
router.post('/addpost', auth, upload.single('picture'), postCtrl.addPost);
router.patch('/putpost/:id',auth, postCtrl.putPost);
router.delete('/deletepost/:id', auth, postCtrl.deletePost);


//////////////////////////  ROUTE LIKE/UNLIKE //////////////////////////////

router.post("/post/:id/likes", auth, postCtrl.countLikes);
router.patch("/post/:id/likeunlike", auth, postCtrl.likeUnlikePost);
router.post("/post/:id/postLikedByUser", auth, postCtrl.postLikedByUser);


module.exports = router;


const db = require('../database/db.script');



exports.addPost = (req, res) => {

    const user_id = req.user.id;

    const { title, message } = req.body; 
    
  
    const picture = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;


    const addScan = `INSERT INTO Post (title, picture, message, user_id) VALUES (?, ?, ?, ?)`;

    db.query(addScan,[title, picture, message, user_id], (err, result) => {
        if(!result) {
            
            res.status(400).json({message: 'Mauvaise requête ! '})
        } else {
            res.status(201).json({message: 'Scan Crée !'})
        }
    })
}


exports.allPosts = (req,res, next) => {

  const Post = `SELECT * FROM Post `

    db.query(Post,(err, result) => {
        if(!result) {
            console.log(err);
            res.status(400).json({message:'Mauvaise requête !'})
        } else {
            res.status(200).json(result);
        }
    })

}

exports.onePost = (req, res,next) => {
    const id = req.params.id;

    const getOnePost = `SELECT * FROM Post WHERE id =? `;

    db.query(getOnePost, id,(err, result) => {
        if(!result) {
            console.log(err);
            res.status(400).json({message: 'Mauvaise requête'})
        } else {
            res.status(200).json(result)
        }
    })
}


exports.deletePost = (req, res, next) => {

    const deletePost = `DELETE FROM Post WHERE id =? ;`;
    const id = req.params.id;

    db.query(deletePost, id, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Erreur lors de la suppression du post' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Le post n\'a pas été trouvé' });
        }
        res.status(200).json({ message: 'Post supprimé !' });
    });
};

exports.putPost = (req, res, next) => {

console.log('FIRST', req.body);

    const id = req.params.id;

    const { title,
      message
    } = req.body;

    const getPost = `SELECT  title, message From Post WHERE id =?;`

    db.query(getPost, [id], (err, result) => {
      if(!result) {
          console.log(err);
          res.status(400).json({message: 'Mauvaise requête'});
      } else {

        const postOne = result[0];
        
          const updateValuesPost = [
            title || postOne.title,
            message || postOne.message,
      id   
  ];

    const putPost = `UPDATE Post SET title=?, message=? WHERE id =?;`

    db.query(putPost, updateValuesPost, (err, result) => {
        if(!result) {
            console.log(err);
            res.status(400).json({message: 'Mauvaise requête'});
        } else {
            res.status(200).json(result)
        }
    });

         
      }
  });

  

}


//////////// GESTION  LIKE / UNLIKE CONTROLLERS  //////////////////////


exports.likeUnlikePost = (req, res) => {
  const { userId, postId} = req.body;
  const sqlSelect = `SELECT * FROM likes WHERE likes.user_id = ${userId} AND likes.post_id = ${postId}`;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).json({ err });
      throw err;
    }
    
    if (result.length === 0) {
      const sqlInsert = `INSERT INTO likes (user_id, post_id) VALUES (${userId}, ${postId})`;
      db.query(sqlInsert, (err, result) => {
      
        if (err) {
          console.log(err);
          res.status(404).json({ err });
          throw err;
        }
        res.status(200).json(result);
      });
      } else {
        const sqlDelete = `DELETE FROM likes WHERE likes.user_id = ${userId} AND likes.post_id = ${postId}`;
        db.query(sqlDelete, (err, result) => {

          if (err) {
            console.log(err);
            res.status(404).json(err);
            throw err;
          }
          res.status(200).json(result);
        });
      }
    });
  };
  
  exports.postLikedByUser = (req, res) => {
    
    const { userId, postId } = req.body;
    const sql = `SELECT post_id, user_id FROM likes WHERE user_id = ${userId} AND post_id = ${postId}`;
    db.query(sql, (err, result) => {
      if (err) {
        res.status(404).json({ err });
        throw err;
      }
      res.status(200).json(result);
    });
  };
  
  exports.countLikes = (req, res) => {
    
    const { postId } = req.body;
    const sqlInsert = `SELECT COUNT(*) AS total FROM likes WHERE likes.post_id = ${postId}`;
    db.query(sqlInsert, (err, result) => {
      console.log('LIKECOUNT', result);
      if (err) {
        res.status(404).json({ err });
        throw err;
      }
      res.status(200).json(result);
    });
  };
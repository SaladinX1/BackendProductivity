const db = require('../database/db.script');


exports.createComment = (req, res, next) => {
    console.log(req.body);
    const {pseudo,message} = req.body;

   
    const postId = req.params.id;
    const newComment = `INSERT INTO Comment (pseudo_user, message, post_id) VALUES (?,?,?);`

    db.query(newComment,[pseudo,message,postId], (err, result) => {
        if(err) {
            console.log(err);
            res.status(400).json({message: 'Mauvaise requête ! '});
        } 
        else {
            res.status(201).json({message: 'Commentaire crée !'})
        }
    })
}


exports.getComments = (req, res) => {

    const id = req.params.id;

    const sql = `SELECT * FROM Comment WHERE post_id = ?;`;
    
    db.query(sql,id, (err, result) => {
        if(err) {
            console.log(err);
            res.status(400).json({message: 'Mauvaise requête !'});
        } else {
            res.status(200).json(result);
        }
    })


}

exports.getOneComment = (req, res) => {



}

exports.putComment = (req, res) => {
    
    const idComment = req.params.id;
    console.log(req);
    const {comment} = req.body;

    const sql = `UPDATE Comment SET message='${comment}' WHERE id =?;`;

    db.query(sql, idComment, (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).json({message: 'Erreur serveur...'})
        } else {
            res.status(200).json({message: 'Commentaire modifié !'})
        }
    })


}

exports.deleteComment = (req, res) => {

    const id = req.params.id;
    console.log(id);

    const sql = `DELETE FROM Comment WHERE id =?`;

    db.query(sql, id, (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).json({message: 'Erreur Serveur...'})
        } else {
            res.status(200).json({message: 'Commentaire supprimé !'})
        }
    })


}
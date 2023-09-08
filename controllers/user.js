
const jwt = require('jsonwebtoken');
const db = require('../database/db.script');
const bcrypt = require('bcrypt');


exports.register = async (req,res, next) => {
console.log(req.body);
let { admin, pseudo, mail, nom, prenom } = req.body;
   const {password: password} = req.body;
    try {
        
        if (pseudo == process.env.ADMIN) {
            admin = 1;
        } else {
            admin = 0;
        }

        const salt = await bcrypt.genSalt(5);
        const cryptPass = await bcrypt.hash(password, salt);

        const user = {
            prenom : prenom,
            admin:admin,
             pseudo:pseudo,
            mail: mail,
            nom: nom,
            password: cryptPass
        }

        const request = `INSERT INTO Users SET ?`;

        db.query(request, user,(err, result) => {
            if(result) {
                res.status(201).json({message: 'Données enregistrées ! Bravo !'})
            } else {
                res.status(401).json({ message: 'Email déjà pris !'})
            }
            
        })
    } catch (err) {
        res.status(400).json({message: 'Mauvaise requête !'})
    }
}


exports.login = (req, res, next) =>  {

    const { mailConn, passwordConn } = req.body;

try {
    const sql = `SELECT id, nom, prenom, pseudo, password FROM Users WHERE mail=?`;
    db.query(sql, mailConn, (err, result) => {
        
        if (err) {
            res.status(500).json({message: 'Erreur serveur !'});
        } else if (!result[0]) {
            res.status(401).json({message: 'Utilisateur introuvable !'});
        } else {
            const user = result[0];
            bcrypt.compare(passwordConn, user.password)
            .then(valid => {
                if(!valid) {
                    return res.status(401).json({message: 'Mot de passe incorrect !'});
                } else {
                    const id = user.id;
                    const pseudo = user.pseudo;
                  //  req.session.isAuthenticated = true;
                    res.status(200).json({
                        id: id,
                        pseudo: pseudo,
                        token: jwt.sign({id: id}, process.env.TOKEN , { expiresIn: '24h' })
                    });
                }
            })
            .catch(err => {
                 console.log(err); // Log the error to know its cause
                 res.status(500).json({message: 'Erreur serveur !'});
             });
        }
    });
} catch (err) {
    console.log(err); // Log the error to know its cause
    res.status(500).json({message: 'Erreur serveur !'});
}
}



exports.getUser = (req, res) => {

    const user_id = req.params.id;
    const sql = `SELECT * FROM Users WHERE id =?`

    db.query(sql, user_id, (err, result) => {
        
        if(err) {
            res.status(400).json({message: 'Mauvaise requête ! '})
        } 
        else {
            res.status(200).json(result);
        }

    })


}


exports.deleteUser = (req,res) => {

    const deleteUserRequest = `DELETE FROM Users WHERE id = ${req.params.id};`

    db.query(deleteUserRequest, (err, result) => {
        if(!result) {
            res.status(500).json({message: 'Erreur Serveur !'})
        } else {
            res.status(200).json({message: 'Utilisateur supprimé !'})
        }
    });


}


exports.putUser = async (req, res, next) => {
    const id = req.params.id;
    const { pseudo, nom, prenom, password } = req.body;
    let admin = 0;

    const salt = await bcrypt.genSalt(3);
    const updatedPassword = await bcrypt.hash(password, salt);

    if (pseudo === process.env.ADMIN) {
        admin = 1;
    }

    try {

            const updateQuery = `
                UPDATE Users 
                SET nom = ?, 
                prenom = ?, 
                pseudo = ?, 
                password = ?,
                admin = ?
                WHERE id = ?
            `;

            const getUserQuery = 'SELECT * FROM Users WHERE id = ?';
            const getUserValues = [req.params.id];

            db.query(getUserQuery, getUserValues, (getUserError, getUserResults) => {
             
                const user = getUserResults[0];

                db.query('SELECT * FROM comment Where pseudo_user = ?', [user.pseudo], (err, result) => {
                    if (!result) {
                        return;
                    } else {

                        db.query('DELETE FROM comment WHERE pseudo_user = ?', [user.pseudo], (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(400).json({ message: 'Mauvaise requête !' });
                            }
                        });

                    }
                })

                

                
            const updateValues = [
                nom || user.nom,
                prenom || user.prenom,
                pseudo || user.pseudo,
                updatedPassword || user.password,
                admin,
                id   
            ];

            db.query(updateQuery, updateValues, (error, updateResult) => {
                if (error) {
                    return res.status(400).json({ message: 'Mauvaise requête !' });
                } else {

                    return res.status(200).json({
                        message: 'Bravo ! Vos données ont été modifiées !',
                        token: jwt.sign({ id: user.id }, process.env.TOKEN, { expiresIn: '24h' }),
                        id: user.id,
                        pseudoUpd: pseudo
                    });
                }
                
            });
            
          

            });

       
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};
const jwt = require('jsonwebtoken');
const db = require('../database/db.script');

module.exports = (req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(' ')[1];
        const verifyToken = jwt.verify(token, process.env.TOKEN);
        const selectAuthUser = `SELECT * FROM Users WHERE id = ?`;
        
        db.query(selectAuthUser, verifyToken.id, (err, result) => {
            if (!result) {
                res.status(401).json({message: 'Unauthorized'});
            } else {
                req.user = result[0];
                next();
            }
        });
    } 
      catch (error) {
      console.log(error);  
      res.status(401).json({message: 'Unauthorized'});
    }
};






const multer = require('multer');

const Mime_types = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const nom = file.originalname.split(' ').join('_');
        const extension = Mime_types[file.mimetype];
        callback(null, nom + Date.now() + '.' + extension)

    }
});

module.exports = multer({
    storage: storage
});
const multer = require('multer');

const Mime_types = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'https://app-e41459b6-43e3-41c9-a993-49eb96d7f59a.cleverapps.io/images')
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
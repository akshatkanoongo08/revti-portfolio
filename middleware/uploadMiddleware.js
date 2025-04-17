const { upload } = require('../config/cloudinary');

const singleUpload = upload.single('image');
const multipleUpload = upload.array('gallery', 10); // Max 10 images

module.exports = { singleUpload, multipleUpload };
const multer = require("multer");
const { promisify } = require("util");
const fs = require("fs");
const config=require('config');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${config.get('publicPath')}`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = function (req, file, cb) {
  if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
    // return cb(new Error('please upload image',false)
    cb(null,false)
  }
  cb(null,true)
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter:fileFilter
});

async function deleteImage(imageName) {
    const unlinkAsync = promisify(fs.unlink);
    await unlinkAsync(`${config.get('publicPath')}${imageName}`);
}

module.exports.upload=upload;
module.exports.deleteImage=deleteImage;

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const secret = require('../secret/secret');

AWS.config.update({
    accessKeyId: secret.aws.ACCESS_KEY_ID,
    secretAccessKey: secret.aws.SECRET_ACCESS_KEY,
    region: 'eu-central-1'

});

const s3 = new AWS.S3({});
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'nodesocial',
        acl: 'public-read',
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function(req, file, cb) {
            cb(null, file.originalname);
        },
        rename: function(fieldName, fileName) {
            return fileName.replace(/\W+/g, '-');
        }
    })
});

exports.Upload = upload;
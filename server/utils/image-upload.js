/**
 * This file exports a method to help upload image to AWS S3 bucket
 */
const express = require( 'express' )
const aws = require( 'aws-sdk' )
const multerS3 = require( 'multer-s3' )
const multer = require('multer')
const path = require( 'path' )
const awsConfig = require('../config/awsConfig.json')

console.log('Bucketname: ' + awsConfig.bucket)

// init AWS S3 access
const s3 = new aws.S3({
 accessKeyId: awsConfig.accessKeyId,
 secretAccessKey: awsConfig.secretAccessKey,
 Bucket: awsConfig.bucket,
})

// upload function
const profileImgUpload = multer({
 storage: multerS3({
  s3: s3,
  bucket: awsConfig.bucket,
  acl: 'public-read',
  key: function (req, file, cb) {
   cb(null, path.basename( file.originalname ) )
  }
 }),
 limits:{ fileSize: 2000000 }, // 20mb
 fileFilter: function( req, file, cb ){
  checkFileType( file, cb )
 }
}).single('image')

/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
function checkFileType( file, cb ){
 // Allowed ext
 const filetypes = /jpeg|jpg|png|gif/
 // Check ext
 const extname = filetypes.test( path.extname( file.originalname ).toLowerCase())

if( extname ){
  return cb( null, true )
 } else {
  cb( 'Error: Images Only!' )
 }
}

module.exports = profileImgUpload
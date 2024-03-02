const express = require('express');
const surfpoints = require('../controllers/surfpoints');
const router = express.Router();
const catchAsync =require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateSurfpoint} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.get('/new', isLoggedIn, catchAsync(surfpoints.renderNewForm));

router.route('/')
    .get(catchAsync(surfpoints.index))
    .post(isLoggedIn,upload.array('image'),validateSurfpoint, catchAsync( surfpoints.createSurfpoint));
router.route('/:id')
    .get(catchAsync( surfpoints.showSurfpoint))
    .put( isLoggedIn,isAuthor ,isAuthor,upload.array('image'), validateSurfpoint, catchAsync(surfpoints.updateSurfpoint))
    .delete(isLoggedIn,isAuthor,catchAsync(surfpoints.deleteSurfpoint));


router.get('/:id/edit', isLoggedIn,isAuthor,catchAsync(surfpoints.renderEditForm));

module.exports = router;




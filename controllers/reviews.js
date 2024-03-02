const Review = require('../models/review');
const Surfpoint = require('../models/surfpoint');


module.exports.createReview = async(req,res)=>{
    const surfpoint = await Surfpoint.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    surfpoint.reviews.push(review);
    await review.save();
    await surfpoint.save();
    req.flash('success','レビューを登録しました');
  res.redirect(`/surfpoints/${surfpoint._id}`);
  }

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    await Surfpoint.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','レビューを削除しました');
    res.redirect(`/surfpoints/${id}`);
  }

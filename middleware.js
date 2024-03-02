const ExpressError =require('./utils/ExpressError');
const {surfpointSchema,reviewSchema} = require('./schemas');
const Surfpoint = require('./models/surfpoint');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res,next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','ログインしてください');
        return res.redirect('/login');
    }
    next();
  };



  module.exports.isAuthor = async(req,res,next) =>{
    const {id} = req.params;
    const surfpoint = await Surfpoint.findById(id);
    if(!surfpoint.author.equals(req.user._id)){
      req.flash('error','そのアクションの権限がありません');
      return res.redirect(`/surfpoints/${id}`);
    }
    next();
  }

  module.exports.isReviewAuthor = async(req,res,next) =>{
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
      req.flash('error','そのアクションの権限がありません');
      return res.redirect(`/surfpoints/${id}`);
    }
    next();
  }

  module.exports.validateSurfpoint =(req,res,next) =>{
    const {error} = surfpointSchema.validate(req.body);
    if(error){
      const msg = error.details.map(detail =>detail.message).join(',');
      throw new ExpressError(msg,400);
    }else{
      next();
    }
  }

  module.exports.validateReview =(req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
      const msg = error.details.map(detail =>detail.message).join(',');
      throw new ExpressError(msg,400);
    }else{
      next();
    }
  }

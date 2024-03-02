const Surfpoint = require('../models/surfpoint');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocorder = mbxGeocoding({accessToken:mapboxToken});

const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const surfpoints = await Surfpoint.find({});
    res.render('surfpoints/index',{surfpoints});
}

module.exports.renderNewForm = async (req, res) => {
    res.render('surfpoints/new');
}

module.exports.showSurfpoint = async (req, res) => {
    const surfpoint = await Surfpoint.findById(req.params.id)
    .populate({
      path:'reviews',
      populate:{
        path:'author'
      }
    }).populate('author');
    if (!surfpoint){
      req.flash('error','キャンプ場は見つかりませんでした');
      return res.redirect('/surfpoints');
    }
    res.render('surfpoints/show', { surfpoint });
}

module.exports.createSurfpoint = async (req,res,next)=>{
    const geoData = await geocorder.forwardGeocode({
      query: req.body.surfpoint.location,
      limit:1
    }).send();
    const surfpoint = new Surfpoint(req.body.surfpoint);
    surfpoint.geometry = geoData.body.features[0].geometry;
    surfpoint.images =req.files.map(f =>({url: f.path,filename:f.filename}));
    surfpoint.author = req.user._id;
    await surfpoint.save();
    req.flash('success','新しいキャンプ場を登録しました');
    res.redirect(`/surfpoints/${surfpoint._id}`);
}

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const surfpoint = await Surfpoint.findById(id);
    if (!surfpoint){
      req.flash('error','キャンプ場は見つかりませんでした');
      return res.redirect('/surfpoints');
    }
    res.render('surfpoints/edit',{surfpoint});
}

module.exports.updateSurfpoint = async(req,res)=>{
    const {id} = req.params;
    const surfpoint = await Surfpoint.findByIdAndUpdate(id,{ ...req.body.surfpoint});
    const imgs  =req.files.map(f =>({url: f.path,filename:f.filename}));
    surfpoint.images.push(...imgs);
    await surfpoint.save();
    if(req.body.deleteImages){
      for (let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
      }
      await surfpoint.updateOne({$pull:{images: {filename:{$in: req.body.deleteImages}}}})
    }
    req.flash('success','キャンプ場を更新しました');
    res.redirect(`/surfpoints/${surfpoint._id}`);
  }

  module.exports.deleteSurfpoint= async (req,res)=>{
    const {id} = req.params;
    await Surfpoint.findByIdAndDelete(id);
    req.flash('success','キャンプ場を削除しました');
    res.redirect(`/surfpoints`);
  }

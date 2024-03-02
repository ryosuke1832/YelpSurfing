const User = require('../models/user');
const passport =require('passport');

module.exports.renderRegister=(req,res)=>{
    res.render('users/register')
}

module.exports.register = async (req,res,next)=>{
    try{
        const {email,username,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err =>{
            if(err) return next(err);
            req.flash('success','Yelp Surfへようこそ');
            const redirectUrl = req.session.returnTo || '/surfpoints';
            // delete req.session.returnTo; // セッションからreturnToを削除
            console.log(redirectUrl);
            res.redirect(redirectUrl);
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}

module.exports.login =(req, res, next) => {
    const returnTo = req.session.returnTo; // 認証前にreturnToを保存
    passport.authenticate('local', {failureFlash: true, failureRedirect: "/login"}, (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, err => {
            if (err) return next(err);
            req.session.returnTo = returnTo; // 認証後にreturnToを復元
            const redirectUrl = req.session.returnTo || '/surfpoints';
            delete req.session.returnTo;
            res.redirect(redirectUrl);
        });
    })(req, res, next);
}

module.exports.logout=(req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', 'ログアウトしました。');
      res.redirect('/surfpoints');
    });
  }

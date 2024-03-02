const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true

    }
});


userSchema.plugin(passportLocalMongoose,{
    errorMessage:{
        UserExistsError:'そのユーザー名はすでに使われています',
        MissingPasswordError:'パスワードを入力してください',
        AttemptTooSoonError:'アカウントがロックされています、時間をあけて再度試してください',
        TooManyAttemptsError:'ログインの失敗が続いたため、アカウントをロックしました',
        NoSaltValueStoredErrors:'認証ができませんでした',
        IncorrectPasswordError:'パスワードまたはユーザー名が間違っています',
        IncorrectUsernameError:'パスワードまたはユーザー名が間違っています',
    }
});

const User = mongoose.model('User',userSchema);

module.exports = mongoose.model('User',userSchema);

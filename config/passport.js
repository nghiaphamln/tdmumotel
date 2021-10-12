const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    // SIGNUP LOCAL    
    passport.use('local-signup', new LocalStrategy({
        fullnameField: 'name',
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true 
    },


        function (req, email, password, done) {
            process.nextTick(function () {
                User.findOne({ 'local.email': email }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'Email này đã được sử dụng!'));
                    } else {

                        var newUser = new User();
                        newUser.local.name = req.body.fullname;
                        newUser.name = req.body.fullname;
                        newUser.local.email = email;
                        newUser.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    // LOGIN LOCAL
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            User.findOne({ 'local.email': email }, function (err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'Thông tin tài khoản hoặc mật khẩu không chính xác!'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Thông tin tài khoản hoặc mật khẩu không chính xác!'));
                return done(null, user);
            });
        })
    );
}
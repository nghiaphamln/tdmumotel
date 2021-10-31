const UserModel = require('../models/user.model');
const ContactModel = require('../models/contact.model');
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const async = require('async');
const nodemailer = require('nodemailer')

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/gif") {
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("Image");

class HomeController {
    static index(req, res) {
        try {
            res.render('index', { title: 'Trang chủ', page_name: 'index', user: req.user });
        } catch (exception) {
            res.status(500).send(exception);
        }
    }

    static login(req, res) {
        try {
            res.render('login', { title: 'Đăng nhập', page_name: 'login', messages: req.flash('loginMessage') });
        } catch (exception) {
            res.status(500).send(exception);
        }
    }

    static about(req, res) {
        try {
            res.render('about', { title: 'Giới thiệu', page_name: 'about', user: req.user });
        } catch {
            res.status(500).send(exception);
        }
    }

    static register(req, res) {
        try {
            res.render('register', { title: 'Đăng ký', page_name: 'register', messages: req.flash('signupMessage') });
        } catch {
            res.status(500).send(exception);
        }
    }

    static motel(req, res) {
        try {
            res.render('motel', { title: 'Phòng trọ', page_name: 'motel', user: req.user });
        } catch {
            res.status(500).send(exception);
        }
    }

    static contactPage(req, res) {
        try {
            res.render('contact', { title: 'Phản hồi', page_name: 'contact', user: req.user, success: req.flash('success'), messages: req.flash('contactMessage')});
        } catch {
            res.status(500).send(exception);
        }
    }

    static async contact(req, res, next) {
        
        var title = req.body.subject;
        var content = req.body.message;
        var userid = req.user.id;
        var username = req.user.name;
        var useremail = req.user.email;
        var userpermission = req.user.permission;
        var userphone = req.user.phoneNumber;
        console.log(req.user.id);
        
    
        if (content === "" || title === "") {
            req.flash('contactMessage', 'Vui lòng điền đầy đủ các trường!');
            return res.redirect("/contact");
        }                                                             
        var NewContact = new ContactModel();
        NewContact.title = title;
        NewContact.content = content;
        NewContact.userid = userid;
        NewContact.phoneNumber = userphone;
        NewContact.permission = userpermission;
        NewContact.email = useremail;
        NewContact.name = username;
        
        NewContact.save();

        req.flash('success', 'Phản hồi của bạn đã được gửi đi, Chúng tôi sẽ phản hồi đến bạn sớm !!');
        return res.redirect("/contact");
    }

    static profilePage(req, res) {
        try {
            res.render('profile', { title: 'Thông tin cá nhân', page_name: 'profile', user: req.user });
        } catch {
            res.status(500).send(exception);
        }
    }

    static introPay(req, res) {
        try {
            if (req.user.permission == 0) {
                res.render('intropay', { title: 'Trả phí bài đăng', page_name: 'intropay', user: req.user });
            }
            else {
                res.render("/");
            }
        } catch {
            res.status(500).send(exception);
        }
    }

    static resetPasswordPage(req, res) {
        try {
            res.render('resetpassword', { title: 'Khôi phục mật khẩu', page_name: 'resetpassword', messages: req.flash('resetPasswordMessage') });
        } catch {
            res.status(500).send(exception);
        }
    }

    static async profile(req, res) {
        try {
            upload(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    res.json({ "kq": 0, "errMsg": "A Multer error occurred when uploading." });
                } else if (err) {
                    res.json({ "kq": 0, "errMsg": "An unknown error occurred when uploading." + err });
                } else {
                    var fullName = req.body.fullname;
                    var address = req.body.address;
                    var email = req.body.email;
                    var phone = req.body.phone;
                    console.log("Hình nè")
                    console.log(req.file)
                    console.log(req.file.filename)
                    try {
                        var avatar = '/uploads/' + req.file.filename;
                    }
                    catch {
                        var avatar = null;
                    }

                    UserModel.findOne({ _id: req.user._id }, (err, doc) => {

                        doc.name = fullName;
                        doc.email = email;
                        doc.phoneNumber = phone;
                        doc.address = address;
                        if (avatar) {
                            doc.avatar = avatar;
                        }
                        doc.save();
                    });

                    res.redirect('/profile');
                }
            });
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e);
        }
    }

    static async resetPassword(req, res, next) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                UserModel.findOne({ email: req.body.email }, function (err, user) {
                    if (!user) {
                        req.flash('resetPasswordMessage', 'Email không tồn tại.');
                        return res.redirect('/reset-password');
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function (err) {
                        done(err, token, user);
                    });
                });
            },
            function (token, user, done) {
                var smtpTransport = require('nodemailer-smtp-transport')
                var smtpTransport = nodemailer.createTransport(smtpTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'doanchuyennganh02@gmail.com',
                        pass: '1234@doan'
                    }
                }));
                console.log(req.body.email)
                var mailOptions = {
                    to: req.body.email,
                    from: 'doanchuyennganh02@gmail.com',
                    subject: 'Khôi phục lại mật khẩu',
                    text: 'Bạn nhận được thông báo này vì bạn (hoặc người khác) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.\n\n' +
                        'Vui lòng nhấp vào liên kết sau hoặc dán liên kết này vào trình duyệt của bạn để hoàn tất quá trình:\n\n' +
                        'http://' + req.headers.host + '/getnew-password/' + token + '\n\n' +
                        'Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    req.flash('resetPasswordMessage', 'Một email vừa được gửi tới ' + user.local.email + ' với hướng dẫn thêm.');
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err) return next(err);
            return res.redirect('/reset-password');
        });
    };

    static async changePassword(req, res, next) {
        // get new password
        let currentPassword = req.body.currentpassword;
        let newPassword = req.body.newpassword;
        let reenterPassword = req.body.reenterpassword;
        // hash password
        let hashNewPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8), null)
        let hashOldPassword = bcrypt.hashSync(currentPassword, bcrypt.genSaltSync(8), null)
        if (newPassword === "" || reenterPassword === "" || currentPassword === "") {
            req.flash('changePasswordMessage', 'Vui lòng điền đầy đủ các trường!');
            return res.redirect("/change-password");
        }


        if (newPassword.length < 8) {
            req.flash('changePasswordMessage', 'Mật khẩu mới phải có độ dài tối thiểu 8 ký tự!');
            return res.redirect("/change-password");
        }

        console.log(newPassword.length)
        if (newPassword != reenterPassword) {
            req.flash('changePasswordMessage', 'Mật khẩu mới không giống nhau!');
            return res.redirect("/change-password");
        }

        // check new passowrd
        if (currentPassword === newPassword) {
            req.flash('changePasswordMessage', 'Mật khẩu mới không được trùng với mật khẩu cũ!');
            return res.redirect("/change-password");
        }


        console.log(hashOldPassword);
        await UserModel.findOne({ _id: req.user._id }, (err, doc) => {
            // compareSync là hàm để kiểm tra mật khẩu mới và mật khẩu cũ (đã hash) có giống nhau hay không
            if (!bcrypt.compareSync(currentPassword, doc.local.password)) {
                req.flash('changePasswordMessage', 'Mật khẩu cũ không đúng!');
                return res.redirect("/change-password");
            }
            doc.local.password = hashNewPassword;
            doc.save();
            req.flash('success', 'Thay đổi mật khẩu thành công!');
            return res.redirect("/change-password");
        });
    }
    static changePasswordPage(req, res) {
        try {
            console.log("Đổi mật")
            console.log(req.user)
            res.render('changepassword', {title: 'Thay đổi mật khẩu', page_name: 'changepassword', user: req.user, success: req.flash('success'), messages: req.flash('changePasswordMessage')});
        } catch {
            res.status(500).send(exception);
        }
    }
    static getnewPasswordPage(req, res) {
        try {
            UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                console.log("Mã: ")
                console.log(req.params.token)
                if (!user) {
                    req.flash('getnewPasswordMessage', 'Mã thông báo đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
                    return res.redirect('/reset-password');
                }
                console.log(user)
                res.render('getnewpassword', { title: 'Đặt lại mật khẩu', page_name: 'getnewpassword', user: user, messages: req.flash('getnewPasswordMessage') });
            });

        } catch {
            res.status(500).send(exception);
        }
    }

    static getnewPassword(req, res) {
        let newPassword = req.body.newpassword;
        let reenterPassword = req.body.reenterpassword;
        console.log("NEW PASSWORD: ")
        console.log(newPassword)
        let hashNewPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8), null)


        async.waterfall([
            function (done) {
                UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                    if (!user) {
                        req.flash('getnewPasswordMessage', 'Mã thông báo đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
                        return res.redirect('back');
                    }
                    var url = "/getnew-password/" + req.params.token
                    if (newPassword === "" || reenterPassword === "") {
                        req.flash('getnewPasswordMessage', 'Vui lòng điền đầy đủ các trường!');
                        return res.redirect(url);
                    }

                    if (newPassword.length < 8) {
                        req.flash('getnewPasswordMessage', 'Mật khẩu mới phải có độ dài tối thiểu 8 ký tự!');
                        return res.redirect(url);
                    }

                    console.log(newPassword.length)
                    if (newPassword != reenterPassword) {
                        req.flash('getnewPasswordMessage', 'Mật khẩu mới không giống nhau!');
                        return res.redirect(url);
                    }
                    console.log(user.resetPasswordToken)
                    user.local.password = hashNewPassword;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save(function (err) {
                        req.logIn(user, function (err) {
                            done(err, user);
                        });
                    });

                });
            },
            function (user, done) {
                var smtpTransport = require('nodemailer-smtp-transport')
                var smtpTransport = nodemailer.createTransport(smtpTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'doanchuyennganh02@gmail.com',
                        pass: '1234@doan'
                    }
                }));
                var mailOptions = {
                    to: user.local.email,
                    from: 'doanchuyennganh02@gmail.com',
                    subject: 'Mật khẩu của bạn đã được thay đổi',
                    text: 'Xin chào ' + user.local.name + ' ,\n\n' +
                        'Đây là xác nhận rằng mật khẩu cho tài khoản của bạn ' + user.email + ' vừa được thay đổi.\n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    req.flash('success', 'Thành công!, mật khẩu của bạn đã được cập nhật rùi nhen!!!.');
                    done(err);
                });
            }
        ], function (err) {
            res.redirect('/');
        });
    }
}

module.exports = HomeController;
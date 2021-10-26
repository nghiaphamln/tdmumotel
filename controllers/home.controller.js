const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt')
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
}); 
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpeg" || file.mimetype=="image/jpg" || file.mimetype=="image/gif"){
            cb(null, true)
        }else{
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
            res.render('motel', {title: 'Phòng trọ', page_name: 'motel', user: req.user});
        } catch {
            res.status(500).send(exception);
        }
    }

    static introPay (req, res) {
        try {
            res.render('intropay', {title: 'Trả phí bài đăng', page_name: 'intropay', user: req.user});
        } catch {
            res.status(500).send(exception);
        }
    }

    static resetPassword (req, res) {
        try {
            res.render('resetpassword', {title: 'Khôi phục mật khẩu', page_name: 'resetpassword', user: req.user});
        } catch {
            res.status(500).send(exception);
        }
    }

    static changePasswordPage (req, res) {
        try {
            res.render('changepassword', {title: 'Thay đổi mật khẩu', page_name: 'changepassword', user: req.user, messages: req.flash('changePasswordMessage')});
        } catch {
            res.status(500).send(exception);
        }
    }

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
        console.log("ĐỘ DÀI:")
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
        await UserModel.findOne({_id: req.user._id}, (err, doc) => {
            // compareSync là hàm để kiểm tra mật khẩu mới và mật khẩu cũ (đã hash) có giống nhau hay không
            if (!bcrypt.compareSync(currentPassword, doc.local.password)) {
                req.flash('changePasswordMessage', 'Mật khẩu cũ không đúng!');
                return res.redirect("/change-password");
            }
            doc.local.password = hashNewPassword;
            doc.save();
            req.flash('changePasswordMessage', 'Thay đổi mật khẩu thành công!');
            return res.redirect("/change-password");
        });
    }
}
// }

module.exports = HomeController;
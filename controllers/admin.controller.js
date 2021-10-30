var UserModel = require('../models/user.model');
var PostModel = require('../models/motel.model');
var ContactModel = require('../models/contact.model');
class AdminController {
    static async qlbaidang(req, res, next) {
        try {
            res.render('admin/qlbaidang', { title: 'Quản lý bài đăng', page_name: 'qlbaidang', user: req.user });
        } catch {
            res.status(500).send(exception);
        }
    }

    static async duyetbai(req, res, next) {
        try {
            res.render('admin/duyetbai', {title: 'Duyệt bài', page_name: 'duyetbai', user: req.user });
        } catch {
            res.status(500).send(exception);
        }
    }

    static async qlthanhvien(req, res, next) {
        try {
            var listUser = await UserModel.find();  
            res.render('admin/qlthanhvien', { title: 'Quản lý thành viên', page_name: 'qlthanhvien', user: req.user, listUser: listUser });
        } catch {
            res.status(500).send(exception);
        }
    }

    static async banMember(req, res, next) {
        var userID = req.params.id;
        await UserModel.findOne({ _id: userID }, (err, doc) => {
            doc.status = 1;
            doc.save();
            res.redirect('/admin/qlthanhvien');
        });
    }

    static async unbanMember(req, res, next) {
        var userID = req.params.id;
        await UserModel.findOne({ _id: userID }, (err, doc) => {
            doc.status = 0;
            doc.save();
            res.redirect('/admin/qlthanhvien');
        });
    }

    static async xemphanhoi(req, res, next) {
        
        try {
            var listContact = await ContactModel.find({}); 
            res.render('admin/xemphanhoi', { title: 'Phản hồi từ thành viên', page_name: 'xemphanhoi', user: req.user, listContact: listContact});
        } catch {
            res.status(500).send(exception);
        }
    }
}
module.exports = AdminController;
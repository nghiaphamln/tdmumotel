var UserModel = require('../models/user.model');
var PostModel = require('../models/motel.model');

class AdminController {


    static async qlbaidang(req, res, next) {
        try {
            var listPost = await PostModel.find({status: 0}).sort({time: -1});
            res.render('admin/qlbaidang', { title: 'Quản lý bài đăng', page_name: 'qlbaidang', user: req.user, lisPost: listPost });
        } catch {
            res.status(500).send(exception);
        }
    }

    static async qlthanhvien(req, res, next) {
        try {
            var status = [
                '<span class="badge badge-info">Bình thường</span>',
                '<span class="badge badge-danger"> Bị cấm </span>'
            ];
            var listUser = await UserModel.find({});
            res.render('admin/qlthanhvien', {  user: req.user,
                listUser: listUser,
                title: 'Quản lý thành viên',
                page_name: 'qlthanhvien',
                status: status });
        } catch {
            res.status(500).send(exception);
        }
    }

    static async banMember(req, res, next) {
        var userID = req.params.id;
        await UserModel.findOne({_id: userID}, (err, doc) => {
            doc.status = 1;
            doc.save();
            res.redirect('/admin/qlthanhvien');
        });
    }

    static async unbanMember(req, res, next) {
        var userID = req.params.id;
        await UserModel.findOne({_id: userID}, (err, doc) => {
            doc.status = 0;
            doc.save();
            res.redirect('/admin/qlthanhvien');
        });
    }

}
module.exports = AdminController;
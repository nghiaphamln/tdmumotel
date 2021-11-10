var UserModel = require('../models/user.model');
var PostModel = require('../models/motel.model');
var ContactModel = require('../models/contact.model');
class AdminController {
    static async qlbaidang(req, res, next) {
        try {
            var listRoom = await PostModel.find();  
            res.render('admin/qlbaidang', { title: 'Quản lý bài đăng', page_name: 'qlbaidang', user: req.user, listRoom: listRoom });
        } catch {
            res.status(500).send(exception);
        }
    }

    static async viewRoomID(req, res, next) {
        try {
            var listPostID = await PostModel.findOne({_id: req.params.id});
            var userPost = await UserModel.findOne({_id: listPostID.userid})
            res.render('admin/viewroom', {
                title: 'Chi tiết bài đăng',
                page_name: 'viewroom',
                user: req.user,       
                userPost: userPost,
                _id: req.id,
                listPostID: listPostID,
                title: req.title,
                description: req.description,
                streetName: req.streetName,
                district: req.district,
                wards: req.wards,
                water: req.water,
                electric: req.electric,
                cost: req.cost,
                ultilities: req.ultilities,
                roomType: req.roomType,
                uploadImage: req.uploadImage,
                user: req.user,
            });
        }
        catch (e) {
            res.status(200).send('Error manager!');
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

    static async viewprofile(req, res) {
        try {
            var userPost = await UserModel.findOne({_id: req.params.id})
            console.log(userPost)  
            res.render('admin/viewprofile', {
                userPost: userPost,
                title: "Thông tin chủ trọ",
                page_name: 'viewprofile',
                user: req.user,                
            });
        }
        catch (e) {
            res.status(200).send('Error manager!');
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
            var listContact = await ContactModel.find().sort({time: -1}); 
            res.render('admin/xemphanhoi', { title: 'Phản hồi từ thành viên', page_name: 'xemphanhoi', user: req.user, listContact: listContact});
        } catch {
            res.status(500).send(exception);
        }
    }

    static async AddMember(req, res, next) {
        
        try {
            var listContact = await ContactModel.find({}); 
            res.render('/addmember', { title: 'Thêm quản trị viên', page_name: 'addmember', user: req.user, listContact: listContact});
        } catch {
            res.status(500).send(exception);
        }
    }
    static async deleteRoom(req, res, next) {
        
        var postID = req.params.id;
        await PostModel.deleteOne({_id: postID});
        res.redirect('admin/qlbaidang');
    }
}
module.exports = AdminController;
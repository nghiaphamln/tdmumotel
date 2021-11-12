var UserModel = require('../models/user.model');
var PostModel = require('../models/motel.model');
var ContactModel = require('../models/contact.model');
var ReplyModel = require('../models/reply.model');
const bcrypt = require('bcrypt');

const crypto = require('crypto')
const async = require('async');
const querystring = require('querystring');
const nodemailer = require('nodemailer')
const regexp = require('regexp')
const replyModel = require('../models/reply.model');
class AdminController {
    static async qlbaidang(req, res, next) {
        try {
            var listRoom = await PostModel.find();  
            res.render('admin/qlbaidang', { title: 'Quản lý bài đăng', page_name: 'qlbaidang', user: req.user, listRoom: listRoom });
        } catch {
            res.status(500).send(exception);
        }
    }

    static async AddMemberPage(req, res, next) {
        try {
            res.render('admin/addmember', { title: 'Thêm quản trị viên', page_name: 'addmember', user: req.user,  messages: req.flash('fail') });
        } catch {
            res.status(500).send(exception);
        }
    }

    static async viewRoomID(req, res, next) {
        try {
            var listPostID = await PostModel.findOne({_id: req.params.id});
            var userPost = await UserModel.findOne({_id: listPostID.userid})
            res.render('admin/viewroom', {
                page_name: 'viewroom',
                title: 'Chi tiết bài đăng',
                userPost: userPost,
                listPostID: listPostID,
                user: req.user,
            });
        }
        catch (e) {
            res.status(200).send('Error manager!');
        }
    }
//{$or: [{roomType: new RegExp(keyword)}, {wards: new RegExp(keyword)}, {description: new RegExp(keyword)}, {title: new RegExp(keyword)}]}
    static async qlthanhvien(req, res, next) {
        try {
            var listUser = await UserModel.find({$or: [{permission: 1}, {permission: 0}]});  
            var listUserAdmin = await UserModel.find();  
            res.render('admin/qlthanhvien', { title: 'Quản lý thành viên', page_name: 'qlthanhvien', user: req.user, listUser: listUser, listUserAdmin: listUserAdmin });
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

    static async Reply(req, res) {
        try {
            
            var contact = await ContactModel.findOne({userid: req.params.id})
            console.log(req.params.id)
            res.render('admin/replycontact', {
                contact: contact,
                title: "Trả lời phản hồi",
                page_name: 'replycontact',
                user: req.user,   
                messages: req.flash('fail'), 
                success: req.flash('success')              
            });
        }
        catch (e) {
            res.status(200).send('Error manager!');
        }
    }

    static async ReplyContact(req, res) {
        let title = req.body.subject;
        let content = req.body.message;
        var url = "/admin/replycontact/" + req.params.id
        console.log(url)
        if (title === "" || content === "") {
            req.flash('fail', 'Vui lòng điền đầy đủ các trường!');
            return res.redirect(url);
        }   
        console.log("Khúc này nè")
        console.log(req.user.id);
        console.log(req.params.id)
        var contact = await ContactModel.findOne({id: req.params.id})
        var replyAdmin = new replyModel();                                                  
        replyAdmin.title = title;
        replyAdmin.content = content;
        replyAdmin.adminid = req.user.id;
        replyAdmin.userid = req.params.id;
        console.log('contact nè:')
        console.log(contact)
        replyAdmin.save();
        var userPost = await UserModel.findOne({_id: contact.userid})
        console.log(req.params.id)
        console.log(userPost)
        async.waterfall([
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
                    to: userPost.local.email,
                    from: 'doanchuyennganh02@gmail.com',
                    subject: 'Phản hồi từ TDMU - Motel: ' + title,
                    text: 'Xin chào ' + userPost.local.name + ' ,\n\n' +
                        'Đây là trả lời của chúng tôi về phản hồi của bạn: ' + content + '.\n'
                };
                smtpTransport.sendMail(mailOptions)
                var contactID = req.params.id;
                ContactModel.findOne({id: contactID}, (err, doc) => {
                    doc.status = 1;
                    doc.save();
                });
                res.redirect('/admin/xemphanhoi');
            }
        ], function (err) {
            
        });
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

    static async AddMember(req, res) {
        let email = req.body.email;
        let newpassword = req.body.password;
        let phone = req.body.phone; 
        let name = req.body.username;
        // hash password
        let password = bcrypt.hashSync(newpassword, bcrypt.genSaltSync(8), null)
      
            
        if (email === "" || newpassword === "" || phone === "" || name === "") {
            req.flash('fail', 'Vui lòng điền đầy đủ các trường!');
            return res.redirect('/admin/addmember');
        }   

        if (newpassword.length < 8) {
            req.flash('fail', 'Mật khẩu phải có độ dài tối thiểu 8 ký tự!');
            return res.redirect('/admin/addmember');
        }
                                                          
        var User = new UserModel();
        User.email = email;
        User.phone = phone;
        User.name = name;
        User.password = password;
        
        User.save();
        res.redirect("/admin/qlthanhvien");
    }// ngon tim sua
    static async deleteRoom(req, res, next) {
        
        var postID = req.params.id;
        await PostModel.deleteOne({_id: postID});
        res.redirect('admin/qlbaidang');
    }
}
module.exports = AdminController;
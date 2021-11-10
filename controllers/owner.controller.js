var UserModel = require('../models/user.model');
var PostModel = require('../models/motel.model');
var ContactModel = require('../models/contact.model');
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
class OwnerController {
    static async addnewroomPage(req, res, next) {
        try {
            res.render('owner/addnewroom', { title: 'Thêm bài mới', page_name: 'addnewroom', user: req.user });
        } catch {
            res.status(500).send(exception);
        }
    }

    static async addNewRoom(req, res) {
        try {
            upload(req, res, function(err) {
                if (err instanceof multer.MulterError) {
                    res.json({"kq":0, "errMsg":"A Multer error occurred when uploading."});
                } else if (err) {
                    res.json({"kq":0, "errMsg":"An unknown error occurred when uploading." + err});
                } else {
                    var title = req.body.title;
                    var description = req.body.description;
                    var streetName = req.body.streetName;
                    var wards = req.body.wards;
                    var district = "Thủ Dầu Một";
                    var cost = req.body.cost; 
                    var water = req.body.water;
                    var electric = req.body.electric;
                    var area = req.body.area;
                    var ultilities = req.body.ultilities;
                    var roomType = req.body.roomType;
                    console.log(title)
                    console.log(title)
                    console.log(title)
                    console.log(title)
                    
                    try {
                        var uploadImage = '/uploads/' + req.file.filename;
                    } 
                    catch {
                        var uploadImage = null;
                    }
                    var newPost = new PostModel();
                    newPost.userid = req.user._id;
                    newPost.title = title;
                    newPost.description = description;
                    newPost.streetName = streetName;
                    newPost.district = district;
                    newPost.wards = wards;
                    newPost.water = water;
                    newPost.electric = electric;
                    newPost.cost = cost;
                    newPost.area = area;
                    newPost.ultilities = ultilities;
                    newPost.roomType = roomType;
                    newPost.uploadImage = uploadImage;

                    newPost.save();

                     res.redirect('/owner/listroom');
                }
            });     
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e);
        }
    }


    static async listroom(req, res, next) {
        console.log(req.user.id)
        try {
            var listRoom = await PostModel.find({userid: req.user.id});  
            console.log(listRoom)
            res.render('owner/listroom', { title: 'Danh sách phòng', page_name: 'listroom', user: req.user, listRoom: listRoom });
        } catch {
            res.status(500).send(exception);
        }
    }

    static async deleteRoom(req, res, next) {
        console.log(req.user.id)
        var postID = req.params.id;
        await PostModel.deleteOne({_id: postID});
        res.redirect('/owner/listroom');
    }

    static async viewRoomID(req, res, next) {
        try {
            var listPostID = await PostModel.findOne({_id: req.params.id});

            res.render('owner/editroom', {
                title: 'Chi tiết phòng',
                page_name: 'editroom',
                user: req.user,
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
                
            });
        }
        catch (e) {
            res.status(200).send('Error manager!');
        }
    }

    static async updateRoomID(req, res, next) {
        try {
          upload(req, res, function(err) {
            if (err instanceof multer.MulterError) {
                res.json({"kq":0, "errMsg":"A Multer error occurred when uploading."});
            } else if (err) {
                res.json({"kq":0, "errMsg":"An unknown error occurred when uploading." + err});
            } else {
              var postID = req.params.id;
              var title = req.body.title;
              var description = req.body.description;
              var streetName = req.body.streetName;
              var wards = req.body.wards;
              var cost = req.body.cost;
              var water = req.body.water;
              var electric = req.body.electric;
              var ultilities = req.body.ultilities;
              var roomType = req.body.roomType;
              try {
                  var uploadImage = '/uploads/' + req.file.filename;
              } 
              catch {
                  var uploadImage = null;
              }
  
              PostModel.findOne({_id: postID}, (err, doc) => {
                  doc.title = title;
                  doc.description = description;
                  doc.streetName = streetName;
                  doc.wards = wards;
                  doc.cost = cost;
                  doc.water = water;
                  doc.electric = electric;
                  doc.ultilities = ultilities;
                  doc.roomType = roomType;
                  if (uploadImage) {
                      doc.uploadImage = uploadImage;
                  }
                  doc.save();
              });
            var url = "/owner/editroom/"+req.params.id
              res.redirect(url);
            }
        });   
        }
        catch (e) {
            console.log(e);
            res.status(500).send(e);
        }
    }
  

    static async roominfo(req, res, next) {
        try {
            res.render('owner/roominfo', { title: 'Thông tin phòng', page_name: 'roominfo', user: req.user });
        } catch {
            res.status(500).send(exception);
        }
    }
}
module.exports = OwnerController;
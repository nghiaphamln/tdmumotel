var express = require('express');
var router = express.Router();

const AdminCtrl = require('../controllers/admin.controller');

router
    .get(
        '/qlbaidang',
        isAdmin,
        AdminCtrl.qlbaidang
    )
    .get(
        '/qlthanhvien',
        isAdmin,
        AdminCtrl.qlthanhvien
    )
    .get(
        '/ban-member/:id',
        AdminCtrl.banMember
    )
    .get(
        '/unban-member/:id',
        AdminCtrl.unbanMember
    )

    .get(
        '/xemphanhoi',
        isAdmin,
        AdminCtrl.xemphanhoi
    )

    .get(
        '/viewroom/:id',
        isAdmin,
        AdminCtrl.viewRoomID,
    )

    .get(
        '/viewprofile/:id',
        isAdmin,
        AdminCtrl.viewprofile,
    )

    .get(
        '/addmember',
        isAdmin,
        AdminCtrl.AddMemberPage
    )

module.exports = router;

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.permission >= 2) {
        return next();
    }
    res.redirect('/');
}
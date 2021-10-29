var express = require('express');
var router = express.Router();

const AdminCtrl = require('../controllers/admin.controller');

router
    .get(
        '/qlbaidang',
        AdminCtrl.qlbaidang
    )
    .get(
        '/qlthanhvien',
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
        AdminCtrl.xemphanhoi
    )

module.exports = router;
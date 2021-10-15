var express = require('express');
var router = express.Router();

const AdminCtrl = require('../controllers/admin.controller');

router
    .get(
        '/quan-li-bai-dang',
        AdminCtrl.qlbaidang
    )

module.exports = router;
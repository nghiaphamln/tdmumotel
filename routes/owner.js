var express = require('express');
var router = express.Router();

const OwnerCtrl = require('../controllers/owner.controller');

router
    .get(
        '/quan-li-phong-tro',
        OwnerCtrl.managementRoom
    )

module.exports = router;
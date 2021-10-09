var express = require('express');
var router = express.Router();

const HomeCtrl = require('../controllers/home.controller');

/* GET home page. */
router
    .get(
        '/',
        HomeCtrl.index
    )

    .get(
        '/login',
        HomeCtrl.login
    )

module.exports = router;

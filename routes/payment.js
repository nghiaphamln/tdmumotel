const express = require('express');
const router = express.Router();
const passport = require('passport');

const PaymentCtrl = require('../controllers/payment.controller');

router
    .get(
        '/pay',
        isLoggedIn,
        PaymentCtrl.MomoPayment
    )

    .get(
        '/return',
        isLoggedIn,
        PaymentCtrl.MomoCallBack
    )

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/');
    return next();
}

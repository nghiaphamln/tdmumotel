const crypto = require('crypto');
const https = require('https');
const UserModel = require('../models/user.model');

class PaymentController {
    static async Momo(amount) {
        let partnerCode = 'MOMOGLHN20211019';
        let accessKey = 'zCIHZDxamX93nNV8';
        let secretKey = 'k8SpnaXKA5Rw0yhKdCFwt3906YNReryl';
        let requestId = partnerCode + new Date().getTime();
        let orderId = requestId;
        let orderInfo = "Thanh toán qua ví điện tử Momo!";
        let redirectUrl = "http://localhost:3000/Payment/return";
        let ipnUrl = "https://callback.url/notify";
        let requestType = "captureWallet"
        let extraData = "";

        let rawSignature =
            "accessKey=" + accessKey +
            "&amount=" + amount +
            "&extraData=" + extraData +
            "&ipnUrl=" + ipnUrl +
            "&orderId=" + orderId +
            "&orderInfo=" + orderInfo +
            "&partnerCode=" + partnerCode +
            "&redirectUrl=" + redirectUrl +
            "&requestId=" + requestId +
            "&requestType=" + requestType;

        let signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        let requestBody = JSON.stringify({
            partnerCode : partnerCode,
            accessKey : accessKey,
            requestId : requestId,
            amount : amount,
            orderId : orderId,
            orderInfo : orderInfo,
            redirectUrl : redirectUrl,
            ipnUrl : ipnUrl,
            extraData : extraData,
            requestType : requestType,
            signature : signature
        });

        let options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }

        return new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                res.setEncoding('utf8');
                res.on('data', (body) => {
                    let data = JSON.parse(body);
                    resolve(data);
                });
            });

            req.write(requestBody);
            req.end();
        });
    }

    static async MomoPayment(req, res, next) {
        let amount = req.query.amount;
        if (amount) {
            PaymentController.Momo(amount).then((response) => {
                return res.redirect(response.payUrl);
            });
        }
        else {
            return res.redirect("/");
        }
    }

    static async MomoCallBack(req, res, next) {
        let status = req.query.resultCode;
        if (status == 0) {
            await UserModel.findOne({_id: req.user._id}, (err, doc) => {
                doc.money = Number(doc.money) + Number(req.query.amount);
                doc.permission = 1;
                doc.save();
                return res.redirect("/profile");
            });
        }
        else {
            return res.redirect("/");
        }
    }
}

module.exports = PaymentController;
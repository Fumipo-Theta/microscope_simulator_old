'use strict';
const stripe = require("stripe")("sk_test_1S43M9n9caeguCTmUV3Nr5Nk");//シークレットキーでインスタンス生成

exports.handler = (event, context, callback) => {

    const token = event['body-json'].token;

    stripe.charges.create({
        amount: 100,//100円で決済
        currency: "jpy",
        description: "Example charge",
        source: token,
    }, function(err, charge) {
        if(err){
            callback(err);
        }else{
            callback(null, charge);
        }
    });

};
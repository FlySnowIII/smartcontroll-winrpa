const functions = require('firebase-functions');
// Firebase 設定
const admin = require("firebase-admin");
const serviceAccount = require("./keys/p908-azest-smart-controller-firebase-adminsdk-bmk1g-383b4c2326.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://p908-azest-smart-controller.firebaseio.com"
});
const firebaseDatabase = admin.database();


/**
 * 01. IFTTT用WebAPI
 */
exports.iiftttwebapi = functions.https.onRequest((request, response) => {
    console.log('request.body:',request.body);
    // パラメータチェック
    if (request.body.hasOwnProperty('room')==false ||
        request.body.hasOwnProperty('runcmd')==false) {
        response.send("Error: Please set data like {room:'roomid',runcmd:'actioncode'}");
        return;
    }

    // Firebase Realtimedatabaseに格納するデータを準備
    let roomObj = {
        runcmd: request.body.runcmd,
        updated_time: new Date().getTime()
    }
    // Firebase Realtimedatabaseにデータを保存
    firebaseDatabase.ref('/rooms').child(request.body.room).child('runstate').update(roomObj);


    // 処理終了
    response.send("ifttt is ok");
});
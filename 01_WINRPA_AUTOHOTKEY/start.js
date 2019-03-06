// コマンド実行するためのライブラリをローディング
const exec = require('child_process').exec;
// ファイル書き込み用ライブラリ
var fs = require('fs');
// 配置ファイルのライブラリをローディング
require('dotenv').config();
// Firebase初期化
var admin = require("firebase-admin");
var serviceAccount = require("./keys/p908-azest-smart-controller-firebase-adminsdk-bmk1g-43f795d2c3.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://p908-azest-smart-controller.firebaseio.com"
});
const firebaseDatabase = admin.database();

/**
 * Main Program
 */
// ルーム番号を獲得する
let _ROOM_ID = process.env.ROOM_ID;
var _FIRST_SWITCH = true;

// 実行スクリプトファイルを作成する
firebaseDatabase.ref('/rooms').child(_ROOM_ID).child("commands").on('value',function(snapshort){
    var commandlist = snapshort.val();
    if(commandlist){
        for (const key in commandlist) {
            if (commandlist.hasOwnProperty(key)) {
                const commandFile = commandlist[key];
                console.log(commandFile);
                fs.writeFile(commandFile.cmd+'.ahk', commandFile.ahk, function (err) {
                    if (err) throw err;
                    let now = new Date();
                    console.log('CREATE SCRIPT:',now.toDateString(),':',commandFile.cmd+'.ahk');
                  });
                
            }
        }
    }
});

// コマンド実行状態が変更すると、ローカルのコマンドを実行する
firebaseDatabase.ref('/rooms').child(_ROOM_ID).child("runstate").on('value',function(snapshort){
    if(_FIRST_SWITCH){
        _FIRST_SWITCH = false;
        return;
    }
    var runstateObj = snapshort.val();
    if(runstateObj){
        let now = new Date();
        let tempcmd = runstateObj.runcmd + '.ahk';
        exec(tempcmd);
        console.log('RUN:',now.toDateString(),':',tempcmd);
    }
});



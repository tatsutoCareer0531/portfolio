const express = require('express');
const router = express.Router();
const dbConnect = require('../repository/dbConnect.js');
const CONST_VAL = require('./../constants/constants.js');

/*
  ログインAPI ログイン情報取得
*/
router.post('/getInfo', async function(req, res, next) {
  console.log('ログインAPI ログイン情報取得処理開始');
  let result = {
    statusCode: null,
    data: {}
  };
  try {
    // ログイン情報取得
    const loginInfoResult = await dbConnect.getLoginInfo(req.body.id, req.body.password);

    // ログイン情報設定
    let loginInfo = {};
    if (loginInfoResult.rows.length > 0) {
      loginInfo = {
        id: loginInfoResult.rows[0].ID,
        password: loginInfoResult.rows[0].SYSTEM_PASSWORD
      };
    }
    result.statusCode = loginInfoResult.statusCode;
    result.data = loginInfo;
  } catch(e) {
    console.log('ログインAPI ログイン情報取得処理エラー');
    console.log(e);
    result.statusCode = CONST_VAL.STATUS_CODE_BAD_REQUEST;
    result.data = {};
  }
  res.json(JSON.stringify(result));
  console.log(`レスポンス完了 (ステータスコード : ${result.statusCode})`);
  console.log('ログインAPI ログイン情報取得処理終了');
});

module.exports = router;

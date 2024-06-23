const express = require('express');
const router = express.Router();
const fs = require('fs');
const jszip = require('jszip');
const dbConnect = require('../repository/dbConnect.js');
const CONST_VAL = require('./../constants/constants.js');

/*
  写真API ランダム写真一覧取得
*/
router.get('/getRandomList', async function(req, res, next) {
  console.log('写真API ランダム写真一覧取得処理開始');
  let statusCode = null;
  let zipContent = null;

  try {
    // ランダム写真一覧情報取得
    const resultRows = await dbConnect.getRandomPhotoList();
    if (resultRows.length > 0) {
      const zip = new jszip();
      const folder = zip.folder('photoFolder');
      // 画像ファイル追加
      try {
        for (let row of resultRows) {
          const path = 
            CONST_VAL.FILE_PATH
              .replace('$1', row.PICTURE_YEAR)
              .replace('$2', row.PICTURE_DATE)
              .replace('$3', row.PICTURE_PLACE)
              .replace('$4', row.PICTURE_FILENAME);
          const file = fs.readFileSync(path);
          folder.file(`${row.ID}.jpg`, file);
        }
        console.log('画像ファイル追加完了');
      } catch (e) {
        console.log('画像ファイル追加エラー');
        throw e;
      }

      // zipファイル生成(Buffer型)
      zipContent = await zip.generateAsync({type:'nodebuffer'});
      console.log('zipファイル作成完了');
  
      // レスポンスヘッダ
      const fileName = 'randomPhotoList.zip';
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment;filename=${fileName}`);
    }
    statusCode = CONST_VAL.STATUS_CODE_OK;
  } catch(e) {
    console.log('写真API ランダム写真一覧取得処理エラー');
    console.log(e);
    statusCode = CONST_VAL.STATUS_CODE_BAD_REQUEST;
    zipContent = null;
  }

  res.send(zipContent).end();
  console.log(`ファイルデータレスポンス完了 (ステータスコード : ${statusCode})`);
  console.log('写真API ランダム写真一覧取得処理終了');
});

/*
  写真API 写真一覧取得
*/
router.get('/getList', async function(req, res, next) {
  console.log('写真API 写真一覧取得処理開始');
  let statusCode = null;
  let zipContent = null;

  try {
    // 写真一覧情報取得
    const resultRows = await dbConnect.getPhotoList(req.query.rowNumStart, req.query.rowNumEnd);
    if (resultRows.length > 0) {
      const zip = new jszip();
      const folder = zip.folder('photoFolder');
      // 画像ファイル追加
      try {
        for (let row of resultRows) {
          const path = 
            CONST_VAL.FILE_PATH
              .replace('$1', row.PICTURE_YEAR)
              .replace('$2', row.PICTURE_DATE)
              .replace('$3', row.PICTURE_PLACE)
              .replace('$4', row.PICTURE_FILENAME);
          const file = fs.readFileSync(path);
          folder.file(`${row.PICTURE_DATE}_${row.ID}.jpg`, file);
        }
        console.log('画像ファイル追加完了');
      } catch (e) {
        console.log('画像ファイル追加エラー');
        throw e;
      }

      // zipファイル生成(Buffer型)
      zipContent = await zip.generateAsync({type:'nodebuffer'});
      console.log('zipファイル作成完了');

      // レスポンスヘッダ
      const fileName = 'photoList.zip';
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment;filename=${fileName}`);
    }
    statusCode = CONST_VAL.STATUS_CODE_OK;
  } catch(e) {
    console.log('写真API 写真一覧取得処理エラー');
    console.log(e);
    statusCode = CONST_VAL.STATUS_CODE_BAD_REQUEST;
    zipContent = null;
  }

  res.send(zipContent).end();
  console.log(`ファイルデータレスポンス完了 (ステータスコード : ${statusCode})`);
  console.log('写真API 写真一覧取得処理終了');
});

/*
  写真API 写真詳細情報取得
*/
router.post('/getDetailInfo', async function(req, res, next) {
  console.log('写真API 写真詳細情報取得処理開始');
  let result = {
    statusCode: null,
    data: {}
  };
  try {
    // 写真詳細情報取得
    const photoInfoResult = await dbConnect.getPhotoDetailInfo(req.body.id);

    // 写真詳細情報設定
    let photoInfo = {};
    if (photoInfoResult.rows.length > 0) {
      photoInfo = {
        photoWH: photoInfoResult.rows[0].PICTURE_WH,
        photoPlace: photoInfoResult.rows[0].PICTURE_PLACE,
        photoDatetime: photoInfoResult.rows[0].PICTURE_DATETIME,
      };
    }
    result.statusCode = photoInfoResult.statusCode;
    result.data = photoInfo;
  } catch(e) {
    console.log('写真API 写真詳細情報取得処理エラー');
    console.log(e);
    result.statusCode = CONST_VAL.STATUS_CODE_BAD_REQUEST;
    result.data = {};
  }
  res.json(JSON.stringify(result));
  console.log(`レスポンス完了 (ステータスコード : ${result.statusCode})`);
  console.log('写真API 写真詳細情報取得処理終了');
});

module.exports = router;

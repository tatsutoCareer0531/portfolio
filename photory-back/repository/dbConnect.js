const mysql = require('mysql2/promise');
const CONST_VAL = require('./../constants/constants.js');

/*
  DB接続定義
*/
const dbConnectObject = {
  /*
    ログイン情報取得
  */
  getLoginInfo: async function(id, password) {
    console.log('ログイン情報取得処理開始');
    let client = null;
    let result = {
      statusCode: null,
      rows: []
    };
    try {
      // 接続処理開始 
      client = await mysql.createConnection(CONST_VAL.CONN);

      // データ取得
      const sql = `SELECT ID, SYSTEM_PASSWORD FROM USER_MST WHERE ID = ? AND SYSTEM_PASSWORD = ?`;
      const values = [id, password];
      const [rows, fields] = await client.execute(sql, values);
      result.statusCode = CONST_VAL.STATUS_CODE_OK;
      result.rows = rows;

      if (result.rows.length === 0) {
        result.statusCode = CONST_VAL.STATUS_CODE_NO_CONTENT;
        result.rows = [];
      }
    } catch(e) {
      // DBエラー
      console.log('ログイン情報取得処理エラー');
      throw e;
    } finally {
      if (client) {
        // 接続処理終了
        await client.end();
      }
    }
    console.log(`ステータスコード : ${result.statusCode}`);
    console.log('ログイン情報取得処理終了');
    return result;
  },
  /*
    ランダム写真一覧情報取得
  */
  getRandomPhotoList: async function() {
    console.log('ランダム写真一覧情報取得処理開始');
    let client = null;
    let resultRows = [];
    try {
      // 接続処理開始
      client = await mysql.createConnection(CONST_VAL.CONN);

      // データ取得
      const sql = `
        SELECT
          PIC.ID
          ,PIC.PICTURE_YEAR
          ,PIC.PICTURE_DATE
          ,PIC.PICTURE_PLACE
          ,PIC.PICTURE_FILENAME
        FROM
          PICTURE_INFO_TBL PIC
        ORDER BY
          RAND() LIMIT 6
      `;
      const [rows, fields] = await client.execute(sql);
      resultRows = rows;
    } catch(e) {
      // DBエラー
      console.log('ランダム写真一覧情報取得処理エラー');
      throw e;
    } finally {
      if (client) {
        // 接続処理終了
        await client.end();
      }
    }
    console.log(`ステータスコード : ${CONST_VAL.STATUS_CODE_OK}`);
    console.log('ランダム写真一覧情報取得処理終了');
    return resultRows;
  },
  /*
    写真一覧情報取得
  */
  getPhotoList: async function(rowNumStart, rowNumEnd) {
    console.log('写真一覧情報取得処理開始');
    let client = null;
    let resultRows = [];
    try {
      // 接続処理開始
      client = await mysql.createConnection(CONST_VAL.CONN);

      // データ取得
      const sql = `
        SELECT
          PIC.ID
          ,PIC.PICTURE_YEAR
          ,PIC.PICTURE_DATE
          ,PIC.PICTURE_PLACE
          ,PIC.PICTURE_FILENAME
        FROM (
          SELECT
            ROW_NUMBER() OVER(ORDER BY
              PICTURE_YEAR DESC
              ,PICTURE_DATE DESC
              ,PICTURE_DATETIME DESC
              ,ID ASC
            ) AS NUM
            ,ID
            ,PICTURE_YEAR
            ,PICTURE_DATE
            ,PICTURE_PLACE
            ,PICTURE_FILENAME
          FROM
            PICTURE_INFO_TBL
        ) PIC
        WHERE
          ? <= PIC.NUM AND PIC.NUM <= ?
        ORDER BY PIC.NUM ASC
      `;
      const values = [rowNumStart, rowNumEnd];
      const [rows, fields] = await client.execute(sql, values);
      resultRows = rows;
    } catch(e) {
      // DBエラー
      console.log('写真一覧情報取得処理エラー');
      throw e;
    } finally {
      if (client) {
        // 接続処理終了
        await client.end();
      }
    }
    console.log(`ステータスコード : ${CONST_VAL.STATUS_CODE_OK}`);
    console.log('写真一覧情報取得処理終了');
    return resultRows;
  },
  /*
    写真詳細情報取得
  */
  getPhotoDetailInfo: async function(id) {
    console.log('写真詳細情報取得処理開始');
    let client = null;
    let result = {
      statusCode: null,
      rows: []
    };
    try {
      // 接続処理開始 
      client = await mysql.createConnection(CONST_VAL.CONN);

      // データ取得
      const sql = `
        SELECT
          PICTURE_WH
          ,PICTURE_PLACE
          ,PICTURE_DATETIME
        FROM
          PICTURE_INFO_TBL
        WHERE ID = ?
      `;
      const values = [id];
      const [rows, fields] = await client.execute(sql, values);
      result.statusCode = CONST_VAL.STATUS_CODE_OK;
      result.rows = rows;

      if (result.rows.length === 0) {
        result.statusCode = CONST_VAL.STATUS_CODE_NO_CONTENT;
        result.rows = [];
      }
    } catch(e) {
      // DBエラー
      console.log('写真詳細情報取得処理エラー');
      throw e;
    } finally {
      if (client) {
        // 接続処理終了
        await client.end();
      }
    }
    console.log(`ステータスコード : ${result.statusCode}`);
    console.log('写真詳細情報取得処理終了');
    return result;
  }
};

module.exports = dbConnectObject;

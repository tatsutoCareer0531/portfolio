/*
  定数定義
*/
const CONST_VAL = {
  // DB接続情報
  CONN: {
    host: 'localhost',
    user: 'ユーザ',
    password: 'パスワード',
    database: 'データベース'
  },
  // ファイルパス
  FILE_PATH: 'C:/PhotoList/$1/$2/$3/$4',
  // ステータスコード
  STATUS_CODE_OK: '200',
  STATUS_CODE_NO_CONTENT: '204',
  STATUS_CODE_BAD_REQUEST: '400',
}

// プロパティ変更不可(フリーズ)
Object.freeze(CONST_VAL);

module.exports = CONST_VAL;

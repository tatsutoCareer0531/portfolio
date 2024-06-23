//ページ名
const PAGE_NAME_LOGIN                         = 'ログイン';
const PAGE_NAME_MENU                          = 'メニュー';
const PAGE_NAME_CALENDAR                      = 'カレンダー';
const PAGE_NAME_CALENDAR_REGIST               = 'カレンダー登録';
const PAGE_NAME_KAKEIBO                       = '家計簿';
const PAGE_NAME_STATISTICS                    = '統計データ';
const PAGE_NAME_DEPOSIT                       = '貯金額確認';
const PAGE_NAME_CREDIT                        = 'クレジット利用履歴';
const PAGE_NAME_SIMULATION                    = 'シミュレーション';
const PAGE_NAME_SETTING                       = '各種設定';
const PAGE_NAME_SYSTEM_PASSWORD               = '家計簿システムパスワード変更';
const PAGE_NAME_CATEGORY                      = '家計簿カテゴリー設定';
const PAGE_NAME_CALENDAR_DESIGNATED_DATE      = "カレンダー指定日変更";

// カレンダー基準日
const CALENDAR_REFERENCE_DATE          = 15;

//棒グラフ 背景色
const BAR_GRAPH_BGCOLOR_RED       = 'rgb(255, 199, 199)';
const BAR_GRAPH_BGCOLOR_BLUE      = 'rgb(194, 225, 255)';
const BAR_GRAPH_BGCOLOR_YELLOW    = 'rgb(255, 255, 190)';

//棒グラフ 枠線の色
const BAR_GRAPH_BDCOLOR_RED       = 'rgba(255, 100, 100)';
const BAR_GRAPH_BDCOLOR_BLUE      = 'rgb(119, 167, 255)';
const BAR_GRAPH_BDCOLOR_YELLOW    = 'rgb(231, 231, 41)';

//内訳の枠線の色
const UCHIWAKE_BDCOLOR_RED        = 'rgb(255, 100, 100)';
const UCHIWAKE_BDCOLOR_BLUE       = 'rgb(119, 167, 255)';
const UCHIWAKE_BDCOLOR_YELLOW     = 'rgb(221, 221, 86)';
const UCHIWAKE_BDCOLOR_DISABLED   = 'rgb(143, 143, 143)';

// 家計簿画面 家計簿表
const KAKEIBO_BGCOLOR_SPEND       = 'rgb(255, 205, 205)';
const KAKEIBO_BGCOLOR_INCOME      = 'rgb(200, 228, 255)';
const KAKEIBO_BGCOLOR_BALANCE     = 'rgb(255, 235, 205)';

// 貯金額確認画面 グラフ
const LINE_GRAPH_COLOR_ORANGE     = 'rgb(252, 115, 47)';
const BAR_GRAPH_BGCOLOR_ORANGE    = 'rgb(245, 206, 186)';
const BAR_GRAPH_BDCOLOR_ORANGE    = 'rgb(241, 129, 72)';

//円グラフ 各割合の背景色(支出)
const CIRCLE_GRAPH_BGCOLOR_SPEND = [
  "maroon",
  "brown",
  "indianred",
  "darksalmon",
  "lightcoral",
  "salmon",
  "coral",
  "tomato",
  "orangered",
  "red",
  "crimson",
  "mediumvioletred",
  "deeppink",
  "hotpink",
  "palevioletred",
  "pink",
  "magenta",
  "violet",
  "darkorchid",
  "darkmagenta"
];
//円グラフ 各割合の背景色(収入)
const CIRCLE_GRAPH_BGCOLOR_INCOME = [
  "midnightblue",
  "darkblue",
  "blue",
  "dodgerblue",
  "cornflowerblue",
  "lightskyblue",
  "lightblue",
  "cyan",
  "turquoise",
  "darkturquoise"
];

//「月」
const LABELS = [
  "1月", 
  "2月", 
  "3月", 
  "4月", 
  "5月", 
  "6月", 
  "7月", 
  "8月", 
  "9月", 
  "10月", 
  "11月", 
  "12月", 
];

//リターンコード
const RETURN_CODE_OK                   = '0';
const RETURN_CODE_NG                   = '-1';
const RETURN_CODE_ALREADY_REGIST       = '-2';
const RETURN_CODE_REGIST_NONE          = '-3';

//メッセージ
const MESSAGE_LOGIN_ERROR              = 'ログインエラー';
const MESSAGE_PASSWORD_ERROR           = 'パスワードエラー';
const MESSAGE_REGIST_OK                = '登録処理が完了しました';
const MESSAGE_REGIST_ALREADY_ERROR     = '既に登録されています';
const MESSAGE_REGIST_ERROR             = '登録処理に失敗しました';
const MESSAGE_UPDATE_OK                = '更新処理が完了しました';
const MESSAGE_UPDATE_ERROR             = '更新処理に失敗しました';
const MESSAGE_DELETE_OK                = '削除処理が完了しました';
const MESSAGE_DELETE_ERROR             = '削除処理に失敗しました';
const MESSAGE_PASSWORD_CHANGE_OK       = 'パスワード変更処理が完了しました';
const MESSAGE_PASSWORD_CHANGE_DIFFER   = '入力されたパスワードが異なります';
const MESSAGE_PASSWORD_CHANGE_ERROR    = 'パスワード変更処理に失敗しました';

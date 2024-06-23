package models.common.kakeibooPc;

public class ConstList {
	// 画面タイトル
	public static final String LOGIN                         = "ログイン";
  public static final String MENU                          = "メニュー";
  public static final String CALENDAR                      = "カレンダー";
  public static final String CALENDAR_REGIST               = "カレンダー登録";
  public static final String KAKEIBO                       = "家計簿";
  public static final String STATISTICS                    = "統計データ";
  public static final String DEPOSIT                       = "貯金額確認";
  public static final String CREDIT                        = "クレジット利用履歴";
  public static final String SIMULATION                    = "シミュレーション";
  public static final String SETTING                       = "各種設定";
  public static final String SYSTEM_PASSWORD               = "家計簿システムパスワード変更";
  public static final String CATEGORY                      = "家計簿カテゴリー設定";
  public static final String CALENDAR_DESIGNATED_DATE      = "カレンダー指定日変更";
  
  // 支出/収入
  public static final String IE_FLG_SPEND                  = "0";
  public static final String IE_FLG_INCOME                 = "1";

  // 円グラフ/棒グラフ
  public static final String GRAPH_CIRCLE                  = "circle";
  public static final String GRAPH_BAR                     = "bar";
  
  // リターンコード
  public static final String RETURN_CODE_OK                = "0";
  public static final String RETURN_CODE_NG                = "-1";
  public static final String RETURN_CODE_ALREADY_REGIST    = "-2";
  
  // ログイン画面URL
  public static final String LOGIN_URL                     = "/kakeiboo/login";
  
  // フォーマット ファイルパス
  public static final String FILE_PATH                     = "C:/MakeApp/kakeiboo/format_file/calendarData_format.xlsm";
}

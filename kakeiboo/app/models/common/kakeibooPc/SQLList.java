package models.common.kakeibooPc;

public class SQLList {
	// ユーザーマスタロックSQL
	public static final String USER_MST_LOCK_SQL = "LOCK TABLES USER_MST WRITE";

	// テーブルロック解除SQL
	public static final String TABLE_UNLOCK_SQL = "UNLOCK TABLES";

	// ログインユーザー判定SQL
	public static final String LOGIN_CHECK_SQL = "SELECT COUNT(ID) AS COUNT FROM USER_MST WHERE ID = :id AND SYSTEM_PASSWORD = :password";
	
	//　カテゴリーリスト取得SQL
	public static final String CATEGORY_LIST_SQL = "SELECT ID, IE_FLG AS FLG, NAME, SORT_KEY AS SORT FROM CATEGORY_MST ORDER BY IE_FLG, SORT_KEY";

	// 基準日取取得SQL
	public static final String DESIGNATED_DATE_SQL = "SELECT DESIGNATED_DATE FROM USER_MST WHERE ID = :id AND SYSTEM_PASSWORD = :password";

	// メニュー画面 一覧データ取得SQL
	public static final String MENU_LIST_SQL = 
      "SELECT " + 
        "IE_FLG AS FLG " + 
        ",CALENDAR_DATE AS DATE " + 
        ",CAST(SUM(AMOUNT) AS CHAR) AS AMOUNT " + 
      "FROM CALENDAR_TBL " + 
      "WHERE CALENDAR_DATE BETWEEN :dateStart AND :dateEnd " + 
      "GROUP BY IE_FLG, CALENDAR_DATE " + 
      "ORDER BY IE_FLG, CALENDAR_DATE";

	// メニュー画面 ニュース情報取得時SQL
	public static final String NEWS_SQL = "SELECT INFO FROM NEWS_TBL";

	// メニュー画面 天気情報取得時SQL
	public static final String WEATHER_SQL = "SELECT PLACE, STATUS, HIGH_TEMPERATURE, LOW_TEMPERATURE,	PRECIP,	RISE_SET_FLG FROM WEATHER_TBL";

	// カレンダー画面 一覧データ取得SQL
	public static final String CALENDAR_LIST_SQL = 
			"( " + 
			"	 SELECT " + 
			"	   CAL.ID AS CALENDAR_ID " + 
			"	   ,CAL.CALENDAR_DATE AS CALENDAR_DATE " + 
			"	   ,CAL.IE_FLG AS IE_FLG " + 
			"	   ,CATE.SORT_KEY AS SORT_KEY " + 
			"	   ,CATE.ID AS CATEGORY_ID " + 
			"	   ,CATE.NAME AS CATEGORY_NAME " + 
			"	   ,CAL.AMOUNT AS AMOUNT " + 
			"	   ,CAL.MEMO AS MEMO " + 
			"	 FROM CALENDAR_TBL CAL " + 
			"	 INNER JOIN CATEGORY_MST CATE " + 
			"    ON CAL.CATEGORY_ID = CATE.ID " + 
			"  WHERE CAL.CALENDAR_DATE BETWEEN :dateStart AND :dateEnd " + 
			") " + 
			"UNION ALL " + 
			"( " + 
			"	 SELECT " + 
			"	   MAX(CAL.ID) AS CALENDAR_ID " + 
			"	   ,CAL.CALENDAR_DATE AS CALENDAR_DATE " + 
			"	   ,CAL.IE_FLG AS IE_FLG " + 
			"	   ,9999 AS SORT_KEY " + 
			"	   ,CASE WHEN CAL.IE_FLG = '0' THEN 9999 ELSE 9998 END AS CATEGORY_ID " + 
			"	   ,CASE WHEN CAL.IE_FLG = '0' THEN '削除済み(支出)' ELSE '削除済み(収入)' END AS CATEGORY_NAME " + 
			"	   ,CAST(SUM(CAL.AMOUNT) AS CHAR) AS AMOUNT " + 
			"	   ,NULL AS MEMO " + 
			"	 FROM CALENDAR_TBL CAL " + 
			"	 LEFT OUTER JOIN CATEGORY_MST CATE " + 
			"	   ON CAL.CATEGORY_ID = CATE.ID " + 
			"	 WHERE CATE.ID IS NULL " + 
			"	 AND CAL.CALENDAR_DATE BETWEEN :dateStart AND :dateEnd " + 
			"  GROUP BY CAL.CALENDAR_DATE, CAL.IE_FLG, CATE.ID " + 
			") " + 
			"ORDER BY CALENDAR_DATE, IE_FLG DESC, SORT_KEY, CALENDAR_ID";

	// カレンダー画面 カレンダーテーブルロックSQL
	public static final String CALENDAR_TABLE_LOCK_SQL = "LOCK TABLES CALENDAR_TBL WRITE";

	// カレンダー画面 削除SQL
	public static final String CALENDAR_DELETE_SQL = "DELETE FROM CALENDAR_TBL WHERE CALENDAR_DATE LIKE :date";

	// カレンダー画面 登録SQL
	public static final String CALENDAR_REGIST_SQL = "INSERT INTO CALENDAR_TBL VALUES (:calendar_id, :date, :category_id, :ie_flg, :amount, :memo, CURRENT_TIMESTAMP)";

	// 家計簿画面 一覧取得SQL
	public static final String KAKEIBO_LIST_SQL = 
			"( " +
			"  SELECT " +
			"    CATE.IE_FLG AS IE_FLG " +
			"    ,CASE " +
			"      WHEN CATE.IE_FLG = '0' THEN (SELECT COUNT(*) FROM CATEGORY_MST WHERE IE_FLG = '0' GROUP BY IE_FLG) " +
			"      ELSE (SELECT COUNT(*) FROM CATEGORY_MST WHERE IE_FLG = '1' GROUP BY IE_FLG) " +
			"    END AS IE_COUNT " +
			"    ,CATE.SORT_KEY AS SORT_KEY " +
			"    ,CATE.ID AS CATEGORY_ID " +
			"    ,CATE.NAME AS CATEGORY_NAME " +
			"    ,LED.LEDGER_DATE AS LEDGER_DATE " +
			"    ,LED.AMOUNT AS AMOUNT " +
			"  FROM CATEGORY_MST CATE " +
			"  LEFT OUTER JOIN " +
			"  ( " +
			"    SELECT " +
			"      CATEGORY_ID " +
			"      ,LEDGER_DATE " +
			"      ,AMOUNT " +
			"    FROM LEDGER_TBL " +
			"    WHERE LEDGER_DATE LIKE :year " +
			"  ) LED " +
			"    ON CATE.ID = LED.CATEGORY_ID " +
			") " +
			"UNION ALL " +
			"( " +
			"  SELECT " +
			"    LED.IE_FLG AS IE_FLG " +
			"    ,0 AS IE_COUNT " +
			"    ,9999 AS SORT_KEY " +
			"    ,CASE WHEN LED.IE_FLG = '0' THEN 9999 ELSE 9998 END AS CATEGORY_ID " +
			"    ,CASE WHEN LED.IE_FLG = '0' THEN '削除済み(支出)' ELSE '削除済み(収入)' END AS CATEGORY_NAME " +
			"    ,LED.LEDGER_DATE AS LEDGER_DATE " +
			"    ,CAST(SUM(LED.AMOUNT) AS CHAR) AS AMOUNT " +
			"  FROM LEDGER_TBL LED " +
			"  LEFT OUTER JOIN CATEGORY_MST CATE " +
			"    ON LED.CATEGORY_ID = CATE.ID " +
			"  WHERE LED.LEDGER_DATE LIKE :year AND CATE.ID IS NULL " +
			"  GROUP BY LED.IE_FLG, CATE.ID, LED.LEDGER_DATE " +
			") " +
			"ORDER BY IE_FLG DESC, SORT_KEY, LEDGER_DATE";

	// 家計簿画面 カテゴリー合計取得SQL
	public static final String CATEGORY_SUM_LIST_SQL = 
			"( " + 
			"  SELECT " + 
			"	   CATE.IE_FLG IE_FLG " + 
			"	   ,CATE.ID AS ID " + 
			"	   ,CATE.SORT_KEY AS SORT_KEY " + 
			"	   ,CATE.NAME AS NAME " + 
			"	   ,CASE WHEN CAL.AMOUNT IS NULL THEN '0' ELSE CAL.AMOUNT END AS AMOUNT " + 
			"	 FROM CATEGORY_MST CATE " + 
			"	 LEFT OUTER JOIN " + 
			"	 ( " + 
			"	   SELECT CATEGORY_ID, CAST(SUM(AMOUNT) AS CHAR) AS AMOUNT " + 
			"	   FROM CALENDAR_TBL " + 
			"	   WHERE CALENDAR_DATE BETWEEN :dateStart AND :dateEnd " + 
			"	   GROUP BY CATEGORY_ID " + 
			"	 ) CAL " + 
			"	   ON CATE.ID = CAL.CATEGORY_ID " + 
			") " + 
			"UNION ALL " + 
			"( " + 
			"	 SELECT " + 
			"	   CAL.IE_FLG AS IE_FLG " + 
			"	   ,CASE WHEN CAL.IE_FLG = '0' THEN 9999 ELSE 9998 END AS ID " + 
			"	   ,9999 AS SORT_KEY " + 
			"	   ,CASE WHEN CAL.IE_FLG = '0' THEN '削除済み(支出)' ELSE '削除済み(収入)' END AS NAME " + 
			"	   ,CAST(SUM(AMOUNT) AS CHAR) AS AMOUNT " + 
			"	 FROM CALENDAR_TBL CAL " + 
			"	 LEFT OUTER JOIN CATEGORY_MST CATE " + 
			"	   ON CAL.CATEGORY_ID = CATE.ID " + 
			"	 WHERE CALENDAR_DATE BETWEEN :dateStart AND :dateEnd " + 
			"  AND CATE.ID IS NULL " + 
			"	 GROUP BY CAL.IE_FLG " + 
			") " + 
			"ORDER BY IE_FLG DESC, SORT_KEY";

	// 家計簿画面 家計簿テーブルロックSQL
	public static final String KAKEIBO_TABLE_LOCK_SQL = "LOCK TABLES LEDGER_TBL WRITE";

	// 家計簿画面 削除SQL
	public static final String KAKEIBO_DELETE_SQL = "DELETE FROM LEDGER_TBL WHERE LEDGER_DATE LIKE :year";

	// 家計簿画面 登録SQL
	public static final String KAKEIBO_REGIST_SQL = "INSERT INTO LEDGER_TBL VALUES (:date, :category, :ie_flg, :amount, CURRENT_TIMESTAMP)";

	// 統計データ画面 円グラフデータ取得SQL
	public static final String STATISTICS_CIRCLE_GRAPH_SQL = 
			"SELECT " + 
		    "LED.IE_FLG AS FLG " + 
		    ",CASE " + 
		      "WHEN CATE.NAME IS NULL AND LED.IE_FLG = '0' THEN " + 
		        "'削除済み(支出)' " + 
		      "WHEN  CATE.NAME IS NULL AND LED.IE_FLG = '1' THEN " + 
		        "'削除済み(収入)' " + 
		      "ELSE " + 
		        "CATE.NAME " + 
		    "END AS NAME " + 
		    ",CASE " + 
		      "WHEN LED.IE_FLG = '0' THEN " + 
		        "CASE " + 
		          "WHEN 0.5 > 100.0 * (SUM(LED.AMOUNT)/(SELECT SUM(AMOUNT) FROM LEDGER_TBL WHERE LEDGER_DATE LIKE :yearMonth AND IE_FLG = '0')) THEN " + 
		            "0 " + 
		          "ELSE " + 
		            "ROUND(100.0 * (SUM(LED.AMOUNT)/(SELECT SUM(AMOUNT) FROM LEDGER_TBL WHERE LEDGER_DATE LIKE :yearMonth AND IE_FLG = '0'))) " + 
		        "END " + 
		      "ELSE " + 
		        "CASE " + 
		          "WHEN 0.5 > 100.0 * (SUM(LED.AMOUNT)/(SELECT SUM(AMOUNT) FROM LEDGER_TBL WHERE LEDGER_DATE LIKE :yearMonth AND IE_FLG = '1')) THEN " + 
		            "0 " + 
		          "ELSE " + 
		            "ROUND(100.0 * (SUM(LED.AMOUNT)/(SELECT SUM(AMOUNT) FROM LEDGER_TBL WHERE LEDGER_DATE LIKE :yearMonth AND IE_FLG = '1'))) " + 
		        "END " + 
		    "END AS RATIO " + 
		  "FROM LEDGER_TBL LED " + 
		  "LEFT OUTER JOIN CATEGORY_MST CATE " + 
		    "ON LED.CATEGORY_ID = CATE.ID " + 
		  "WHERE LEDGER_DATE LIKE :yearMonth " + 
		  "GROUP BY LED.IE_FLG, CATE.ID, CATE.NAME, CATE.SORT_KEY " + 
		  "HAVING RATIO != 0 " + 
		  "ORDER BY LED.IE_FLG, CATE.SORT_KEY IS NULL ASC, CATE.SORT_KEY ";

	// 統計データ画面 棒グラフデータ取得SQL(カテゴリー全種類用)
	public static final String STATISTICS_BAR_GRAPH_ALL_SQL = 
			"SELECT " + 
		    "IE_FLG AS FLG " + 
		    ",LEDGER_DATE AS GRAPH_DATE " + 
		    ",SUM(AMOUNT) AS AMOUNT " + 
		  "FROM LEDGER_TBL " + 
		  "WHERE LEDGER_DATE LIKE :year " + 
		  "GROUP BY IE_FLG, LEDGER_DATE " + 
		  "ORDER BY IE_FLG, LEDGER_DATE";

	// 統計データ画面 棒グラフデータ取得SQL(カテゴリー指定用)
	public static final String STATISTICS_BAR_GRAPH_SELECT_SQL = 
			"SELECT " + 
		    "IE_FLG AS FLG " + 
		    ",LEDGER_DATE AS GRAPH_DATE " + 
		    ",SUM(AMOUNT) AS AMOUNT " + 
		  "FROM LEDGER_TBL " + 
		  "WHERE LEDGER_DATE LIKE :year " + 
		  "AND CATEGORY_ID = :category " + 
		  "GROUP BY IE_FLG, LEDGER_DATE " + 
		  "ORDER BY IE_FLG, LEDGER_DATE";

	// 貯金額確認画面 三菱UFJ銀行預金額データ取得SQL
	public static final String MUFJ_DEPOSIT_SQL = "SELECT AMOUNT FROM MUFJ_DEPOSIT_TBL WHERE ID = '1'";

	// 貯金額確認画面 東日本銀行貯金額一覧データ取得SQL
	public static final String HIGASHI_DEPOSIT_LIST_SQL = "SELECT DEPOSIT_DATE, AMOUNT FROM HIGASHI_DEPOSIT_TBL WHERE DEPOSIT_DATE LIKE :year ORDER BY DEPOSIT_DATE";

	// クレジット利用履歴画面 楽天クレジット一覧データ取得SQL
	public static final String RAKUTEN_CREDIT_LIST_SQL = "SELECT ID, CARD_NUMBER, CREDIT_DATE, NAME, AMOUNT FROM RAKUTEN_CREDIT_TBL WHERE CREDIT_USAGE_DATE = :yearMonth ORDER BY CARD_NUMBER, CREDIT_DATE DESC, ID";

	// 家計簿システムパスワード変更画面 パスワード変更SQL
	public static final String SYSTEM_PASSWORD_CHANGE_SQL = "UPDATE USER_MST SET SYSTEM_PASSWORD = :password, RECORD_DATE = CURRENT_TIMESTAMP WHERE ID = :id";

	// 家計簿カテゴリー設定画面 カテゴリーマスタロックSQL
	public static final String CATEGORY_MST_LOCK_SQL = "LOCK TABLES CATEGORY_MST WRITE";

	//　家計簿カテゴリー設定画面 カテゴリー削除SQL
	public static final String CATEGORY_DELETE_SQL = "DELETE FROM CATEGORY_MST";

	//　家計簿カテゴリー設定画面 カテゴリー登録SQL
	public static final String CATEGORY_REGIST_SQL = "INSERT INTO CATEGORY_MST VALUES (:id, :ieFlg, :name, :sortKey, CURRENT_TIMESTAMP)";

	// カレンダー指定日変更画面 カレンダー指定日変更SQL
	public static final String DESIGNATED_DATE_CHANGE_SQL = "UPDATE USER_MST SET DESIGNATED_DATE = :designated_date, RECORD_DATE = CURRENT_TIMESTAMP WHERE ID = :id AND SYSTEM_PASSWORD = :password";
}

package models.common.kakeibooMobile;

public class SQLList {
	// テーブルロック解除SQL
	public static final String TABLE_UNLOCK_SQL = "UNLOCK TABLES";

	// ログインユーザー判定SQL
	public static final String LOGIN_CHECK_SQL = "SELECT COUNT(ID) AS COUNT FROM USER_MST WHERE ID = :id AND SYSTEM_PASSWORD = :password";

	//　カテゴリーリスト取得SQL
	public static final String CATEGORY_LIST_SQL = "SELECT ID, IE_FLG AS FLG, NAME, SORT_KEY AS SORT FROM CATEGORY_MST ORDER BY IE_FLG, SORT_KEY";
	
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
	
	// カレンダー画面 削除済みカテゴリーデータ取得SQL
	public static final String CALENDAR_DELETED_LIST_SQL = 
			"SELECT CAL.ID AS CALENDAR_ID " + 
			"FROM CALENDAR_TBL CAL " + 
			"LEFT OUTER JOIN CATEGORY_MST CATE " + 
			"  ON CAL.CATEGORY_ID = CATE.ID " + 
			"WHERE CATE.ID IS NULL AND CAL.IE_FLG = :ie_flg AND CAL.CALENDAR_DATE = :date";
	
	// カレンダー画面 カレンダーテーブルロックSQL
	public static final String CALENDAR_TABLE_LOCK_SQL = "LOCK TABLES CALENDAR_TBL WRITE";
	
	// カレンダー画面 削除SQL
	public static final String CALENDAR_DELETE_SQL = "DELETE FROM CALENDAR_TBL WHERE ID = :calendar_id";

	// カレンダー画面 登録SQL
	public static final String CALENDAR_REGIST_SQL = "INSERT INTO CALENDAR_TBL VALUES (:calendar_id, :date, :category_id, :ie_flg, :amount, :memo, CURRENT_TIMESTAMP)";

	// 貯金額確認画面 三菱UFJ銀行預金額データ取得SQL
	public static final String MUFJ_DEPOSIT_SQL = "SELECT AMOUNT FROM MUFJ_DEPOSIT_TBL WHERE ID = '1'";

	// 貯金額確認画面 東日本銀行貯金額一覧データ取得SQL
	public static final String HIGASHI_DEPOSIT_LIST_SQL = "SELECT DEPOSIT_DATE, AMOUNT FROM HIGASHI_DEPOSIT_TBL WHERE DEPOSIT_DATE LIKE :year ORDER BY DEPOSIT_DATE";

	// クレジット利用履歴画面 楽天クレジット一覧データ取得SQL
	public static final String RAKUTEN_CREDIT_LIST_SQL = "SELECT ID, CARD_NUMBER, CREDIT_DATE, NAME, AMOUNT FROM RAKUTEN_CREDIT_TBL WHERE CREDIT_USAGE_DATE = :yearMonth ORDER BY CARD_NUMBER, CREDIT_DATE DESC, ID";
}

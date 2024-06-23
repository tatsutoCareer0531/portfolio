package models.dao.kakeibooPc;

import io.ebean.*;
import models.bean.kakeibooPc.KakeiboBean;
import models.common.kakeibooPc.SQLList;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.PersistenceException;

import com.google.gson.Gson;


public class KakeiboDao {
  /**
   * カレンダー指定日取得
   * @param id
   * @param password
   * @return sqlRows
   */
  public List<SqlRow> getDesignatedDate(String id, String password) {
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
	    //SQL
	    SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.DESIGNATED_DATE_SQL);
	    //パラメータ設定
	    sqlQuery.setParameter("id", id);
	    sqlQuery.setParameter("password", password);
	    sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      return sqlRows;
    }
    return sqlRows;
  }

  /**
   * 家計簿一覧取得
   * @param year
   * @return sqlRows
   */
  public List<SqlRow> getKakeiboList(String year) {
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
	    //SQL
			SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.KAKEIBO_LIST_SQL);
	    //パラメータ設定
	    sqlQuery.setParameter("year", year + "%");
	    sqlQuery.setParameter("year", year + "%");
	    sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      return sqlRows;
    }
    return sqlRows;
  }

  /**
   * カテゴリー合計取得処理
   * @param startDate
   * @param endDate
   * @return sqlRows
   */
  public List<SqlRow> getCategorySumList(String startDate, String endDate) {
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
	    // SQL
			SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.CATEGORY_SUM_LIST_SQL);
	    // パラメータ設定
	    sqlQuery.setParameter("dateStart", startDate);
	    sqlQuery.setParameter("dateEnd", endDate);
	    sqlQuery.setParameter("dateStart", startDate);
	    sqlQuery.setParameter("dateEnd", endDate);
	    sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      return sqlRows;
    }
    return sqlRows;
  }
  
  /**
   * 家計簿登録
   * @param id
   * @param password
   * @param year
   * @param registDataArray
   * @return result
   */
  public boolean kakeiboRegist(String id, String password, String year, String[] registDataArray) {
   	boolean result = false;
  	try {
	    Ebean.beginTransaction();
  		Gson gson = new Gson();
      SqlUpdate sqlUpdate = null;

    	// 家計簿テーブルロック
  		sqlUpdate = Ebean.createSqlUpdate(SQLList.KAKEIBO_TABLE_LOCK_SQL);
      sqlUpdate.execute();

      // 家計簿削除
     	sqlUpdate = Ebean.createSqlUpdate(SQLList.KAKEIBO_DELETE_SQL);
      sqlUpdate.setParameter("year", year + "%");
      sqlUpdate.execute();
      
      // 家計簿登録
  	  for(int i = 0; i < registDataArray.length; i++) {
      	sqlUpdate = Ebean.createSqlUpdate(SQLList.KAKEIBO_REGIST_SQL);
  	  	KakeiboBean kakeiboBean = gson.fromJson(registDataArray[i], KakeiboBean.class);
        sqlUpdate.setParameter("date", kakeiboBean.getLedgerDate());
        sqlUpdate.setParameter("category", kakeiboBean.getId());
        sqlUpdate.setParameter("ie_flg", kakeiboBean.getIeFlg());
        sqlUpdate.setParameter("amount", kakeiboBean.getAmount());
        sqlUpdate.execute();
  	  }
  	  
  	  // テーブルロック解除
     	sqlUpdate = Ebean.createSqlUpdate(SQLList.TABLE_UNLOCK_SQL);
      sqlUpdate.execute();

	    //コミット
	    Ebean.commitTransaction();
	  } catch(PersistenceException e) {
	  	//ロールバック
	  	Ebean.rollbackTransaction();
	    e.printStackTrace();
	    result = true;
	  } finally {
	    Ebean.endTransaction();
	  }
	  return result;
  }
}

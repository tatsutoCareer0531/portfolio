package models.dao.kakeibooPc;

import io.ebean.*;
import models.common.kakeibooPc.ConstMethod;
import models.common.kakeibooPc.SQLList;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.PersistenceException;


public class CalendarDesignatedDateDao {
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
   * カレンダー指定日変更処理
   * @param id
   * @param password
   * @param designatedDate
   * @return checkResult
   */
  public boolean calendarDesignatedDateChange(String id, String password, String designatedDate) {
  	boolean result = false;
	  try {
	    Ebean.beginTransaction();
      SqlUpdate sqlUpdate = null;

    	// ユーザーマスタロック
  		sqlUpdate = Ebean.createSqlUpdate(SQLList.USER_MST_LOCK_SQL);
      sqlUpdate.execute();

      // カレンダー指定日変更
      sqlUpdate = Ebean.createSqlUpdate(SQLList.DESIGNATED_DATE_CHANGE_SQL);    	
    	String designatedDateParam = null;
    	if(!ConstMethod.emptyCheckStr(designatedDate)) {
    		designatedDateParam = designatedDate;
    	}
    	sqlUpdate.setParameter("id", id);
      sqlUpdate.setParameter("password", password);
    	sqlUpdate.setParameter("designated_date", designatedDateParam);
	  	sqlUpdate.execute();

  	  // テーブルロック解除
     	sqlUpdate = Ebean.createSqlUpdate(SQLList.TABLE_UNLOCK_SQL);
      sqlUpdate.execute();

	  	// コミット
	    Ebean.commitTransaction();
	  } catch(PersistenceException e) {
	  	// ロールバック
	  	Ebean.rollbackTransaction();
	    e.printStackTrace();
	    result = true;
	  } finally {
	    Ebean.endTransaction();
	  }
	  return result;
  }
}

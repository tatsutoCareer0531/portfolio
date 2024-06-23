package models.dao.kakeibooPc;

import io.ebean.*;
import models.common.kakeibooPc.SQLList;
import java.util.List;
import javax.persistence.PersistenceException;


public class SystemPasswordDao {

	/**
   * 家計簿システムパスワードチェック処理
   * @param id
   * @param password
   * @return checkResult
   */
  public boolean systemPasswordBeforeCheck(String id, String password) {
    //SQL
    SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.LOGIN_CHECK_SQL);
    sqlQuery.setParameter("id", id);
    sqlQuery.setParameter("password", password);

    List<SqlRow> sqlRows = null;
    boolean checkResult = false;
    try{
      sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      checkResult = true;
      return checkResult;
    }

    SqlRow row = sqlRows.get(0);
    String resultNum = row.getString("COUNT");
    if(0 >= Integer.parseInt(resultNum)) {
      checkResult = true;
    }
    return checkResult;
	}

	/**
   * 家計簿システムパスワード変更処理
   * @param id
   * @param password
   * @return checkResult
   */
  public boolean systemPasswordChange(String id, String password) {
  	boolean result = false;
	  try {
	    Ebean.beginTransaction();
      SqlUpdate sqlUpdate = null;
      
    	// ユーザーマスタロック
  		sqlUpdate = Ebean.createSqlUpdate(SQLList.USER_MST_LOCK_SQL);
      sqlUpdate.execute();

      // パスワード変更
    	sqlUpdate = Ebean.createSqlUpdate(SQLList.SYSTEM_PASSWORD_CHANGE_SQL);    	
      sqlUpdate.setParameter("password", password);
    	sqlUpdate.setParameter("id", id);
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

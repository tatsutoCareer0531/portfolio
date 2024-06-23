package models.dao.kakeibooPc;

import io.ebean.*;
import models.bean.kakeibooPc.CalendarBean;
import models.common.kakeibooPc.SQLList;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.PersistenceException;

import com.google.gson.Gson;


public class CalendarDao {
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
   * カレンダー一覧取得処理
   * @param startDate
   * @param endDate
   * @return sqlRows
   */
  public List<SqlRow> getCalendarList(String startDate, String endDate) {
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
	    //SQL
	    SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.CALENDAR_LIST_SQL);
	    //パラメータ設定
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
   * カレンダー更新処理
   * @param yearMonthDate
   * @param updateDataArray
   * @return result
   */
  public boolean calendarUpdate(String id, String password, String yearMonthDate, String[] updateDataArray) {
   	boolean result = false;
  	try {
	    Ebean.beginTransaction();
  		Gson gson = new Gson();
      SqlUpdate sqlUpdate = null;

    	// カレンダーテーブルロック
  		sqlUpdate = Ebean.createSqlUpdate(SQLList.CALENDAR_TABLE_LOCK_SQL);
      sqlUpdate.execute();
      
      // カレンダー削除
     	sqlUpdate = Ebean.createSqlUpdate(SQLList.CALENDAR_DELETE_SQL);
      sqlUpdate.setParameter("date", "%" + yearMonthDate + "%");
      sqlUpdate.execute();
      
      // カレンダー登録
  	  for(int i = 0; i < updateDataArray.length; i++) {
  	  	CalendarBean calendarBean = gson.fromJson(updateDataArray[i], CalendarBean.class);
  	  	if (!calendarBean.isDeleteFlg()) {
  	  		sqlUpdate = Ebean.createSqlUpdate(SQLList.CALENDAR_REGIST_SQL);
          sqlUpdate.setParameter("calendar_id", calendarBean.getCalendarId());
          sqlUpdate.setParameter("date", calendarBean.getCalendarDate());
          sqlUpdate.setParameter("category_id", calendarBean.getId());
          sqlUpdate.setParameter("ie_flg", calendarBean.getIeFlg());
          sqlUpdate.setParameter("amount", calendarBean.getAmount());
          sqlUpdate.setParameter("memo", calendarBean.getMemo());
          sqlUpdate.execute();
  	  	}
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

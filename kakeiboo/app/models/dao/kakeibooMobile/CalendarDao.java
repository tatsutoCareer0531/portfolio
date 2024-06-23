package models.dao.kakeibooMobile;

import io.ebean.*;
import models.bean.kakeibooMobile.CalendarBean;
import models.bean.kakeibooMobile.CategoryBean;
import models.common.kakeibooMobile.ConstMethod;
import models.common.kakeibooMobile.SQLList;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.PersistenceException;

import com.google.gson.Gson;


public class CalendarDao {
  /**
   * カテゴリーリスト取得処理
   * @return categoryList
   */
  public List<CategoryBean> getCategoryList() {
	  List<CategoryBean> categorylist = new ArrayList<CategoryBean>();
    try{
      //SQL
      SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.CATEGORY_LIST_SQL);
      List<SqlRow> sqlRows = sqlQuery.findList();
  	  //取得リストをbeanに設定
  	  for(int i = 0; i < sqlRows.size(); i++) {
  	    SqlRow row = sqlRows.get(i);
  	    CategoryBean categoryBean = new CategoryBean();
  	    categoryBean.setId(row.getString("ID"));
  	    categoryBean.setName(row.getString("NAME"));
  	    categoryBean.setIeFlg(row.getString("FLG"));
  	    categorylist.add(categoryBean);
  	  }
    }catch(PersistenceException e){
      e.printStackTrace();
   	 return categorylist;
   }
    return categorylist;
  }

  /**
   * カレンダー一覧取得処理
   * @param dateStart
   * @param dateEnd
   * @return sqlRows
   */
  public List<SqlRow> getCalendarList(String dateStart, String dateEnd) {
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
	    //SQL
	    SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.CALENDAR_LIST_SQL);
	    //パラメータ設定
	    sqlQuery.setParameter("dateStart", dateStart);
	    sqlQuery.setParameter("dateEnd", dateEnd);
	    sqlQuery.setParameter("dateStart", dateStart);
	    sqlQuery.setParameter("dateEnd", dateEnd);
	    sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      return sqlRows;
    }
    return sqlRows;
  }
  
  /**
   * カレンダー登録処理
   * @param calendarDataArray
   * @return result
   */
  public boolean calendarRegist(String mobileId, String mobilePassword, String[] calendarDataArray) {
   	boolean result = false;
  	try {
	    Ebean.beginTransaction();
  		Gson gson = new Gson();
      SqlUpdate sqlUpdate = null;

    	// カレンダーテーブルロック
     	sqlUpdate = Ebean.createSqlUpdate(SQLList.CALENDAR_TABLE_LOCK_SQL);
      sqlUpdate.execute();
     	
  	  for (int i = 0; i < calendarDataArray.length; i++) {
  	  	CalendarBean calendarBean = gson.fromJson(calendarDataArray[i], CalendarBean.class);
  	  	// カレンダー削除
        if (!ConstMethod.emptyCheckStr(calendarBean.getCalendarId())) {
        	if (calendarBean.getId().equals("9999") || calendarBean.getId().equals("9998")) {
        		// 削除済みカテゴリーデータ取得
          	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
      	    SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.CALENDAR_DELETED_LIST_SQL);
      	    //パラメータ設定
      	    sqlQuery.setParameter("ie_flg", calendarBean.getIeFlg());
      	    sqlQuery.setParameter("date", calendarBean.getCalendarDate());
      	    sqlRows = sqlQuery.findList();
      		  for (int j = 0; j < sqlRows.size(); j++) {
      		    // 削除処理
      		    SqlRow row = sqlRows.get(j);
             	sqlUpdate = Ebean.createSqlUpdate(SQLList.CALENDAR_DELETE_SQL);
              sqlUpdate.setParameter("calendar_id", row.getString("CALENDAR_ID"));
              sqlUpdate.execute();
      		  }
        	} else {
        		// 通常削除
           	sqlUpdate = Ebean.createSqlUpdate(SQLList.CALENDAR_DELETE_SQL);
            sqlUpdate.setParameter("calendar_id", calendarBean.getCalendarId());
            sqlUpdate.execute();
        	}
        }
    		// カレンダー登録
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
	  }catch(PersistenceException e){
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

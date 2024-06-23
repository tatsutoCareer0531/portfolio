package models.dao.kakeibooPc;

import io.ebean.*;
import models.bean.kakeibooPc.CalendarBean;
import models.bean.kakeibooPc.CategoryBean;
import models.common.kakeibooPc.SQLList;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.PersistenceException;

import com.google.gson.Gson;


public class CalendarRegistDao {
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
   * カレンダー登録処理
   * @param registData
   * @return result
   */
  public boolean calendarDataRegist(String id, String password, String registData) {
   	boolean result = false;
  	try {
	    Ebean.beginTransaction();
  		Gson gson = new Gson();
  		String[] registDataArray = gson.fromJson(registData, String[].class);
  		SqlUpdate sqlUpdate = null;

    	// カレンダーテーブルロック
  		sqlUpdate = Ebean.createSqlUpdate(SQLList.CALENDAR_TABLE_LOCK_SQL);
      sqlUpdate.execute();

      // カレンダー登録
  	  for(int i = 0; i < registDataArray.length; i++) {
  	  	sqlUpdate = Ebean.createSqlUpdate(SQLList.CALENDAR_REGIST_SQL);
  	  	CalendarBean calendarBean = gson.fromJson(registDataArray[i], CalendarBean.class);
  			sqlUpdate.setParameter("calendar_id", null);
  	    sqlUpdate.setParameter("date", calendarBean.getCalendarDate());
  	    sqlUpdate.setParameter("category_id", calendarBean.getId());
  	    sqlUpdate.setParameter("ie_flg", calendarBean.getIeFlg());
  	    sqlUpdate.setParameter("amount", calendarBean.getAmount());
  	    sqlUpdate.setParameter("memo", calendarBean.getMemo());
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

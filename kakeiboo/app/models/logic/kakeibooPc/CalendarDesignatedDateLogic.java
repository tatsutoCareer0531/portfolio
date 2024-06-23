package models.logic.kakeibooPc;

import java.util.List;

import io.ebean.SqlRow;
import models.common.kakeibooPc.ConstList;
import models.dao.kakeibooPc.CalendarDesignatedDateDao;


public class CalendarDesignatedDateLogic {
	/**
   * カレンダー指定日変更ロジック
   * @param id
   * @param password
   * @return designatedDate
   */
	public String logic(String id, String password) {
  	String designatedDate = null;
		CalendarDesignatedDateDao calendarDesignatedDateDao = new CalendarDesignatedDateDao();
		List<SqlRow> sqlRows = calendarDesignatedDateDao.getDesignatedDate(id, password);
	  for(int i = 0; i < sqlRows.size(); i++) {
	  	SqlRow row = sqlRows.get(i);
	  	designatedDate = row.getString("DESIGNATED_DATE");
	  }
    return designatedDate;
	}

	/**
   * カレンダー指定日変更処理
   * @param id
   * @param password
   * @param designatedDate
   * @return リターンコード
   */
	public String calendarDesignatedDateChange(String id, String password, String designatedDate) {
	  //パスワード変更処理
		CalendarDesignatedDateDao calendarDesignatedDateDao = new CalendarDesignatedDateDao();
	  if(calendarDesignatedDateDao.calendarDesignatedDateChange(id, password, designatedDate)) {
	    return ConstList.RETURN_CODE_NG;
	  }
	  return ConstList.RETURN_CODE_OK;
	}
}

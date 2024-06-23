package models.logic.kakeibooPc;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import io.ebean.SqlRow;
import models.bean.kakeibooPc.CalendarBean;
import models.common.kakeibooPc.ConstList;
import models.dao.kakeibooPc.CalendarDao;


public class CalendarLogic {
	/**
   * カレンダーロジック
   * @param id
   * @param password
   * @return designatedDate
   */
	public String logic(String id, String password) {
  	String designatedDate = null;
		CalendarDao calendarDao = new CalendarDao();
		List<SqlRow> sqlRows = calendarDao.getDesignatedDate(id, password);
	  for(int i = 0; i < sqlRows.size(); i++) {
	  	SqlRow row = sqlRows.get(i);
	  	designatedDate = row.getString("DESIGNATED_DATE");
	  }
    return designatedDate;
	}

	/**
   * カレンダー一覧取得処理
   * @param startDate
   * @param endDate
   * @return カレンダー一覧
   */
	public String getCalendarList(String startDate, String endDate) {
		//該当の日付の家計簿のデータを取得する
		CalendarDao calendarDao = new CalendarDao();
		List<SqlRow> sqlRows = calendarDao.getCalendarList(startDate, endDate);

	  //取得結果
		List<CalendarBean> jsonArray = new ArrayList<>();
	  for(int i = 0; i < sqlRows.size(); i++) {
	    SqlRow row = sqlRows.get(i);
			CalendarBean calendarBean = new CalendarBean();
			calendarBean.setCalendarId(row.getString("CALENDAR_ID"));
			calendarBean.setCalendarDate(row.getString("CALENDAR_DATE"));
			calendarBean.setIeFlg(row.getString("IE_FLG"));
			calendarBean.setId(row.getString("CATEGORY_ID"));
			calendarBean.setName(row.getString("CATEGORY_NAME"));
			calendarBean.setAmount(row.getString("AMOUNT"));
			calendarBean.setMemo(row.getString("MEMO"));
			jsonArray.add(calendarBean);
	  }
    Gson gson = new Gson();
    String json = gson.toJson(jsonArray);
		return json;
	}
	
	/**
   * カレンダー更新処理
   * @param id
   * @param password
   * @param updateData
   * @return リターンコード
   */
	public String calendarUpdate(String id, String password, String updateData) {
		boolean result = false;

		Gson gson = new Gson();
		CalendarDao calendarDao = new CalendarDao();

		// カレンダー更新処理
		String[] updateDataArray = gson.fromJson(updateData, String[].class);
		CalendarBean calendarBean = gson.fromJson(updateDataArray[0], CalendarBean.class);
		String yearMonthDate = calendarBean.getCalendarDate();
		result = calendarDao.calendarUpdate(id, password, yearMonthDate, updateDataArray);

		if(result) {
  		return ConstList.RETURN_CODE_NG;
		}

		return ConstList.RETURN_CODE_OK;
	}
}

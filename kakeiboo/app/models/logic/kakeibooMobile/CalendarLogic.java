package models.logic.kakeibooMobile;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import io.ebean.SqlRow;
import models.bean.kakeibooMobile.CalendarBean;
import models.bean.kakeibooMobile.CategoryBean;
import models.common.kakeibooMobile.ConstList;
import models.common.kakeibooMobile.ConstMethod;
import models.dao.kakeibooMobile.CalendarDao;
import play.mvc.Controller;

public class CalendarLogic extends Controller {
  /**
   * カテゴリーデータ取得
   * @return categorylist
   */
	public List<CategoryBean> getCategoryList() {
		// カテゴリーリスト取得
	  CalendarDao calendarDao = new CalendarDao();
	  List<CategoryBean> categoryList = new ArrayList<CategoryBean>();
	  categoryList = calendarDao.getCategoryList();
	  return categoryList;
	}

	/**
   * カレンダー一覧取得処理
   * @param year
   * @param month
   * @return カレンダー一覧
   */
	public String getCalendarList(String year, String month) {
		//引数の年月の日付(月初から月末まで)取得
    String[] dateArray = ConstMethod.getDate(year, month);

		//該当の日付の家計簿のデータを取得する
		CalendarDao calendarDao = new CalendarDao();
		List<SqlRow> sqlRows = calendarDao.getCalendarList(dateArray[0], dateArray[1]);

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
   * カレンダー登録処理
   * @param calendarData
   * @return リターンコード
   */
	public String calendarRegist(String mobileId, String mobilePassword, String calendarData) {
		boolean result = false;

		Gson gson = new Gson();
		CalendarDao calendarDao = new CalendarDao();

		// カレンダー登録処理
		String[] calendarDataArray = gson.fromJson(calendarData, String[].class);
		result = calendarDao.calendarRegist(mobileId, mobilePassword, calendarDataArray);

		if(result) {
  		return ConstList.RETURN_CODE_NG;
		}

		return ConstList.RETURN_CODE_OK;
	}
}

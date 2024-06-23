package controllers.kakeibooMobile;

import play.mvc.*;

import java.util.List;
import java.util.Map;

import models.bean.kakeibooMobile.CategoryBean;
import models.common.kakeibooMobile.ConstList;
import models.logic.kakeibooMobile.CalendarLogic;


public class CalendarController extends KakeibooMobileController {
  /**
   * カレンダー画面へ遷移
   */
  public Result calendar() {
    // セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
		//ロジック処理
		CalendarLogic calendarLogic = new CalendarLogic();
		List<CategoryBean> categorylist = calendarLogic.getCategoryList();
  	// カレンダー画面へ遷移
    return ok(views.html.kakeibooMobile.calendar.render(ConstList.CALENDAR, categorylist));
  }

	/**
	* カレンダー画面 カレンダー一覧取得処理
	*/
	public Result getCalendarList() {
		Http.RequestBody requestBody = request().body();
		Map<String, String[]> param = requestBody.asFormUrlEncoded();
		String year = param.get("year")[0];
		String month = param.get("month")[0];
		//ロジック処理
		CalendarLogic calendarLogic = new CalendarLogic();
		String json = calendarLogic.getCalendarList(year, month);
		return ok(json);
	}
	
	/**
	* カレンダー画面 カレンダー登録処理
	*/
	public Result calendarRegist() {
		Http.RequestBody requestBody = request().body();
		Map<String, String[]> param = requestBody.asFormUrlEncoded();
		String calendarData = param.get("calendarData")[0];
		//ロジック処理
    String mobileId = session("mobile_id");
    String mobilePassword = session("mobile_password");
		CalendarLogic calendarLogic = new CalendarLogic();
		String rtnCd = calendarLogic.calendarRegist(mobileId, mobilePassword, calendarData);
		return ok(rtnCd);
	}
}

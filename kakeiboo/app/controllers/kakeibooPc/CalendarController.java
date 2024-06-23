package controllers.kakeibooPc;

import play.mvc.*;

import java.util.Map;

import models.logic.kakeibooPc.CalendarLogic;
import models.common.kakeibooPc.ConstList;


public class CalendarController extends KakeibooPcController {
	/**
	* カレンダー画面へ遷移
	*/
	public Result calendar() {
    //セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
  	//ロジック処理
    String id = session("id");
    String password = session("password");
    CalendarLogic calendarLogic = new CalendarLogic();
    String designatedDate = calendarLogic.logic(id, password);
		//カレンダー画面へ遷移
	 return ok(views.html.kakeibooPc.calendar.render(ConstList.CALENDAR, designatedDate));
	}
	
	/**
	* カレンダー画面 カレンダー一覧取得処理
	*/
	public Result getCalendarList() {
		Http.RequestBody requestBody = request().body();
		Map<String, String[]> param = requestBody.asFormUrlEncoded();
		String startDate = param.get("startDate")[0];
		String endDate = param.get("endDate")[0];
		//ロジック処理
		CalendarLogic calendarLogic = new CalendarLogic();
		String json = calendarLogic.getCalendarList(startDate, endDate);
		return ok(json);
	}
	
	/**
	* カレンダー画面 カレンダー更新処理
	*/
	public Result calendarUpdate() {
		Http.RequestBody requestBody = request().body();
		Map<String, String[]> param = requestBody.asFormUrlEncoded();
		String updateData = param.get("updateData")[0];
		//ロジック処理
    String id = session("id");
    String password = session("password");
		CalendarLogic calendarLogic = new CalendarLogic();
		String rtnCd = calendarLogic.calendarUpdate(id, password, updateData);
		return ok(rtnCd);
	}
}

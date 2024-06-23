package controllers.kakeibooPc;

import play.mvc.*;

import java.util.Map;

import models.logic.kakeibooPc.CalendarDesignatedDateLogic;
import models.common.kakeibooPc.ConstList;


public class CalendarDesignatedDateController extends KakeibooPcController {
	/**
	* カレンダー指定日変更画面へ遷移
	*/
	public Result calendarDesignatedDate() {
    //セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
  	//ロジック処理
    String id = session("id");
    String password = session("password");
    CalendarDesignatedDateLogic calendarDesignatedDateLogic = new CalendarDesignatedDateLogic();
    String designatedDate = calendarDesignatedDateLogic.logic(id, password);
    // カレンダー指定日変更画面へ遷移
	 	return ok(views.html.kakeibooPc.calendarDesignatedDate.render(ConstList.CALENDAR_DESIGNATED_DATE, designatedDate));
	}

  /**
   * カレンダー指定日変更画面 カレンダー指定日変更処理
   */
  public Result calendarDesignatedDateChange() {
		Http.RequestBody requestBody = request().body();
		Map<String, String[]> param = requestBody.asFormUrlEncoded();
		String designatedDate = param.get("designatedDate")[0];
    String id = session("id");
    String password = session("password");
  	//ロジック処理
    CalendarDesignatedDateLogic calendarDesignatedDateLogic = new CalendarDesignatedDateLogic();
	  String result = calendarDesignatedDateLogic.calendarDesignatedDateChange(id, password, designatedDate);
    return ok(result);
  }
}

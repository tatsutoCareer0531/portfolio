package controllers.kakeibooPc;

import play.mvc.*;

import java.util.List;
import java.util.Map;

import models.logic.kakeibooPc.CalendarRegistLogic;
import models.bean.kakeibooPc.CategoryBean;
import models.common.kakeibooPc.ConstList;


public class CalendarRegistController extends KakeibooPcController {
	/**
	* カレンダー登録画面へ遷移
	*/
	public Result calendarRegist() {
    //セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
		//ロジック処理
		CalendarRegistLogic calendarRegistLogic = new CalendarRegistLogic();
		List<CategoryBean> categorylist = calendarRegistLogic.getList();
		//カレンダー登録画面へ遷移
		return ok(views.html.kakeibooPc.calendarRegist.render(ConstList.CALENDAR_REGIST, categorylist));
	}

	/**
	* カレンダー登録画面 カレンダー登録処理
	*/
	public Result calendarDataRegist() {
		Http.RequestBody requestBody = request().body();
		Map<String, String[]> param = requestBody.asFormUrlEncoded();
		String registData = param.get("registData")[0];
		//ロジック処理
    String id = session("id");
    String password = session("password");
		CalendarRegistLogic calendarRegistLogic = new CalendarRegistLogic();  	
		String rtnCd = calendarRegistLogic.calendarDataRegist(id, password, registData);
		return ok(rtnCd);
	}

	/**
	* カレンダー登録画面 フォーマットダウンロード
	*/
	public Result formatDownload() {
		return ok(new java.io.File(ConstList.FILE_PATH));
	}
}

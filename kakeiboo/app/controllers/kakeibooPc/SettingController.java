package controllers.kakeibooPc;

import play.mvc.*;

import models.common.kakeibooPc.ConstList;


public class SettingController extends KakeibooPcController {
	/**
	* 各種設定画面へ遷移
	*/
	public Result setting() {
    //セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
		//設定画面へ遷移
		return ok(views.html.kakeibooPc.setting.render(ConstList.SETTING));
	}
}

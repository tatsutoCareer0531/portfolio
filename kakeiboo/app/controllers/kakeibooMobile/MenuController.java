package controllers.kakeibooMobile;

import play.mvc.*;

import models.common.kakeibooMobile.ConstList;


public class MenuController extends KakeibooMobileController {
  /**
   * メニュー画面へ遷移
   */
  public Result menu() {
    //セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
  	//メニュー画面へ遷移
    return ok(views.html.kakeibooMobile.menu.render(ConstList.MENU));
  }
}

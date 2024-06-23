package controllers.kakeibooMobile;

import play.mvc.*;
import java.util.Map;

import models.common.kakeibooMobile.ConstList;
import models.logic.kakeibooMobile.LoginLogic;


public class LoginController extends KakeibooMobileController {
	/**
   * ログイン画面へ遷移
   */
  public Result login() {
    //セッションをリセット
    session("mobile_id", "");
    session("mobile_password", "");
    // ログイン画面へ遷移
    return ok(views.html.kakeibooMobile.login.render(ConstList.LOGIN));
  }

	/**
   *　ログイン画面へリダイレクト("/kakeibooMobile" or "/kakeibooMobile/"で来た場合)
   */
	public Result redirectTop() {
  	// ログイン画面へリダイレクト
    return redirect(ConstList.LOGIN_URL);
	}

  /**
   * ログイン判定処理
   */
  public Result loginCheck() {
	  Http.RequestBody requestBody = request().body();
	  Map<String, String[]> param = requestBody.asFormUrlEncoded();
	  String id = param.get("id")[0];
	  String password = param.get("password")[0];
  	//ロジック処理
  	LoginLogic loginLogic = new LoginLogic();
  	String result = loginLogic.loginCheck(id, password);
    return ok(result);
  }
}

package controllers.kakeibooPc;

import play.mvc.*;
import java.util.Map;

import models.common.kakeibooPc.ConstList;
import models.logic.kakeibooPc.LoginLogic;


public class LoginController extends KakeibooPcController {
	/**
   * ログイン画面へ遷移
   */
  public Result login() {
    //セッションをリセット
    session("id", "");
    session("password", "");
    // ログイン画面へ遷移
    return ok(views.html.kakeibooPc.login.render(ConstList.LOGIN));
  }

	/**
   *　ログイン画面へリダイレクト("/" or "/kakeiboo" or "/kakeiboo/"で来た場合)
   */
	public Result redirectTop() {
  	// ログイン画面へリダイレクト
    return redirect(ConstList.LOGIN_URL);
	}

	/**
   *　ログイン画面へリダイレクト(その他不明なURLで来た場合)
   */
	public Result redirectTopAny(String anyUrl) {
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

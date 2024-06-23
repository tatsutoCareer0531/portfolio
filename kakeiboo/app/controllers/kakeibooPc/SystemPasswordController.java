package controllers.kakeibooPc;

import play.mvc.*;

import java.util.Map;

import models.logic.kakeibooPc.SystemPasswordLogic;
import models.common.kakeibooPc.ConstList;


public class SystemPasswordController extends KakeibooPcController {
	/**
	* 家計簿システムパスワード変更画面へ遷移
	*/
	public Result systemPassword() {
    //セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
		//家計簿システムパスワード変更画面へ遷移
	 	return ok(views.html.kakeibooPc.systemPassword.render(ConstList.SYSTEM_PASSWORD));
	}

  /**
   * 家計簿システムパスワード変更画面 家計簿システムパスワードチェック処理
   */
  public Result systemPasswordBeforeCheck() {
	  Http.RequestBody requestBody = request().body();
	  Map<String, String[]> param = requestBody.asFormUrlEncoded();
    String id = session("id");
	  String password = param.get("password")[0];
  	//ロジック処理
	  SystemPasswordLogic systemPasswordLogic = new SystemPasswordLogic();
	  String result = systemPasswordLogic.systemPasswordBeforeCheck(id, password);
    return ok(result);
  }

  /**
   * 家計簿システムパスワード変更画面 家計簿システムパスワード変更処理
   */
  public Result systemPasswordChange() {
	  Http.RequestBody requestBody = request().body();
	  Map<String, String[]> param = requestBody.asFormUrlEncoded();
    String id = session("id");
	  String password = param.get("password")[0];
  	//ロジック処理
	  SystemPasswordLogic systemPasswordLogic = new SystemPasswordLogic();
	  String result = systemPasswordLogic.systemPasswordChange(id, password);
    return ok(result);
  }
}

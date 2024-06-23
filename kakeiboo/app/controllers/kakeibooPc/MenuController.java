package controllers.kakeibooPc;

import play.mvc.*;
import models.logic.kakeibooPc.MenuLogic;

import java.util.Map;

import models.bean.kakeibooPc.MenuBean;
import models.common.kakeibooPc.ConstList;


public class MenuController extends KakeibooPcController {
  /**
   * メニュー画面へ遷移
   */
  public Result menu() {
    //セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
  	//ロジック処理
    String id = session("id");
    String password = session("password");
    MenuLogic menuLogic = new MenuLogic();
    MenuBean newsBean = menuLogic.logic(id, password);
  	//メニュー画面へ遷移
    return ok(views.html.kakeibooPc.menu.render(ConstList.MENU, newsBean));
  }
  
	/**
	* メニュー画面 グラフ一覧データ取得処理
	*/
	public Result getGraphList() {
		Http.RequestBody requestBody = request().body();
		Map<String, String[]> param = requestBody.asFormUrlEncoded();
		String startDate = param.get("startDate")[0];
		String endDate = param.get("endDate")[0];
		//ロジック処理
		MenuLogic menuLogic = new MenuLogic();
		String json = menuLogic.getGraphList(startDate, endDate);
		return ok(json);
	}
}

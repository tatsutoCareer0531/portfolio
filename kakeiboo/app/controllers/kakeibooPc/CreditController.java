package controllers.kakeibooPc;

import play.mvc.*;

import java.util.Map;

import models.logic.kakeibooPc.CreditLogic;
import models.common.kakeibooPc.ConstList;


public class CreditController extends KakeibooPcController {
	/**
	* クレジット利用履歴画面へ遷移
	*/
	public Result credit() {
    //セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
		//クレジット利用履歴画面へ遷移
		return ok(views.html.kakeibooPc.credit.render(ConstList.CREDIT));
	}

	/**
	* クレジット利用履歴画面 クレジット一覧取得処理
	*/
	public Result getCreditList() {
		Http.RequestBody requestBody = request().body();
	 	Map<String, String[]> param = requestBody.asFormUrlEncoded();
	 	String yearMonth = param.get("yearMonth")[0];
	 	String json = "";
		// ロジック処理
	 	CreditLogic creditLogic = new CreditLogic();
		json = creditLogic.getCreditList(yearMonth);
		return ok(json);
	}
}

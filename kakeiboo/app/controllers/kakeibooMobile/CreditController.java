package controllers.kakeibooMobile;

import play.mvc.*;

import java.util.Map;

import models.common.kakeibooMobile.ConstList;
import models.logic.kakeibooMobile.CreditLogic;


public class CreditController extends KakeibooMobileController {
  /**
   * クレジット利用履歴画面へ遷移
   */
  public Result credit() {
    // セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
  	// クレジット利用履歴画面へ遷移
    return ok(views.html.kakeibooMobile.credit.render(ConstList.CREDIT));
  }
  
	/**
	* クレジット利用履歴画面 クレジット一覧取得処理
	*/
	public Result getCreditList() {
		Http.RequestBody requestBody = request().body();
		Map<String, String[]> param = requestBody.asFormUrlEncoded();
		String yearMonth = param.get("yearMonth")[0];
		//ロジック処理
		CreditLogic creditLogic = new CreditLogic();
		String json = creditLogic.getCreditList(yearMonth);
		return ok(json);
	}
}

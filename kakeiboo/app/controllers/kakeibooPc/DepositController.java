package controllers.kakeibooPc;

import play.mvc.*;

import java.util.Map;

import models.logic.kakeibooPc.DepositLogic;
import models.common.kakeibooPc.ConstList;


public class DepositController extends KakeibooPcController {
	/**
	 * 貯金額確認画面へ遷移
	 */
	public Result deposit() {
    //セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
  	//ロジック処理
    DepositLogic depositLogic = new DepositLogic();
    String mufjDepositData = depositLogic.logic();
		//貯金額確認画面へ遷移
		return ok(views.html.kakeibooPc.deposit.render(ConstList.DEPOSIT, mufjDepositData));
	}

	/**
	 * 貯金額確認画面 東日本銀行貯金額一覧データ取得処理
	 */
	public Result getHigashiDepositList() {
		Http.RequestBody requestBody = request().body();
	 	Map<String, String[]> param = requestBody.asFormUrlEncoded();
	 	String year = param.get("year")[0];
	 	String json = "";
		// ロジック処理
	 	DepositLogic depositLogic = new DepositLogic();
		json = depositLogic.getHigashiDepositList(year);
		return ok(json);
	}
}

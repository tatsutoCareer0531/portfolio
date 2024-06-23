package controllers.kakeibooPc;

import play.mvc.*;

import java.util.Map;

import models.logic.kakeibooPc.KakeiboLogic;
import models.common.kakeibooPc.ConstList;


public class KakeiboController extends KakeibooPcController {
	/**
	 * 家計簿画面へ遷移
	 */
	public Result kakeibo() {
    //セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
  	//ロジック処理
    String id = session("id");
    String password = session("password");
    KakeiboLogic kakeiboLogic = new KakeiboLogic();
    String designatedDate = kakeiboLogic.logic(id, password);
		//家計簿画面へ遷移
	  return ok(views.html.kakeibooPc.kakeibo.render(ConstList.KAKEIBO, designatedDate));
	}

	/**
	* 家計簿画面 家計簿一覧取得処理
	*/
	public Result getKakeiboList() {
	  Http.RequestBody requestBody = request().body();
	  Map<String, String[]> param = requestBody.asFormUrlEncoded();
	 	String year = param.get("year")[0];
	 	String json = "";
		//ロジック処理
	 	KakeiboLogic kakeiboLogic = new KakeiboLogic();
		json = kakeiboLogic.getKakeiboList(year);
		return ok(json);
	}
	
	/**
	* 家計簿画面 カテゴリー合計取得処理
	*/
	public Result getCategorySumList() {
	  Http.RequestBody requestBody = request().body();
	  Map<String, String[]> param = requestBody.asFormUrlEncoded();
		String startDate = param.get("startDate")[0];
		String endDate = param.get("endDate")[0];
		//ロジック処理
	 	KakeiboLogic kakeiboLogic = new KakeiboLogic();
	 	String json = kakeiboLogic.getCategorySumList(startDate, endDate);
		return ok(json);
	}

	/**
	* 家計簿画面 家計簿登録処理
	*/
	public Result kakeiboRegist() {
		Http.RequestBody requestBody = request().body();
		Map<String, String[]> param = requestBody.asFormUrlEncoded();
		String registData = param.get("registData")[0];
		//ロジック処理
    String id = session("id");
    String password = session("password");
		KakeiboLogic kakeiboLogic = new KakeiboLogic();
		String rtnCd = kakeiboLogic.kakeiboRegist(id, password, registData);
		return ok(rtnCd);
	}
}

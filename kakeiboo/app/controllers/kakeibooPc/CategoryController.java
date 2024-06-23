package controllers.kakeibooPc;

import play.mvc.*;

import java.util.Map;

import models.logic.kakeibooPc.CategoryLogic;
import models.common.kakeibooPc.ConstList;


public class CategoryController extends KakeibooPcController {
	/**
	* 家計簿カテゴリー設定画面へ遷移
	*/
	public Result category() {
    //セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
		//家計簿カテゴリー設定画面へ遷移
	 	return ok(views.html.kakeibooPc.category.render(ConstList.CATEGORY));
	}

	/**
	* 家計簿カテゴリー設定画面 カテゴリーデータ取得処理
	*/
	public Result getSettingCategory() {
		//ロジック処理
		String json = "";
		CategoryLogic categoryLogic = new CategoryLogic();
		json = categoryLogic.getCategory();
		return ok(json);
	}

	/**
	* 家計簿カテゴリー設定画面 カテゴリーデータ更新処理
	*/
	public Result categoryUpdate() {
		Http.RequestBody requestBody = request().body();
		Map<String, String[]> param = requestBody.asFormUrlEncoded();
		String updateData = param.get("updateData")[0];
		//ロジック処理
		CategoryLogic categoryLogic = new CategoryLogic();
		String rtnCd = categoryLogic.categoryUpdate(updateData);
		return ok(rtnCd);
	}
}

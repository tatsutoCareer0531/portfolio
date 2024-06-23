package controllers.kakeibooPc;

import controllers.main.HomeController;
import models.common.kakeibooPc.ConstList;
import models.common.kakeibooPc.ConstMethod;


public class KakeibooPcController extends HomeController {
	/**
   * セッション判定処理
   * @return リターンコード
   */
	@Override
	public String sessionCheck() {
	  //セッション判定
		String id = session("id");
		String password = session("password");
		if(ConstMethod.emptyCheckStr(id) || ConstMethod.emptyCheckStr(password)) {
	    return ConstList.RETURN_CODE_NG;
	  }
    return ConstList.RETURN_CODE_OK;
	}
}

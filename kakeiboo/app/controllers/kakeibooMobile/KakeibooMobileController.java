package controllers.kakeibooMobile;

import controllers.main.HomeController;
import models.common.kakeibooMobile.ConstList;
import models.common.kakeibooMobile.ConstMethod;


public class KakeibooMobileController extends HomeController {
	/**
   * セッション判定処理
   * @return リターンコード
   */
	@Override
	public String sessionCheck() {
	  //セッション判定
		String id = session("mobile_id");
		String password = session("mobile_password");
		if(ConstMethod.emptyCheckStr(id) || ConstMethod.emptyCheckStr(password)) {
	    return ConstList.RETURN_CODE_NG;
	  }
    return ConstList.RETURN_CODE_OK;
	}
}

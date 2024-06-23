package models.logic.kakeibooMobile;

import models.common.kakeibooMobile.ConstList;
import models.dao.kakeibooMobile.LoginDao;
import play.mvc.Controller;


public class LoginLogic extends Controller {
	/**
   * ログイン判定処理
   * @return リターンコード
   */
	public String loginCheck(String id, String password) {
	  //ログイン判定処理
	  LoginDao loginDao = new LoginDao();
	  if(loginDao.loginCheck(id, password)) {
	    return ConstList.RETURN_CODE_NG;
	  }
	  //OKだった場合、セッションにログイン情報を設定
	  session("mobile_id", id);
	  session("mobile_password", password);
	  return ConstList.RETURN_CODE_OK;
	}
}

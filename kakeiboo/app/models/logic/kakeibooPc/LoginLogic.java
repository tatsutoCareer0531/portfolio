package models.logic.kakeibooPc;

import models.common.kakeibooPc.ConstList;
import models.dao.kakeibooPc.LoginDao;
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
	  session("id", id);
	  session("password", password);
	  return ConstList.RETURN_CODE_OK;
	}
}

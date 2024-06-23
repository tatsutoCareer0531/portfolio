package models.logic.kakeibooPc;

import models.common.kakeibooPc.ConstList;
import models.dao.kakeibooPc.SystemPasswordDao;
import play.mvc.Controller;

public class SystemPasswordLogic extends Controller {
	
	/**
   * 家計簿システムパスワードチェック処理
   * @param id
   * @param password
   * @return リターンコード
   */
	public String systemPasswordBeforeCheck(String id, String password) {
		SystemPasswordDao systemPasswordDao = new SystemPasswordDao();
	  if(systemPasswordDao.systemPasswordBeforeCheck(id, password)) {
	    return ConstList.RETURN_CODE_NG;
	  }
	  return ConstList.RETURN_CODE_OK;
	}

	/**
   * 家計簿システムパスワード変更処理
   * @param id
   * @param password
   * @return リターンコード
   */
	public String systemPasswordChange(String id, String password) {
	  //パスワード変更処理
		SystemPasswordDao systemPasswordDao = new SystemPasswordDao();
	  if(systemPasswordDao.systemPasswordChange(id, password)) {
	    return ConstList.RETURN_CODE_NG;
	  }
	  return ConstList.RETURN_CODE_OK;
	}
}

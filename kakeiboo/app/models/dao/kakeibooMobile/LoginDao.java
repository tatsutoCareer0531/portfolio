package models.dao.kakeibooMobile;

import io.ebean.*;
import models.common.kakeibooMobile.SQLList;

import java.util.List;
import javax.persistence.PersistenceException;


public class LoginDao {
  /**
   * ログイン判定
   * @param id
   * @param password
   * @return checkResult
   */
  public boolean loginCheck(String id, String password) {
    //SQL
    SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.LOGIN_CHECK_SQL);
    sqlQuery.setParameter("id", id);
    sqlQuery.setParameter("password", password);

    List<SqlRow> sqlRows = null;
    boolean checkResult = false;
    try{
      sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      checkResult = true;
      return checkResult;
    }

    SqlRow row = sqlRows.get(0);
    String resultNum = row.getString("COUNT");
    if(0 >= Integer.parseInt(resultNum)) {
      checkResult = true;
    }
    return checkResult;
  }
}

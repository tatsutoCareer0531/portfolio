package models.dao.kakeibooMobile;

import io.ebean.*;
import models.common.kakeibooMobile.SQLList;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.PersistenceException;


public class CreditDao {
  /**
   * クレジット一覧取得処理
   * @param yearMonth
   * @return sqlRows
   */
  public List<SqlRow> getCreditList(String yearMonth) {
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
	    //SQL
	    SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.RAKUTEN_CREDIT_LIST_SQL);
	    //パラメータ設定
	    sqlQuery.setParameter("yearMonth", yearMonth);
	    sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      return sqlRows;
    }
    return sqlRows;
  }
}

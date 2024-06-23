package models.dao.kakeibooPc;

import io.ebean.*;
import models.common.kakeibooPc.SQLList;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.PersistenceException;


public class DepositDao {
  /**
   * 三菱UFJ銀行預金額データ取得処理
   * @return sqlRows
   */
  public List<SqlRow> getMufjDeposit() {
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
	    //SQL
			SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.MUFJ_DEPOSIT_SQL);
	    sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      return sqlRows;
    }
    return sqlRows;
  }

  /**
   * 東日本銀行貯金額一覧データ取得処理
   * @param year
   * @return sqlRows
   */
  public List<SqlRow> getHigashiDepositList(String year) {
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
	    //SQL
			SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.HIGASHI_DEPOSIT_LIST_SQL);
	    //パラメータ設定
	    sqlQuery.setParameter("year", year + "%");
	    sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      return sqlRows;
    }
    return sqlRows;
  }
}

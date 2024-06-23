package models.dao.kakeibooPc;

import io.ebean.*;
import models.common.kakeibooPc.SQLList;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.PersistenceException;


public class MenuDao {
  /**
   * カレンダー指定日取得
   * @param id
   * @param password
   * @return sqlRows
   */
  public List<SqlRow> getDesignatedDate(String id, String password) {
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
	    //SQL
	    SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.DESIGNATED_DATE_SQL);
	    //パラメータ設定
	    sqlQuery.setParameter("id", id);
	    sqlQuery.setParameter("password", password);
	    sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      return sqlRows;
    }
    return sqlRows;
  }

  /**
   * グラフ一覧データ取得
   * @param startDate
   * @param endDate
   * @return sqlRows
   */
  public List<SqlRow> getGraphList(String startDate, String endDate) {  	
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
      // SQL
      SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.MENU_LIST_SQL);
      // パラメータ設定
      sqlQuery.setParameter("dateStart", startDate);
      sqlQuery.setParameter("dateEnd", endDate);
      sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      return sqlRows;
   }
    return sqlRows;
  }

  /**
   * ニュース情報取得
   * @return sqlRows
   */
  public List<SqlRow> getNews() {
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
      //SQL
      SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.NEWS_SQL);
      sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      return sqlRows;
   }
    return sqlRows;
  }

  /**
   * 天気情報取得
   * @return sqlRows
   */
  public List<SqlRow> getWeather() {
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
      //SQL
      SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.WEATHER_SQL);
      sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      return sqlRows;
   }
    return sqlRows;
  }
}

package models.dao.kakeibooPc;

import io.ebean.*;
import models.bean.kakeibooPc.CategoryBean;
import models.common.kakeibooPc.ConstList;
import models.common.kakeibooPc.ConstMethod;
import models.common.kakeibooPc.SQLList;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.PersistenceException;


public class StatisticsDao {
  /**
   * カテゴリーリスト取得処理
   * @return categoryList
   */
  public List<CategoryBean> getCategoryList() {
	  List<CategoryBean> categorylist = new ArrayList<CategoryBean>();
    try{
      //SQL
      SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.CATEGORY_LIST_SQL);
      List<SqlRow> sqlRows = sqlQuery.findList();
  	  //取得リストをbeanに設定
  	  for(int i = 0; i < sqlRows.size(); i++) {
  	    SqlRow row = sqlRows.get(i);
  	    CategoryBean categoryBean = new CategoryBean();
  	    categoryBean.setId(row.getString("ID"));
  	    categoryBean.setName(row.getString("NAME"));
  	    categoryBean.setIeFlg(row.getString("FLG"));
  	    categorylist.add(categoryBean);
  	  }
    }catch(PersistenceException e){
      e.printStackTrace();
   	 return categorylist;
   }
    return categorylist;
  }
	
  /**
   * 統計データ取得
   * @param graph
   * @param yearMonth
   * @param category
   * @return sqlRows
   */
  public List<SqlRow> getStatisticsList(String graph, String yearMonth, String category) {
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
			SqlQuery sqlQuery = null;
			if (graph.equals(ConstList.GRAPH_CIRCLE)) {
				// 円グラフ
		    sqlQuery = Ebean.createSqlQuery(SQLList.STATISTICS_CIRCLE_GRAPH_SQL);
		    sqlQuery.setParameter("yearMonth", yearMonth + "%");
		    sqlQuery.setParameter("yearMonth", yearMonth + "%");
		    sqlQuery.setParameter("yearMonth", yearMonth + "%");
		    sqlQuery.setParameter("yearMonth", yearMonth + "%");
		    sqlQuery.setParameter("yearMonth", yearMonth + "%");
			} else {
				// 棒グラフ
		    if (ConstMethod.emptyCheckStr(category)) {
			    sqlQuery = Ebean.createSqlQuery(SQLList.STATISTICS_BAR_GRAPH_ALL_SQL);
			    sqlQuery.setParameter("year", yearMonth + "%");
		    } else {
			    sqlQuery = Ebean.createSqlQuery(SQLList.STATISTICS_BAR_GRAPH_SELECT_SQL);
			    sqlQuery.setParameter("year", yearMonth + "%");
			    sqlQuery.setParameter("category", category);
		    }
			}
	    //SQL
	    //パラメータ設定
	    sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      return sqlRows;
    }
    return sqlRows;
  }
}

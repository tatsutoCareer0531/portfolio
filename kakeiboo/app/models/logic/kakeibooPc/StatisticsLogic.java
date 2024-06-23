package models.logic.kakeibooPc;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import io.ebean.SqlRow;
import models.bean.kakeibooPc.CategoryBean;
import models.bean.kakeibooPc.GraphBean;
import models.bean.kakeibooPc.StatisticsBean;
import models.common.kakeibooPc.ConstList;
import models.dao.kakeibooPc.StatisticsDao;


public class StatisticsLogic {
  /**
   * 統計データロジック
   * @return categorylist
   */
	public List<CategoryBean> logic() {
		// カテゴリーリスト取得
	  StatisticsDao statisticsDao = new StatisticsDao();
	  List<CategoryBean> categoryList = new ArrayList<CategoryBean>();
	  categoryList = statisticsDao.getCategoryList();
	  return categoryList;
	}

	/**
   * 統計データ取得処理
   * @param graph
   * @param yearMonth
   * @param 統計データ
   */
	public String getStatisticsList(String graph, String yearMonth, String category) {
	  StatisticsDao statisticsDao = new StatisticsDao();
		List<SqlRow> sqlRows = statisticsDao.getStatisticsList(graph, yearMonth, category);
	  //取得結果
		StatisticsBean statisticsBean = new StatisticsBean();
		List<GraphBean> spendGraphData = new ArrayList<GraphBean>();
		List<GraphBean> incomeGraphData = new ArrayList<GraphBean>();
	  for(int i = 0; i < sqlRows.size(); i++) {
	    SqlRow row = sqlRows.get(i);
	    GraphBean graphBean = new GraphBean();
			if (graph.equals(ConstList.GRAPH_CIRCLE)) {
				graphBean.setName(row.getString("NAME"));
				graphBean.setRatio(row.getString("RATIO"));
			} else {
				graphBean.setGraphDate(row.getString("GRAPH_DATE"));
				graphBean.setAmount(row.getString("AMOUNT"));
			}
			if (row.getString("FLG").equals(ConstList.IE_FLG_SPEND)) {
				spendGraphData.add(graphBean);
			} else {
				incomeGraphData.add(graphBean);
			}
	  }

    statisticsBean.setSpendGraphData(spendGraphData);
    statisticsBean.setIncomeGraphData(incomeGraphData);
    String json = new Gson().toJson(statisticsBean);
		return json;
	}
}

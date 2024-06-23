package models.bean.kakeibooPc;

import java.util.List;

/**
 * 統計データBean
 */
public class StatisticsBean {
	private List<GraphBean> spendGraphData;     // 支出グラフデータ
	private List<GraphBean> incomeGraphData;     // 収入グラフデータ

	public List<GraphBean> getSpendGraphData() {
		return spendGraphData;
	}

	public void setSpendGraphData(List<GraphBean> spendGraphData) {
		this.spendGraphData = spendGraphData;
	}

	public List<GraphBean> getIncomeGraphData() {
		return incomeGraphData;
	}

	public void setIncomeGraphData(List<GraphBean> incomeGraphData) {
		this.incomeGraphData = incomeGraphData;
	}
}

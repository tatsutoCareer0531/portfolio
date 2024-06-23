package models.bean.kakeibooPc;

import java.util.List;

/**
 * メニューBean
 */
public class MenuBean {
  private String designatedDate;               // カレンダー基準日
	private List<GraphBean> spendGraphData;      // 支出グラフデータ
	private List<GraphBean> incomeGraphData;     // 収入グラフデータ
	private List<NewsBean> newsList;             // ニュース情報一覧
	private List<WeatherBean> weatherList;       // 天気情報一覧

	public String getDesignatedDate() {
		return designatedDate;
	}

	public void setDesignatedDate(String designatedDate) {
		this.designatedDate = designatedDate;
	}

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

	public List<NewsBean> getNewsList() {
		return newsList;
	}

	public void setNewsList(List<NewsBean> newsList) {
		this.newsList = newsList;
	}
	
  public List<WeatherBean> getWeatherList() {
		return weatherList;
	}

	public void setWeatherList(List<WeatherBean> weatherList) {
		this.weatherList = weatherList;
	}
}

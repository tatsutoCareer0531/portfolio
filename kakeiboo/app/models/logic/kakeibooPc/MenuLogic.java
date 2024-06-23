package models.logic.kakeibooPc;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import io.ebean.SqlRow;
import models.bean.kakeibooPc.GraphBean;
import models.bean.kakeibooPc.MenuBean;
import models.bean.kakeibooPc.NewsBean;
import models.bean.kakeibooPc.WeatherBean;
import models.common.kakeibooPc.ConstNewsWeather;
import models.dao.kakeibooPc.MenuDao;

public class MenuLogic {
	/**
   * メニューロジック
   * @param id
   * @param password
   * @return newsBean
   */
	public MenuBean logic(String id, String password) {
		MenuBean menuBean = new MenuBean();

		// カレンダー指定日取得
		String designatedDate = null;
		MenuDao menuDao = new MenuDao();
		List<SqlRow> sqlRows = menuDao.getDesignatedDate(id, password);
	  for(int i = 0; i < sqlRows.size(); i++) {
	  	SqlRow row = sqlRows.get(i);
	  	designatedDate = row.getString("DESIGNATED_DATE");
	  }
	  menuBean.setDesignatedDate(designatedDate);
		
		// ニュースと天気の情報取得
    getNewsWeather(menuBean);
    
    return menuBean;
	}
	
	/**
   * グラフ一覧データ取得
   * @param startDate
   * @param endDate
   * @param グラフデータ
   */
	public String getGraphList(String startDate, String endDate) {
		MenuBean menuBean = new MenuBean();

		// グラフデータ取得
		MenuDao menuDao = new MenuDao();
		List<SqlRow> sqlRows = menuDao.getGraphList(startDate, endDate);

	  // 支出
		List<GraphBean> spendGraphData = new ArrayList<GraphBean>();
	  // 収入
		List<GraphBean> incomeGraphData = new ArrayList<GraphBean>();

	  // 取得結果
	  for(int i = 0; i < sqlRows.size(); i++) {
	    SqlRow row = sqlRows.get(i);
	  	GraphBean graphBean = new GraphBean();
	  	graphBean.setGraphDate(row.getString("DATE"));
	  	graphBean.setAmount(row.getString("AMOUNT"));
	  	if(row.getString("FLG").equals("0")) {
	  		spendGraphData.add(graphBean);
	  	} else {
	  		incomeGraphData.add(graphBean);
	  	}
	  }

	  menuBean.setSpendGraphData(spendGraphData);
	  menuBean.setIncomeGraphData(incomeGraphData);
		
		String json = new Gson().toJson(menuBean);
		return json;
	}

	/**
   * ニュース、天気情報取得
   * @param menuBean
   */
	private void getNewsWeather(MenuBean menuBean) {
		MenuDao menuDao = new MenuDao();

		// ニュース情報を取得
		List<NewsBean> newsList = new ArrayList<NewsBean>();
		List<SqlRow> sqlRows = menuDao.getNews();
		int newsLength = getNewsLength(sqlRows);
	  for(int i = 0; i < sqlRows.size(); i++) {
	    SqlRow row = sqlRows.get(i);
	    NewsBean newsBean = new NewsBean();
	    newsBean.setInfo(row.getString("INFO"));
	    newsBean.setNewsLength(newsLength);
	    newsList.add(newsBean);
	  }
	  menuBean.setNewsList(newsList);

		// 天気情報を取得
		List<WeatherBean> weatherList = new ArrayList<WeatherBean>();
		sqlRows = menuDao.getWeather();
	  for(int i = 0; i < sqlRows.size(); i++) {
	    SqlRow row = sqlRows.get(i);
	    WeatherBean weatherBean = new WeatherBean();
	    weatherBean.setPlace(row.getString("PLACE"));
	    weatherBean.setStatus(row.getString("STATUS"));
	    weatherBean.setHighTemp(row.getString("HIGH_TEMPERATURE"));
	    weatherBean.setLowTemp(row.getString("LOW_TEMPERATURE"));
	    weatherBean.setPrecip(row.getString("PRECIP"));
	    weatherBean.setRiseSetFlg(row.getString("RISE_SET_FLG"));
	    setIconNumber(weatherBean);
	    weatherList.add(weatherBean);
	  }
	  menuBean.setWeatherList(weatherList);
	}

	/**
   * ニュース文字数取得
   * @param sqlRows
   */
	private int getNewsLength(List<SqlRow> sqlRows) {
		int newsLength = 100;
	  for(int i = 0; i < sqlRows.size(); i++) {
	    SqlRow row = sqlRows.get(i);
	    newsLength += row.getString("INFO").length();
	  }
		return newsLength;
	}

	/**
   * 天気アイコン設定
   * @param weatherBean
   */
	private void setIconNumber(WeatherBean weatherBean) {
		if(weatherBean.getStatus().equals(ConstNewsWeather.SUNNY)) {
			// アイコン番号:1
			weatherBean.setIconNumber(ConstNewsWeather.ICON_SUNNY);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.CLOUDY)) {
			// アイコン番号:2
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.RAIN)) {
			// アイコン番号:3
			weatherBean.setIconNumber(ConstNewsWeather.ICON_RAIN);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SNOW)) {
			// アイコン番号:4
			weatherBean.setIconNumber(ConstNewsWeather.ICON_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SUNNY_AFTER_CLOUDY)) {
			// アイコン番号:5
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SUNNY);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SUNNY_TEMPORARY_CLOUDY)) {
			// アイコン番号:5
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SUNNY);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SUNNY_SOMETIMES_CLOUDY)) {
			// アイコン番号:5
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SUNNY);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.CLOUDY_AFTER_SUNNY)) {
			// アイコン番号:5
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SUNNY);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.CLOUDY_TEMPORARY_SUNNY)) {
			// アイコン番号:5
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SUNNY);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.CLOUDY_SOMETIMES_SUNNY)) {
			// アイコン番号:5
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SUNNY);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.CLOUDY_AFTER_RAIN)) {
			// アイコン番号:6
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_RAIN);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.CLOUDY_TEMPORARY_RAIN)) {
			// アイコン番号:6
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_RAIN);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.CLOUDY_SOMETIMES_RAIN)) {
			// アイコン番号:6
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_RAIN);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.RAIN_AFTER_CLOUDY)) {
			// アイコン番号:6
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_RAIN);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.RAIN_TEMPORARY_CLOUDY)) {
			// アイコン番号:6
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_RAIN);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.RAIN_SOMETIMES_CLOUDY)) {
			// アイコン番号:6
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_RAIN);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SUNNY_AFTER_RAIN)) {
			// アイコン番号:6
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_RAIN);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SUNNY_TEMPORARY_RAIN)) {
			// アイコン番号:6
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_RAIN);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SUNNY_SOMETIMES_RAIN)) {
			// アイコン番号:6
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_RAIN);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.RAIN_AFTER_SUNNY)) {
			// アイコン番号:6
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_RAIN);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.RAIN_TEMPORARY_SUNNY)) {
			// アイコン番号:6
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_RAIN);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.RAIN_SOMETIMES_SUNNY)) {
			// アイコン番号:6
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_RAIN);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.CLOUDY_AFTER_SNOW)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.CLOUDY_TEMPORARY_SNOW)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);			
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.CLOUDY_SOMETIMES_SNOW)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SNOW_AFTER_CLOUDY)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SNOW_TEMPORARY_CLOUDY)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SNOW_SOMETIMES_CLOUDY)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SNOW_AFTER_RAIN)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SNOW_TEMPORARY_RAIN)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SNOW_SOMETIMES_RAIN)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SUNNY_AFTER_SNOW)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SUNNY_TEMPORARY_SNOW)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SUNNY_SOMETIMES_SNOW)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SNOW_AFTER_SUNNY)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SNOW_TEMPORARY_SUNNY)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.SNOW_SOMETIMES_SUNNY)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.RAIN_AFTER_SNOW)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.RAIN_TEMPORARY_SNOW )) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.RAIN_SOMETIMES_SNOW)) {
			// アイコン番号:7
			weatherBean.setIconNumber(ConstNewsWeather.ICON_CLOUDY_SNOW);
		} else if(weatherBean.getStatus().equals(ConstNewsWeather.STORM)) {
			// アイコン番号:8
			weatherBean.setIconNumber(ConstNewsWeather.ICON_STORM);
		} else {
			// アイコン番号:99
			weatherBean.setIconNumber(ConstNewsWeather.ICON_QUESTION);
		}
	}
}

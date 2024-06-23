package models.bean.kakeibooPc;

/**
 * 天気情報Bean
 */
public class WeatherBean {
	
	private String place;          // 場所
	private String status;         // 天気
	private String highTemp;       // 最高気温
	private String lowTemp;        // 最低気温
	private String precip;         // 降水確率
	private String riseSetFlg;     // 昼夜フラグ
	private int iconNumber;        // アイコン番号
	
	public String getPlace() {
		return place;
	}
	
	public void setPlace(String place) {
		this.place = place;
	}
	
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getHighTemp() {
		return highTemp;
	}

	public void setHighTemp(String highTemp) {
		this.highTemp = highTemp;
	}

	public String getLowTemp() {
		return lowTemp;
	}

	public void setLowTemp(String lowTemp) {
		this.lowTemp = lowTemp;
	}
	
	public String getPrecip() {
		return precip;
	}

	public void setPrecip(String precip) {
		this.precip = precip;
	}

	public String getRiseSetFlg() {
		return riseSetFlg;
	}

	public void setRiseSetFlg(String riseSetFlg) {
		this.riseSetFlg = riseSetFlg;
	}

	public int getIconNumber() {
		return iconNumber;
	}

	public void setIconNumber(int iconNumber) {
		this.iconNumber = iconNumber;
	}
}

package models.bean.kakeibooPc;

/**
 * 天気情報Bean
 */
public class NewsBean {
	
	private String info;           // ニュース情報
	private int newsLength;        // ニュース文字数(全ニュース分)
	
	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public int getNewsLength() {
		return newsLength;
	}

	public void setNewsLength(int newsLength) {
		this.newsLength = newsLength;
	}
}

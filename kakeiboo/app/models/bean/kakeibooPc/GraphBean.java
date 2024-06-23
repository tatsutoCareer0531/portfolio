package models.bean.kakeibooPc;

/**
 * グラフデータ取得用Bean
 */
public class GraphBean extends CategoryBean {
  private String ratio;          // 割合
  private String graphDate;      // 日付
	private String amount;         // 金額

	public String getRatio() {
		return ratio;
	}

	public void setRatio(String ratio) {
		this.ratio = ratio;
	}

	public String getGraphDate() {
		return graphDate;
	}

	public void setGraphDate(String graphDate) {
		this.graphDate = graphDate;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}
}

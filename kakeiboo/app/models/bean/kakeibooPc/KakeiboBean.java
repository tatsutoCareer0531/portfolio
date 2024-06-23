package models.bean.kakeibooPc;

/**
 * 家計簿Bean
 */
public class KakeiboBean extends CategoryBean {
	private String ieCount;       // 各収支カテゴリー数
	private String ledgerDate;    // 家計簿年月
	private String amount;        // 金額

	public String getIeCount() {
		return ieCount;
	}
	
	public void setIeCount(String ieCount) {
		this.ieCount = ieCount;
	}

	public String getLedgerDate() {
		return ledgerDate;
	}

	public void setLedgerDate(String ledgerDate) {
		this.ledgerDate = ledgerDate;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

}

package models.bean.kakeibooPc;

/**
 * 貯金額確認Bean
 */
public class DepositBean {
  private String depositDate;    // カレンダー日付
	private String amount;         // 金額

	public String getDepositDate() {
		return depositDate;
	}

	public void setDepositDate(String depositDate) {
		this.depositDate = depositDate;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}
}

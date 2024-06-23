package models.bean.kakeibooPc;

/**
 * カテゴリー合計Bean
 */
public class CategorySumListBean extends CategoryBean {

	private String sumAmount;       // 合計金額

	public String getSumAmount() {
		return sumAmount;
	}

	public void setSumAmount(String sumAmount) {
		this.sumAmount = sumAmount;
	}

}

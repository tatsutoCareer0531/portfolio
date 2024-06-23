package models.bean.kakeibooPc;

/**
 * 各種設定カテゴリーBean
 */
public class EachSettingCategoryBean extends CategoryBean {
  private boolean deleteFlg;     //　削除フラグ

	public boolean isDeleteFlg() {
		return deleteFlg;
	}

	public void setDeleteFlg(boolean deleteFlg) {
		this.deleteFlg = deleteFlg;
	}
}

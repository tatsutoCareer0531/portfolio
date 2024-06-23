package models.bean.kakeibooPc;

/**
 * カテゴリーBean
 */
public class CategoryBean {
	private String id;            //カテゴリーID	
	private String ieFlg;         //収支フラグ
	private String name;          //カテゴリー名
	private String sortKey;       //ソートキー	
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public String getIeFlg() {
		return ieFlg;
	}
	
	public void setIeFlg(String ieFlg) {
		this.ieFlg = ieFlg;
	}

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getSortKey() {
		return sortKey;
	}
	
	public void setSortKey(String sortKey) {
		this.sortKey = sortKey;
	}
}

package models.logic.kakeibooPc;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import io.ebean.SqlRow;
import models.bean.kakeibooPc.KakeiboBean;
import models.bean.kakeibooPc.CategorySumListBean;
import models.common.kakeibooPc.ConstList;
import models.dao.kakeibooPc.KakeiboDao;

public class KakeiboLogic {
	/**
   * 家計簿ロジック
   * @param id
   * @param password
   * @return designatedDate
   */
	public String logic(String id, String password) {
  	String designatedDate = null;
  	KakeiboDao kakeiboDao = new KakeiboDao();
		List<SqlRow> sqlRows = kakeiboDao.getDesignatedDate(id, password);
	  for(int i = 0; i < sqlRows.size(); i++) {
	  	SqlRow row = sqlRows.get(i);
	  	designatedDate = row.getString("DESIGNATED_DATE");
	  }
    return designatedDate;
	}

	/**
   * 家計簿一覧取得処理
   * @param year
   * @return json
   */
	public String getKakeiboList(String year) {
	  KakeiboDao kakeiboDao = new KakeiboDao();
	  List<SqlRow> sqlRows = kakeiboDao.getKakeiboList(year);

		// 取得結果
	  List<KakeiboBean> kakeiboBeanList = new ArrayList<KakeiboBean>();
	  for(int i = 0; i < sqlRows.size(); i++) {
	  	SqlRow row = sqlRows.get(i);
	  	KakeiboBean kakeiboBean = new KakeiboBean();
	  	kakeiboBean.setIeFlg(row.getString("IE_FLG"));
	  	kakeiboBean.setIeCount(row.getString("IE_COUNT"));
	  	kakeiboBean.setSortKey(row.getString("SORT_KEY"));
	  	kakeiboBean.setId(row.getString("CATEGORY_ID"));
	  	kakeiboBean.setName(row.getString("CATEGORY_NAME"));
	  	kakeiboBean.setLedgerDate(row.getString("LEDGER_DATE"));
	  	kakeiboBean.setAmount(row.getString("AMOUNT"));
	  	kakeiboBeanList.add(kakeiboBean);
	  }

		String json = new Gson().toJson(kakeiboBeanList);
	  return json;
	}

	/**
   * カテゴリー合計取得処理
   * @param startDate
   * @param endDate
   * @return json
   */
	public String getCategorySumList(String startDate, String endDate) {
		// 家計簿一覧を取得する
		KakeiboDao kakeiboDao = new KakeiboDao();
		List<SqlRow> sqlRows = kakeiboDao.getCategorySumList(startDate, endDate);

		// 取得結果
	  List<CategorySumListBean> categorySumList = new ArrayList<CategorySumListBean>();
	  for(int i = 0; i < sqlRows.size(); i++) {
	  	SqlRow row = sqlRows.get(i);
		  CategorySumListBean categorySumListBean = new CategorySumListBean();
		  categorySumListBean.setIeFlg(row.getString("IE_FLG"));
		  categorySumListBean.setId(row.getString("ID"));
		  categorySumListBean.setName(row.getString("NAME"));
		  categorySumListBean.setSumAmount(row.getString("AMOUNT"));
		  categorySumList.add(categorySumListBean);
	  }

		String json = new Gson().toJson(categorySumList);
	  return json;
	}

	
	/**
   * 家計簿登録処理
   * @param id
   * @param password
   * @param registData
   * @return リターンコード
   */
	public String kakeiboRegist(String id, String password, String registData) {
		boolean result = false;

		Gson gson = new Gson();
		KakeiboDao kakeiboDao = new KakeiboDao();

  	// 家計簿登録処理
		String[] registDataArray = gson.fromJson(registData, String[].class);
   	KakeiboBean kakeiboBean = gson.fromJson(registDataArray[0], KakeiboBean.class);
   	String[] yearMonthArray = kakeiboBean.getLedgerDate().split("/");		
		result = kakeiboDao.kakeiboRegist(id, password, yearMonthArray[0], registDataArray);

		if(result) {
  		return ConstList.RETURN_CODE_NG;
		}

		return ConstList.RETURN_CODE_OK;
	}
}

package models.logic.kakeibooPc;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import io.ebean.SqlRow;
import models.bean.kakeibooPc.EachSettingCategoryBean;
import models.common.kakeibooPc.ConstList;
import models.dao.kakeibooPc.CategoryDao;
import play.mvc.Controller;

public class CategoryLogic extends Controller {
	/**
   * カテゴリーデータ取得処理
   * @return カテゴリーデータ
   */
	public String getCategory() {
		//カテゴリーデータを取得する
		CategoryDao categoryDao = new CategoryDao();
		List<SqlRow> sqlRows = categoryDao.getCategory();

	  //取得結果
	  List<EachSettingCategoryBean> categoryList = new ArrayList<EachSettingCategoryBean>();
	  for(int i = 0; i < sqlRows.size(); i++) {
	  	SqlRow row = sqlRows.get(i);
	  	EachSettingCategoryBean eachSettingCategoryBean = new EachSettingCategoryBean();
  	  eachSettingCategoryBean.setId(row.getString("ID"));
  	  eachSettingCategoryBean.setIeFlg(row.getString("FLG"));
  	  eachSettingCategoryBean.setName(row.getString("NAME"));
  	  eachSettingCategoryBean.setSortKey(row.getString("SORT"));
  	  categoryList.add(eachSettingCategoryBean);
	  }

		String json = new Gson().toJson(categoryList);
	  return json;
	}

	/**
   * カテゴリーデータ更新処理
   * @param updateData
   * @return リターンコード
   */
	public String categoryUpdate(String updateData) {
		boolean result = false;

		Gson gson = new Gson();
		CategoryDao categoryDao = new CategoryDao();

		// カレンダー更新処理
		String[] updateDataArray = gson.fromJson(updateData, String[].class);
		result = categoryDao.categoryUpdate(updateDataArray);

		if(result) {
  		return ConstList.RETURN_CODE_NG;
		}
		return ConstList.RETURN_CODE_OK;
	}
}

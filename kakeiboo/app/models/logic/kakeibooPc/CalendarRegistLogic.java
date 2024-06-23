package models.logic.kakeibooPc;

import java.util.ArrayList;
import java.util.List;

import models.bean.kakeibooPc.CategoryBean;
import models.common.kakeibooPc.ConstList;
import models.dao.kakeibooPc.CalendarRegistDao;

public class CalendarRegistLogic {
  /**
   * カテゴリーデータ取得
   * @return categorylist
   */
	public List<CategoryBean> getList() {
		// カテゴリーリスト取得
	  CalendarRegistDao calendarRegistDao = new CalendarRegistDao();
	  List<CategoryBean> categoryList = new ArrayList<CategoryBean>();
	  categoryList = calendarRegistDao.getCategoryList();
	  return categoryList;
	}

  /**
   * カレンダー登録
   * @param registData
   * @return リターンコード
   */
	public String calendarDataRegist(String id, String password, String registData) {
  	// カレンダー登録処理
	  CalendarRegistDao calendarRegistDao = new CalendarRegistDao();
		boolean result = calendarRegistDao.calendarDataRegist(id, password, registData);
		if(result) {
  		return ConstList.RETURN_CODE_NG;
		}
		return ConstList.RETURN_CODE_OK;
	}
}

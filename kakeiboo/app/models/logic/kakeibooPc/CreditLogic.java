package models.logic.kakeibooPc;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import io.ebean.SqlRow;
import models.bean.kakeibooPc.CreditBean;
import models.dao.kakeibooPc.CreditDao;


public class CreditLogic {
	/**
   * クレジット一覧データ取得処理
   * @param yearMonth
   * @return クレジット一覧
   */
	public String getCreditList(String yearMonth) {
		//該当の日付の家計簿のデータを取得する
		CreditDao creditDao = new CreditDao();
		List<SqlRow> sqlRows = creditDao.getCreditList(yearMonth);

	  //取得結果
		List<CreditBean> jsonArray = new ArrayList<>();
	  for(int i = 0; i < sqlRows.size(); i++) {
	    SqlRow row = sqlRows.get(i);
	    CreditBean creditBean = new CreditBean();
	    creditBean.setCreditId(row.getString("ID"));
	    creditBean.setCardNumber(row.getString("CARD_NUMBER"));
	    creditBean.setCreditDate(row.getString("CREDIT_DATE"));
	    creditBean.setName(row.getString("NAME"));
	    creditBean.setAmount(row.getString("AMOUNT"));
	    jsonArray.add(creditBean);
	  }
    Gson gson = new Gson();
    String json = gson.toJson(jsonArray);
		return json;
	}
}

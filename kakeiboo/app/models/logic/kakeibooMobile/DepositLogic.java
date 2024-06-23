package models.logic.kakeibooMobile;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import io.ebean.SqlRow;
import models.bean.kakeibooMobile.DepositBean;
import models.dao.kakeibooMobile.DepositDao;
import play.mvc.Controller;


public class DepositLogic {
	/**
   * 貯金額確認ロジック
   */
	public String logic() {
		String amount = "0";
		// データを取得する
		DepositDao depositDao = new DepositDao();
		List<SqlRow> sqlRows = depositDao.getMufjDeposit();
		// 取得結果
	  for(int i = 0; i < sqlRows.size(); i++) {
	  	SqlRow row = sqlRows.get(i);
	  	amount = row.getString("AMOUNT");
  	}
	  amount = NumberFormat.getNumberInstance().format(Integer.parseInt(amount));
	  return amount;
	}

	/**
   * 東日本銀行貯金額一覧データ取得処理
   * @param year
   */
	public String getHigashiDepositList(String year) {
		// 一覧データを取得する
		DepositDao depositDao = new DepositDao();
		List<SqlRow> sqlRows = depositDao.getHigashiDepositList(year);

		// 取得結果
	  List<DepositBean> depositBeanList = new ArrayList<DepositBean>();
	  for(int i = 0; i < sqlRows.size(); i++) {
	  	SqlRow row = sqlRows.get(i);
	    DepositBean depositBean = new DepositBean();
	  	depositBean.setDepositDate(row.getString("DEPOSIT_DATE"));
	  	depositBean.setAmount(row.getString("AMOUNT"));
	  	depositBeanList.add(depositBean);
  	}
		String json = new Gson().toJson(depositBeanList);
	  return json;
	}
}

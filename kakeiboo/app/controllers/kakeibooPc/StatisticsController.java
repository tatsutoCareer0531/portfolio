package controllers.kakeibooPc;

import play.mvc.*;

import java.util.List;
import java.util.Map;

import models.logic.kakeibooPc.StatisticsLogic;
import models.bean.kakeibooPc.CategoryBean;
import models.common.kakeibooPc.ConstList;


public class StatisticsController extends KakeibooPcController {
	/**
	 * 統計データ画面へ遷移
	 */
	public Result statistics() {
	  //セッション判定
	  if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
	  }
		//ロジック処理
	  StatisticsLogic statisticsLogic = new StatisticsLogic();
		List<CategoryBean> categorylist = statisticsLogic.logic();
		//月間・年間統計画面へ遷移
	  return ok(views.html.kakeibooPc.statistics.render(ConstList.STATISTICS, categorylist));
	}
	
	/**
	* 統計データ画面 統計データ取得処理
	*/
	public Result getStatisticsList() {
		Http.RequestBody requestBody = request().body();
		Map<String, String[]> param = requestBody.asFormUrlEncoded();
		String graph = param.get("graph")[0];
		String yearMonth = param.get("yearMonth")[0];
		String category = param.get("category")[0];
	  //ロジック処理
	  StatisticsLogic statisticsLogic = new StatisticsLogic();
	  String json = statisticsLogic.getStatisticsList(graph, yearMonth, category);
		return ok(json);
	}
}

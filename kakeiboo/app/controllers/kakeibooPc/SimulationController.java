package controllers.kakeibooPc;

import play.mvc.*;

import models.common.kakeibooPc.ConstList;


public class SimulationController extends KakeibooPcController {
	/**
	* シミュレーション画面へ遷移
	*/
	public Result simulation() {
    //セッション判定
    if(super.sessionCheck().equals(ConstList.RETURN_CODE_NG)) {
    	// ログイン画面へリダイレクト
      return redirect(ConstList.LOGIN_URL);
    }
		//シミュレーション画面へ遷移
		return ok(views.html.kakeibooPc.simulation.render(ConstList.SIMULATION));
	}
}

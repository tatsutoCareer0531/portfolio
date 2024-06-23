package controllers.main;

import play.mvc.*;


public abstract class HomeController extends Controller {
	/**
   * セッション判定処理
   */
	public abstract String sessionCheck();
}

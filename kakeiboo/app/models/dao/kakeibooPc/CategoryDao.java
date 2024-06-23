package models.dao.kakeibooPc;

import io.ebean.*;
import models.bean.kakeibooPc.EachSettingCategoryBean;
import models.common.kakeibooPc.ConstMethod;
import models.common.kakeibooPc.SQLList;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.PersistenceException;

import com.google.gson.Gson;


public class CategoryDao {
  /**
   * カテゴリーデータ取得
   * @return sqlRows
   */
  public List<SqlRow> getCategory() {
  	List<SqlRow> sqlRows = new ArrayList<SqlRow>();
		try{
	    //SQL
		SqlQuery sqlQuery = Ebean.createSqlQuery(SQLList.CATEGORY_LIST_SQL);
	    sqlRows = sqlQuery.findList();
    }catch(PersistenceException e){
      e.printStackTrace();
      return sqlRows;
    }
    return sqlRows;
  }
  
  /**
   * カテゴリー更新処理
   * @param updateDataArray
   * @return result
   */
  public boolean categoryUpdate(String[] updateDataArray) {
   	boolean result = false;
  	try {
	    Ebean.beginTransaction();
      SqlUpdate sqlUpdate = null;
  		Gson gson = new Gson();

    	// カテゴリーマスタロック
  		sqlUpdate = Ebean.createSqlUpdate(SQLList.CATEGORY_MST_LOCK_SQL);
      sqlUpdate.execute();

      // カテゴリー削除
     	sqlUpdate = Ebean.createSqlUpdate(SQLList.CATEGORY_DELETE_SQL);
      sqlUpdate.execute();
      
      // カテゴリー登録
  	  for(int i = 0; i < updateDataArray.length; i++) {
  	  	EachSettingCategoryBean eachSettingCategoryBean = gson.fromJson(updateDataArray[i], EachSettingCategoryBean.class);
  	  	if (!eachSettingCategoryBean.isDeleteFlg()) {
  	  		String id = null;
  	  		if (!ConstMethod.emptyCheckStr(eachSettingCategoryBean.getId())) {
  	  			id = eachSettingCategoryBean.getId();
  	  		}
  	  		sqlUpdate = Ebean.createSqlUpdate(SQLList.CATEGORY_REGIST_SQL);
          sqlUpdate.setParameter("id", id);
          sqlUpdate.setParameter("ieFlg", eachSettingCategoryBean.getIeFlg());
          sqlUpdate.setParameter("name", eachSettingCategoryBean.getName());
          sqlUpdate.setParameter("sortKey", eachSettingCategoryBean.getSortKey());
          sqlUpdate.execute();
  	  	}
  	  }

  	  // テーブルロック解除
     	sqlUpdate = Ebean.createSqlUpdate(SQLList.TABLE_UNLOCK_SQL);
      sqlUpdate.execute();

	    // コミット
	    Ebean.commitTransaction();
	  } catch(PersistenceException e) {
	  	// ロールバック
	  	Ebean.rollbackTransaction();
	    e.printStackTrace();
	    result = true;
	  } finally {
	    Ebean.endTransaction();
	  }
	  return result;
  }
}

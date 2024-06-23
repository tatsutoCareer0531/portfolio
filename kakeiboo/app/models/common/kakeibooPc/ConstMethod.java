package models.common.kakeibooPc;

import java.text.SimpleDateFormat;
import java.util.Calendar;


public class ConstMethod {
  /**
   * 空チェック(文字列)
   * @param value
   * @return true/false
   */
	public static boolean emptyCheckStr(String value) {
		if(null == value || "".equals(value)) {
	    return true;
	  }
    return false;	
	}
	
  /**
   * 年月日を取得(引数なし)
   * @return dateArray
   */
	public static String[] getDate() {
		Calendar cal = Calendar.getInstance();
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
    String[] dateArray = new String[2];
    
    //月始取得
    cal.set(Calendar.DATE, 1);
    dateArray[0] = sdf.format(cal.getTime());
    //月末取得
    cal.set(Calendar.DATE, cal.getActualMaximum(Calendar.DATE));
    dateArray[1] = sdf.format(cal.getTime());
    
    return dateArray;
	}
	
  /**
   * 年月日を取得
   * @param year
   * @param month
   * @return dateArray
   */
	public static String[] getDate(String year, String month) {		
		Calendar cal = Calendar.getInstance();
    cal.set(Calendar.YEAR, Integer.parseInt(year));
    cal.set(Calendar.MONTH, Integer.parseInt(month)-1);

    SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
    
    String[] dateArray = new String[2];        
    //月始取得
    cal.set(Calendar.DATE, 1);
    dateArray[0] = sdf.format(cal.getTime());
    //月末取得
    cal.set(Calendar.DATE, cal.getActualMaximum(Calendar.DATE));
    dateArray[1] = sdf.format(cal.getTime());
    
    return dateArray;
	}
}

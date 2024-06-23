package models.bean.kakeibooPc;

/**
 * カレンダーBean
 */
public class CalendarBean extends CategoryBean {
	private String calendarId;     // ID
  private String calendarDate;   // カレンダー日付
	private String amount;         // 金額
  private String memo;           //　メモ
  private boolean deleteFlg;     //　削除フラグ

  public String getCalendarId() {
		return calendarId;
	}

  public void setCalendarId(String calendarId) {
		this.calendarId = calendarId;
	}

  public String getCalendarDate() {
		return calendarDate;
	}

  public void setCalendarDate(String calendarDate) {
		this.calendarDate = calendarDate;
	}

  public String getAmount() {
		return amount;
	}

  public void setAmount(String amount) {
		this.amount = amount;
	}

  public String getMemo() {
		return memo;
	}

  public void setMemo(String memo) {
		this.memo = memo;
	}

	public boolean isDeleteFlg() {
		return deleteFlg;
	}

	public void setDeleteFlg(boolean deleteFlg) {
		this.deleteFlg = deleteFlg;
	}
}

$(function(){
  // カレンダー画面へ遷移
  $("#calendar-btn").click(function() {
    pageMove('/kakeibooMobile/calendar');
  });
  // 貯金額確認画面へ遷移
  $("#deposit-btn").click(function() {
    pageMove('/kakeibooMobile/deposit');
  });
  // クレジット利用履歴画面へ遷移
  $("#credit-btn").click(function() {
    pageMove('/kakeibooMobile/credit');
  });
});

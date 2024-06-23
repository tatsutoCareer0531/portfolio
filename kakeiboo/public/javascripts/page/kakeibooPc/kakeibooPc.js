const DESKTOP = 'desktop';
const NOTE_PC = 'note_pc';

// 画面描画時のアクセス端末判定用グローバル変数
let accessDevice = '';

$(function(){
  // 画面描画時にどの端末からアクセスしたか判定
  if(window.screen.availHeight == '912') {
    accessDevice = NOTE_PC;
  } else {
    accessDevice = DESKTOP;
  }

  /*
    サイドバーメニュー ホバー 
  */
  $('#sidebar-menu-page').hover(
    function() {
      //マウスカーソルが重なった時の処理
      $('#pig-hover-off').hide();
      $('#pig-hover-on').show();
    },
    function() {
      //マウスカーソルが離れた時の処理
      $('#pig-hover-on').hide();
      $('#pig-hover-off').show();
    }
  );

  /*
    ページ遷移 ログイン画面
  */
  $('#sidebar-login-page').click(function() {
    //ログイン画面へ
    pageMove('/kakeiboo/login');
  });
  /*
    ページ遷移 メニュー画面
  */
  $('#sidebar-menu-page').click(function() {
    //メニュー画面へ
    pageMove('/kakeiboo/menu');
  });
  /*
    ページ遷移 カレンダー画面
  */
  $('#sidebar-calendar-page').click(function() {
    //カレンダー画面へ
    pageMove('/kakeiboo/calendar');
  });
  /*
    ページ遷移 家計簿画面
  */
  $('#sidebar-kakeibo-page').click(function() {
    //カレンダー画面へ
    pageMove('/kakeiboo/kakeibo');
  });
  /*
    ページ遷移 統計データ画面
  */
  $('#sidebar-statistics-page').click(function() {
    //統計データ画面へ
    pageMove('/kakeiboo/statistics');
  });
  /*
    ページ遷移 貯金額確認画面
  */
  $('#sidebar-deposit-page').click(function() {
    //貯金額確認画面へ
    pageMove('/kakeiboo/deposit');
  });
  /*
    ページ遷移 クレジット利用履歴画面
  */
  $('#sidebar-credit-page').click(function() {
    //クレジット利用履歴画面へ
    pageMove('/kakeiboo/credit');
  });
  /*
    ページ遷移 シミュレーション画面
  */
  $('#sidebar-simulation-page').click(function() {
    //シミュレーション画面へ
    pageMove('/kakeiboo/simulation');
  });
  /*
    ページ遷移 各種設定画面
  */
  $('#sidebar-setting-page').click(function() {
    //各種設定画面へ
    pageMove('/kakeiboo/setting');
  });
});

$(function(){
  /* 初期表示時のアニメーション */
  //フェードイン
	setTimeout(function(){
		$('.start p').fadeIn(1600);
	},500);
  //フェードアウト
	setTimeout(function(){
		$('.start').fadeOut(500);
	},4000);

  // ログイン判定処理
  $('#login-form').submit(function(event) {
    //ログイン判定処理
    loginCheck(event);
  });
});

/*
  ログイン判定処理
*/
async function loginCheck(event) {
  //HTMLでの送信をキャンセル
  event.preventDefault();

  //パラメータ
  let loginVal = {
    id : $('input[name="id"]').val(),
    password : $('input[name="password"]').val()
  };
  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_LOGIN,
    processName : 'ログイン処理',
    url : '/kakeibooMobile/loginCheck',
    data : loginVal,
    dataType : 'text'
  }

  //読み込み中画面開く
  $('#loader').fadeIn();

  //ログイン判定処理(Ajax)
  let result = await ajaxCommonProcess(ajaxDataSet);

  //読み込み中画面閉じる
  $('#loader').fadeOut();

  if(result == RETURN_CODE_NG) {
    //ログインエラー
    $('#error-text').text(MESSAGE_LOGIN_ERROR);
    $('#error-text').addClass('message-error');
  } else {
    //ログインOK メニュー画面へ
    pageMove('/kakeibooMobile/menu');
  }
}

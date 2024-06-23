$(function(){
  //エラーメッセージを非表示
  $('#message-text').text('');
  $('#message-text').removeClass('message-ok');
  $('#message-text').removeClass('message-error');

  /*
    家計簿システムパスワード変更処理
  */
  $('#change-btn').click(function(event) {
    // パスワード変更処理
    passwordChange(event);
  });

  /*
    ページ遷移 各種設定画面
  */
  $('#back-btn').click(function() {
    //各種設定画面へ
    pageMove('/kakeiboo/setting');
  });
});

/*
  パスワード変更処理
*/
async function passwordChange(event) {
  //HTMLでの送信をキャンセル
  event.preventDefault();

  //エラーメッセージを非表示
  $('#message-text').text('');
  $('#message-text').removeClass('message-ok');
  $('#message-text').removeClass('message-error');

  //パラメータ
  let beforePassword = $('#before-password').val();
  let afterPassword = $('#after-password').val();
  let afterCheckPassword = $('#after-password-check').val();
  
  //空チェック
  if(nullEmptyCheck(beforePassword) || nullEmptyCheck(afterPassword) || nullEmptyCheck(afterCheckPassword)) {
    $('#message-text').text(MESSAGE_PASSWORD_CHANGE_ERROR);
    $('#message-text').addClass('message-error');
    return;
  }
  //変更後パスワードチェック
  if(afterPassword != afterCheckPassword) {
    $('#message-text').text(MESSAGE_PASSWORD_CHANGE_DIFFER);
    $('#message-text').addClass('message-error');
    return;
  }

  //読み込み中画面開く
  $('#loader').fadeIn();

  //変更前パスワードチェック
  if(await beforePasswordCheck(beforePassword)) {
    //読み込み中画面閉じる
    $('#loader').fadeOut();

    $('#message-text').text(MESSAGE_PASSWORD_CHANGE_DIFFER);
    $('#message-text').addClass('message-error');
    return;
  }
  
  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_SYSTEM_PASSWORD,
    processName : '家計簿システムパスワード変更処理',
    url : '/systemPasswordChange',
    data : {password: afterPassword},
    dataType : 'text'
  }

  //家計簿システムパスワード変更処理(Ajax)
  let result = await ajaxCommonProcess(ajaxDataSet);

  //読み込み中画面閉じる
  $('#loader').fadeOut();

  if(result == RETURN_CODE_OK) {
    //更新成功
    $('#message-text').text(MESSAGE_PASSWORD_CHANGE_OK);
    $('#message-text').addClass('message-ok');
  } else {
    //更新失敗
    $('#message-text').text(MESSAGE_PASSWORD_CHANGE_ERROR);
    $('#message-text').addClass('message-error');
  }
}

/*
  変更前パスワードチェック
*/
async function beforePasswordCheck(beforePassword) {
  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_SYSTEM_PASSWORD,
    processName : '変更前パスワードチェック処理',
    url : '/systemPasswordBeforeCheck',
    data : {password: beforePassword},
    dataType : 'text'
  }

  //家計簿システムパスワード変更処理(Ajax)
  let result = await ajaxCommonProcess(ajaxDataSet);

  if(result == RETURN_CODE_NG) {
    //チェックNG
    return true;
  }
  //チェックOK
  return false;
}

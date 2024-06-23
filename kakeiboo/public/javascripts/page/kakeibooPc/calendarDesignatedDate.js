// カレンダー 指定日
let designatedDate;

$(function(){
  //画面設定
  if(accessDevice == DESKTOP) {
    // デスクトップの場合
    $('.wrapper-area').css('height', '50%');
    $('.main-area').css('height', '45%');
  } else {
    // ノートPCの場合
    $('.wrapper-area').css('height', '50%');
    $('.main-area').css('height', '50%');
  }

  // 初期処理
  initProcess();

  /*
    カレンダー指定日変更処理
  */
  $('#change-btn').click(function(event) {
    // パスワード変更処理
    designatedDateChange(event);
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
  初期処理
*/
function initProcess() {
  //エラーメッセージを非表示
  $('#message-text').text('');
  $('#message-text').removeClass('message-ok');
  $('#message-text').removeClass('message-error');

  designatedDate = $('#designatedDate-input').val();
  if (!designatedDate) {
    // 「指定日なし」チェックアイコン ONにする
    $('#designatedDate-check-off').hide();
    $('#designatedDate-check-on').show();
    $('input[name="designatedDate-check-input"]')[0].checked = true;
    $('#designatedDate-input').prop('disabled', true);
  }
}

/*
  「指定日なし」チェックアイコン切り替え
*/
function checkIconChange() {
  if($('input[name="designatedDate-check-input"]')[0].checked) {
    // ONにする
    $('#designatedDate-check-off').hide();
    $('#designatedDate-check-on').show();
    $('#designatedDate-input').prop('disabled', true);
  } else {
    // OFFにする
    $('#designatedDate-check-on').hide();
    $('#designatedDate-check-off').show();
    $('#designatedDate-input').prop('disabled', false);
  }
}

/*
  カレンダー指定日変更処理
*/
async function designatedDateChange(event) {
  // HTMLでの送信をキャンセル
  event.preventDefault();

  // エラーメッセージを非表示
  $('#message-text').text('');
  $('#message-text').removeClass('message-ok');
  $('#message-text').removeClass('message-error');

  // パラメータ
  let designatedDate = $('#designatedDate-input').val();
  if($('input[name="designatedDate-check-input"]')[0].checked) {
    designatedDate = '';
  } else {
    // チェック
    if(nullEmptyCheck(designatedDate) || numberCheck(designatedDate)) {
      $('#message-text').text(MESSAGE_UPDATE_ERROR);
      $('#message-text').addClass('message-error');
      return;
    }
  }

  // 読み込み中画面開く
  $('#loader').fadeIn();
  
  // Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_CALENDAR_DESIGNATED_DATE,
    processName : 'カレンダー指定日変更処理',
    url : '/calendarDesignatedDateChange',
    data : {designatedDate: designatedDate},
    dataType : 'text'
  }

  // カレンダー指定日変更処理(Ajax)
  let result = await ajaxCommonProcess(ajaxDataSet);

  // 読み込み中画面閉じる
  $('#loader').fadeOut();

  if(result == RETURN_CODE_OK) {
    // 更新成功
    $('#message-text').text(MESSAGE_UPDATE_OK);
    $('#message-text').addClass('message-ok');
    if($('input[name="designatedDate-check-input"]')[0].checked) {
      $('#designatedDate-input').val('');
    }
  } else {
    // 更新失敗
    $('#message-text').text(MESSAGE_UPDATE_ERROR);
    $('#message-text').addClass('message-error');
  }
}

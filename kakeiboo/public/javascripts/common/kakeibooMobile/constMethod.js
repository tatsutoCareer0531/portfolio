/*
  ページ遷移
*/
function pageMove(path) {
  //読み込み中画面開く
  $('#loader').fadeIn();
  //画面遷移
  window.location.href = path;
  //読み込み中画面閉じる
  $('#loader').fadeOut();
}

/*
  AJax通信 共通
*/
function ajaxCommonProcess(ajaxDataSet) {
  return new Promise((resolve, reject) => {
    /* Ajax通信 */
    console.log("-非同期- " + ajaxDataSet.pageName + "画面 " + ajaxDataSet.processName + "開始します");
    $.ajax({
      type: "POST",
      url: ajaxDataSet.url,
      data: ajaxDataSet.data,
      dataType: ajaxDataSet.dataType
    }).done(function(data) {
      console.log("-非同期- " + ajaxDataSet.pageName + "画面 " + ajaxDataSet.processName + "成功しました");
      if(ajaxDataSet.dataType == 'text') {
        resolve(data);
      } else {
        resolve(JSON.parse(JSON.stringify(data)));
      }
    }).fail(function(data) {
      //通信失敗
      alert("-非同期- " + ajaxDataSet.pageName + "画面 " + ajaxDataSet.processName + "失敗しました");
      reject(RETURN_CODE_NG);
    }).always(function(data) {
      console.log("-非同期- " + ajaxDataSet.pageName + "画面 " + ajaxDataSet.processName + "終了します");
    });
  })
}

/*
  空チェック
*/
function nullEmptyCheck(text) {
  if(text == "" || text == null) {
    return true;
  }
  return false;
}

/*
  数字チェック
*/
function numberCheck(text) {
  return !(/^-?\d+$/.test(text));
}

/*
  文字数チェック
*/
function textLengthCheck(text) {
  if(text.length > 200) {
    return true;
  }
  return false;
}

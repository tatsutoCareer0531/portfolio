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
  カレンダー 開始日と終了日取得
*/
function getDateRange(designatedYear, designatedMonth, designatedDate) {
  designatedYear = Number(designatedYear);
  designatedMonth = Number(designatedMonth);
  designatedDate = Number(designatedDate);

  // 1日から15日までが当月扱い
  // 16日から末日までが来月扱い
  if (CALENDAR_REFERENCE_DATE < designatedDate) {
    // 指定年月を前月にする
    let tempBeforeDate = new Date(designatedYear, designatedMonth-1, 1);
    tempBeforeDate.setMonth(tempBeforeDate.getMonth()-1);
    designatedYear = tempBeforeDate.getFullYear();
    designatedMonth = tempBeforeDate.getMonth()+1;
  }

  // 開始日
  let targetStartDate = new Date(designatedYear, designatedMonth-1, designatedDate);
  // 存在する日付かどうか判定(開始日)
  if (!(targetStartDate.getFullYear() === designatedYear && 
      targetStartDate.getMonth()+1 === designatedMonth && 
      targetStartDate.getDate() === designatedDate)) {
    // 存在しなければ末尾とする
    let tempYear = targetStartDate.getFullYear();
    let tempMonth = targetStartDate.getMonth();
    let dateResult = new Date(tempYear, tempMonth, 0);
    targetStartDate = new Date(dateResult);
  }
  // 基準日が土日祝かどうか判定
  targetStartDate = checkHoliday(targetStartDate);

  // 指定年月を次月にする
  let tempNextDate = new Date(designatedYear, designatedMonth-1, 1);
  tempNextDate.setMonth(tempNextDate.getMonth()+1);
  designatedYear = tempNextDate.getFullYear();
  designatedMonth = tempNextDate.getMonth()+1;

  // 終了日
  let targetEndDate = new Date(designatedYear, designatedMonth-1, designatedDate);
  // 存在する日付かどうか判定(終了日)
  if (!(targetEndDate.getFullYear() === designatedYear && 
      targetEndDate.getMonth()+1 === designatedMonth && 
      targetEndDate.getDate() === designatedDate)) {
    // 存在しなければ末尾とする
    let tempYear = targetEndDate.getFullYear();
    let tempMonth = targetEndDate.getMonth();
    let dateResult = new Date(tempYear, tempMonth, 0);
    targetEndDate = new Date(dateResult);
  }
  // 基準日が土日祝かどうか判定
  targetEndDate = checkHoliday(targetEndDate);
  // 日付を-1日する
  targetEndDate.setDate(targetEndDate.getDate()-1);

  return {
    startDate: targetStartDate,
    endDate: targetEndDate
  }
}

/*
  日にちが土日祝かどうか判定
*/
function checkHoliday(targetDate) {
  while(true) {
    if (!getHolidayFlg(targetDate)) {
      break;
    }
    // 日付を-1日する
    targetDate.setDate(targetDate.getDate()-1);
  }
  return targetDate;
}

/*
  日にちが土日祝かどうかフラグを返す
*/
function getHolidayFlg(targetDate) {
  let result = null;
  // 0...日曜日
  if (targetDate.getDay() === 0) {
    result = 'sunday';
  }
  // 6...土曜日
  if (targetDate.getDay() === 6) {
    result = 'saturday';
  }
  // 祝日判定
  let holidayResults = holiday_jp.between(targetDate, targetDate);
  if (holidayResults.length > 0) {
    result = 'holiday';
  }
  return result;
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
  AJax通信 共通
  フォーマットダウンロード処理
*/
function ajaxCommonProcessFormatDownload(ajaxDataSet) {
  return new Promise((resolve, reject) => {
    /* Ajax通信(フォーマットダウンロード処理) */
    console.log("-非同期- " + ajaxDataSet.pageName + "画面 " + ajaxDataSet.processName + "開始します");
    $.ajax({
      type: 'POST',
      url: ajaxDataSet.url,
      data: {},
      xhrFields: { responseType: 'blob' }
    }).done(function (response, _textStatus, _jqXHR) {
      console.log("-非同期- " + ajaxDataSet.pageName + "画面 " + ajaxDataSet.processName + "成功しました");
      if (window.navigator.msSaveBlob) {
        // IE
        window.navigator.msSaveBlob(response, ajaxDataSet.fileName);
      } else {
        $('<a>', {
          href: URL.createObjectURL(new Blob([response], { type: response.type })),
          download: ajaxDataSet.fileName
        }).appendTo(document.body)[0].click();
      }
      resolve(RETURN_CODE_OK);
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

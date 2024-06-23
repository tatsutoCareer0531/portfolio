// 今日の日付
let today;

// 今日 年
let todayYear;
// 今日 月
let todayMonth;

// 選択 年
let year;
// 選択 月
let month;

// カレンダー 指定日
let designatedDate;

// カレンダー 日付の範囲
let calendarDateRange;

//内訳 年月日
let uchiwake_year = '';
let uchiwake_month = '';
let uchiwake_date = '';

// 内訳 金額入力値一時保存用
let tempInputAmount = '';

// 内訳 メモ入力値一時保存用
let tempInputMemo = '';

// カレンダーtable tdタグ 幅と高さ設定
let tdWidth;
let tdHeight;

// 内訳 金額とメモinputの幅
let amountInputWidth;
let memoInputWidth;

//JSONデータ
let jsonData = [];

$(function(){
  //画面設定
  if(accessDevice == DESKTOP) {
    // デスクトップの場合
    $('.calendar-header-area').css('margin-top', '30px');
    $('.calendar-main-area').css('height', '830px');
    $('.calendar-table-day').css('width', '154px');
    $('.calendar-table-day').css('height', '28px');
    tdWidth = '154px';
    tdHeight = '118px';
    amountInputWidth = '60%';
    memoInputWidth = '82.5%';
    $('.right-calendar-btn-area').css('width', '41.5%');
    $('.left-calendar-btn-area').css('width', '41.5%');
    $('.uchiwake-content').css('height', '85%');
  } else {
    // ノートPCの場合
    $('.calendar-header-area').css('margin-top', '15px');
    $('.calendar-main-area').css('height', '705px');
    $('.calendar-table-day').css('width', '125px');
    $('.calendar-table-day').css('height', '22px');
    tdWidth = '125px';
    tdHeight = '100px';
    amountInputWidth = '80%';
    memoInputWidth = '79%';
    $('.right-calendar-btn-area').css('width', '38.8%');
    $('.left-calendar-btn-area').css('width', '38.8%');
    $('.uchiwake-content').css('height', '92%');
  }

  //初期処理
  initProcess();

  // 新規登録ボタン押下
  $('#regist').click(function() {
    // カレンダー登録画面へ
    pageMove('/kakeiboo/calendar/calendarRegist');
  });

  // 内訳モーダル カレンダー更新処理
  $('#update').click(function() {
    // 更新処理
    calendarUpdate();
  });

  // モーダル閉じる
  $("#close").click(async function() {
    // モーダル閉じる
    modalEvent('close');

    //読み込み中画面開く
    $('#loader').fadeIn();

    //パラメータ
    let startDate = calendarDateRange.startDate.getFullYear() + '-' + 
      ('00' + Number(calendarDateRange.startDate.getMonth()+1)).slice(-2) + '-' + 
      ('00' + calendarDateRange.startDate.getDate()).slice(-2);
    let endDate = calendarDateRange.endDate.getFullYear() + '-' + 
      ('00' + Number(calendarDateRange.endDate.getMonth()+1)).slice(-2) + '-' + 
      ('00' + calendarDateRange.endDate.getDate()).slice(-2);
    let dateObj = {
      startDate : startDate,
      endDate : endDate
    };

    //Ajax 引数
    let ajaxDataSet = {
      pageName : PAGE_NAME_CALENDAR,
      processName : 'カレンダー内訳データ取得処理',
      url : '/calendarList',
      data : dateObj,
      dataType : 'json'
    }

    // カレンダー内訳データ取得(Ajax)
    jsonData = await ajaxCommonProcess(ajaxDataSet);

    // カレンダー日付編集
    calendarDateEdit();

    // 読み込み中画面閉じる
    $('#loader').fadeOut();
  });
});

/*
  初期処理
*/
async function initProcess() {
  // 今日の日付取得
  today = new Date();
  year = today.getFullYear();
  month = today.getMonth()+1;
  today = new Date(year, month-1, today.getDate());

  // 指定日取得
  designatedDate = Number($('#designated-date').val());

  if (designatedDate) {
    // カレンダー 開始日と終了日取得
    calendarDateRange = getDateRange(year, month, designatedDate);
    if (today < calendarDateRange.startDate) {
      month--;
      adjustMonth();
    } else if (calendarDateRange.endDate < today) {
      month++;
      adjustMonth();
    }
    todayYear = year;
    todayMonth = month;
    // カレンダー 開始日と終了日取得
    calendarDateRange = getDateRange(year, month, designatedDate);
  } else {
    let tempDate = new Date(year, month-1, 1);
    // デフォルト(1日)
    let startDate = new Date(tempDate);
    tempDate.setMonth(tempDate.getMonth()+1);
    // デフォルト(末日)
    let endDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), 0);

    calendarDateRange = {
      startDate: startDate,
      endDate: endDate
    }
  }

  $('#calendar-title').text(year + '年 ' + month +  '月分');

  // 読み込み中画面開く
  $('#loader').fadeIn();

  //パラメータ
  let startDate = calendarDateRange.startDate.getFullYear() + '-' + 
    ('00' + Number(calendarDateRange.startDate.getMonth()+1)).slice(-2) + '-' + 
    ('00' + calendarDateRange.startDate.getDate()).slice(-2);
  let endDate = calendarDateRange.endDate.getFullYear() + '-' + 
    ('00' + Number(calendarDateRange.endDate.getMonth()+1)).slice(-2) + '-' + 
    ('00' + calendarDateRange.endDate.getDate()).slice(-2);
  let dateObj = {
    startDate : startDate,
    endDate : endDate
  };

  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_CALENDAR,
    processName : 'カレンダー内訳データ取得処理',
    url : '/calendarList',
    data : dateObj,
    dataType : 'json'
  }

  // カレンダー内訳データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  // カレンダー日付編集
  calendarDateEdit();

  // 読み込み中画面閉じる
  $('#loader').fadeOut();
}

/*
  カレンダー日付編集
*/
function calendarDateEdit() {
  let currentDate = new Date(calendarDateRange.startDate);
  currentDate.setDate(currentDate.getDate()-currentDate.getDay());
  let calendarDateStr = '<tr class="calendar-date">';
  for(let i = 1; i <= 42; i++) {
    let date = currentDate.getFullYear() + '-' + ('00' + Number(currentDate.getMonth()+1)).slice(-2) + '-' + ('00' + currentDate.getDate()).slice(-2);
    // 内訳設定
    let eventFlg = false;
    let calendarUchiwake = '';
    if (calendarDateRange.startDate <= currentDate && currentDate <= calendarDateRange.endDate) {
      // 内訳取得
      calendarUchiwake = calendarUchiwakeEdit(date);
      if (calendarUchiwake) {
        eventFlg = true;
      }
    }

    // クラス名取得
    let dateClassName = getDateClassName(currentDate);

    // 描画
    calendarDateStr = calendarDateStr + 
      `
        <td
          style="width:${tdWidth}; height:${tdHeight};"
          class="calendar-table-date ${dateClassName}"
          onclick="openUchiwakeModal('${date}', ${eventFlg})"
        >
          <p class="calendar-date-number">${currentDate.getDate()}</p>
          ${calendarUchiwake}
        </td>
      `;

    if (i == 42) {
      calendarDateStr = calendarDateStr + '</tr>';
    } else if (i % 7 == 0) {
      calendarDateStr = calendarDateStr + '</tr><tr class="calendar-date">';
    }

    currentDate.setDate(currentDate.getDate()+1);
  }
  $('.calendar-date').remove();
  $('#calendar-table').append(calendarDateStr);
}

/*
  カレンダー クラス名取得
*/
function getDateClassName(currentDate) {
  // クラス名設定
  let dateClassName = '';
  let holidayFlg = getHolidayFlg(currentDate);
  if (calendarDateRange.startDate <= currentDate && currentDate <= calendarDateRange.endDate) {
    // 背景設定
    if (currentDate.getFullYear() === today.getFullYear() && 
        currentDate.getMonth()+1 === today.getMonth()+1 && 
        currentDate.getDate() === today.getDate()) {
      // 今日
      dateClassName = 'calendar-bg-today';
    } else if (holidayFlg === 'sunday' || holidayFlg === 'holiday') {
      // 日曜日 or 祝日
      dateClassName = 'calendar-bg-sunday';
    } else if (holidayFlg === 'saturday') {
      // 土曜日
      dateClassName = 'calendar-bg-saturday';
    } else {
      // 平日
      dateClassName = 'calendar-bg-normal';
    }
    // 文字色設定
    if (holidayFlg === 'sunday' || holidayFlg === 'holiday') {
      // 日曜日 or 祝日
      dateClassName += ' calendar-font-sunday';
    } else if (holidayFlg === 'saturday') {
      // 土曜日
      dateClassName += ' calendar-font-saturday';
    } else {
      // 平日
      dateClassName += ' calendar-font-normal';
    }
  } else {
    // 文字色設定
    if (holidayFlg === 'sunday' || holidayFlg === 'holiday') {
      // 日曜日 or 祝日
      dateClassName += ' calendar-disabled-sunday';
    } else if (holidayFlg === 'saturday') {
      // 土曜日
      dateClassName += ' calendar-disabled-saturday';
    } else {
      // 平日
      dateClassName += ' calendar-disabled-normal';
    }
  }
  return dateClassName;
}

/*
  カレンダー表示用内訳編集
*/
function calendarUchiwakeEdit(targetDate) {
  // JSONで取得してきたものから対象日付のデータのものだけを取得
  let arrayResult = jsonData.filter(el => el.calendarDate === targetDate);

  // 内訳計算
  let spendUchiwakeData = null;
  let incomeUchiwakeData = null;
  for (let json of arrayResult) {
    if (json.ieFlg == '0') {
      // 支出
      spendUchiwakeData += Number(json.amount);
    } else {
      // 収入
      incomeUchiwakeData += Number(json.amount);
    }
  }
  // 描画
  let calendarUchiwake = ''
  if (spendUchiwakeData != null || incomeUchiwakeData != null) {
    calendarUchiwake = '<div class="calendar-uchiwake-block">';
    if (incomeUchiwakeData != null) {
      calendarUchiwake = calendarUchiwake + '<p class="calendar-uchiwake-income">' + incomeUchiwakeData.toLocaleString() + '</p>';
    }
    if (spendUchiwakeData != null) {
      calendarUchiwake = calendarUchiwake + '<p class="calendar-uchiwake-spend">' + spendUchiwakeData.toLocaleString() + '</p>';
    }
    calendarUchiwake = calendarUchiwake + '</div>';
  }
  return calendarUchiwake;
}

/*
  カレンダーヘッダーボタン選択
*/
async function selectCalendarTopBtn(mode) {
  // 指定年月変更
  if (mode == 'yearBack') {
    // ＜＜ 前年
    year--;
  } else if (mode == 'yearNext') {
    // ＞＞ 来年
    year++;
  } else if (mode == 'monthBack') {
    // ＜ 前月
    month--;
    adjustMonth();
  } else if (mode == 'monthNext') {
    // ＞ 来月
    month++;
    adjustMonth();
  } else {
    // 今日
    year = todayYear;
    month = todayMonth;
  }
  $('#calendar-title').text(year + '年 ' + month + '月分');

  //読み込み中画面開く
  $('#loader').fadeIn();

  if (designatedDate) {
    // カレンダー 開始日と終了日取得
    calendarDateRange = getDateRange(year, month, designatedDate);
  } else {
    let tempDate = new Date(year, month-1, 1);
    // デフォルト(1日)
    let startDate = new Date(tempDate);
    tempDate.setMonth(tempDate.getMonth()+1);
    // デフォルト(末日)
    let endDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), 0);

    calendarDateRange = {
      startDate: startDate,
      endDate: endDate
    }
  }

  //パラメータ
  let startDate = calendarDateRange.startDate.getFullYear() + '-' + 
    ('00' + Number(calendarDateRange.startDate.getMonth()+1)).slice(-2) + '-' + 
    ('00' + calendarDateRange.startDate.getDate()).slice(-2);
  let endDate = calendarDateRange.endDate.getFullYear() + '-' + 
    ('00' + Number(calendarDateRange.endDate.getMonth()+1)).slice(-2) + '-' + 
    ('00' + calendarDateRange.endDate.getDate()).slice(-2);
  let dateObj = {
    startDate : startDate,
    endDate : endDate
  };

  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_CALENDAR,
    processName : 'カレンダー内訳データ取得処理',
    url : '/calendarList',
    data : dateObj,
    dataType : 'json'
  }

  // カレンダー内訳データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  // カレンダー日付編集
  calendarDateEdit();

  // 読み込み中画面閉じる
  $('#loader').fadeOut();
}

/*
  月調整
*/
function adjustMonth() {
  if(12 < month) {
    month = 1;
    year++;
  } else if(month < 1) {
    month = 12;
    year--;
  }
}

/*
  内訳モーダルを表示
*/
function openUchiwakeModal(date, eventFlg) {
  // イベント存在チェック
  if (eventFlg) {
    let dateArray = date.split('-');
    uchiwake_year = dateArray[0];
    uchiwake_month = dateArray[1];
    uchiwake_date = dateArray[2];

    //モーダル日付
    $('#date').text(uchiwake_year + '年' + uchiwake_month + '月' + uchiwake_date + '日');

    //モーダル用内訳内容作成
    makeUchiwakeModal();

    //モーダルを開く
    modalEvent('open');
  }
}

/*
  モーダル用内訳内容作成
*/
function makeUchiwakeModal() {
  $('#uchiwake-message').text('');
  $('#uchiwake-message').removeClass('message-ok');
  $('#uchiwake-message').removeClass('message-error');

  //JSONで取得してきたものから対象日付のデータのものだけを取得
  let arrayResult = jsonData.filter(el => el.calendarDate == uchiwake_year + '-' + uchiwake_month + '-' + uchiwake_date);

  // 内訳内容を作成
  let li = '';
  for (let result of arrayResult) {
    let color = UCHIWAKE_BDCOLOR_RED;
    if(result.ieFlg === '1') {
      color = UCHIWAKE_BDCOLOR_BLUE;
    }
    let memo = ''
    if(!nullEmptyCheck(result.memo)) {
      memo = result.memo;
    }

    li += `
      <li id="list-${result.calendarId}" class="uchiwake-li">
        <div style="border: 1.5px solid ${color}" class="uchiwake-list-block">
          <div class="uchiwake-list-name">${result.name}</div>
          <div class="uchiwake-list-amount">
            <input 
              type="text"
              id="amount-input-${result.calendarId}"
              class="amount-input"
              style="width: ${amountInputWidth}"
              value="${Number(result.amount).toLocaleString()}"
              autocomplete="off"
              onfocus="inputAmountFocusOn('amount-input-${result.calendarId}')"
              onblur="inputAmountFocusOut('amount-input-${result.calendarId}')"
            >
            <span>円</span>
          </div>
          <div class="uchiwake-list-memo">
            <span class="memo-span">(メモ：</span>
            <input
              type="text"
              id="memo-input-${result.calendarId}"
              class="memo-input"
              style="width: ${memoInputWidth}"
              value="${memo}"
              autocomplete="off"
              onfocus="inputMemoFocusOn('memo-input-${result.calendarId}')"
              onblur="inputMemoFocusOut('memo-input-${result.calendarId}')"
            >
            <span class="memo-span">)</span>
          </div>
        </div>
        <div class="uchiwake-delete-block">
          <label>
            <input 
              type="checkbox"
              id="delete-check-${result.calendarId}-${result.ieFlg}-${result.id}"
              class="uchiwake-delete-check"
              name="uchiwake-delete-check"
              onchange="deleteIconChange('${result.calendarId}', '${result.ieFlg}', '${result.id}')"
              value=""
            >
            <img id="delete-on-${result.calendarId}-${result.ieFlg}-${result.id}" class="uchiwake-delete-icon uchiwake-delete-check-on" src="/assets/images/kakeibooPc/category_check_on.png">
            <img id="delete-off-${result.calendarId}-${result.ieFlg}-${result.id}" class="uchiwake-delete-icon uchiwake-delete-check-off" src="/assets/images/kakeibooPc/category_check_off.png">
          </label>
        </div>
      </li>
    `;
  }

  $('.uchiwake-li').remove();
  $('.uchiwake-ul').append(li);
}

/*
  内訳モーダル 金額inputフォーカスON
*/
function inputAmountFocusOn(id) {
  // 入力値を一時保存
  let value = $('#' + id).val().replace(/,/g, '');
  tempInputAmount = value;
  $('#' + id).val(value);
}

/*
  内訳モーダル 金額inputフォーカスOUT
*/
function inputAmountFocusOut(id) {
  let value = $('#' + id).val();
  // 入力チェック
  if (nullEmptyCheck(value) || numberCheck(value)) {
    $('#' + id).val(Number(tempInputAmount).toLocaleString());
  } else {
    $('#' + id).val(Number(value).toLocaleString());
  }
}

/*
  内訳モーダル メモinputフォーカスON
*/
function inputMemoFocusOn(id) {
  // 入力値を一時保存
  tempInputMemo = $('#' + id).val();
}

/*
  内訳モーダル メモinputフォーカスOUT
*/
function inputMemoFocusOut(id) {
  let value = $('#' + id).val();
  // 入力チェック
  if (textLengthCheck(value)) {
    $('#' + id).val(tempInputMemo);
  }
}

/*
  内訳モーダル 削除アイコン切り替え
*/
function deleteIconChange(calendarId, ieFlg, categoryId) {
  if ($(`#delete-check-${calendarId}-${ieFlg}-${categoryId}`).prop("checked")) {
    // ONにする
    $(`#delete-off-${calendarId}-${ieFlg}-${categoryId}`).hide();
    $(`#delete-on-${calendarId}-${ieFlg}-${categoryId}`).show();
  } else {
    // OFFにする
    $(`#delete-on-${calendarId}-${ieFlg}-${categoryId}`).hide();
    $(`#delete-off-${calendarId}-${ieFlg}-${categoryId}`).show();
  }
}

/*
  カレンダー更新処理
*/
async function calendarUpdate() {
  $('#uchiwake-message').text('');
  $('#uchiwake-message').removeClass('message-ok');
  $('#uchiwake-message').removeClass('message-error');

  let updateArray = [];
  let elements = $('input[name="uchiwake-delete-check"]');
  for (let i = 0; i < elements.length; i++){
    let idArray = $(elements[i]).attr('id').split('-');
    let calendarId = idArray[2];
    let ieFlg = idArray[3];
    let categoryId = idArray[4];
    let deleteFlg = false;
    if (elements[i].checked) {
      // 削除チェックがついている
      deleteFlg = true;
    }
    let updateObj = {
      calendarId: calendarId,
      calendarDate: uchiwake_year + '-' + uchiwake_month + '-' + uchiwake_date,
      id: categoryId,
      ieFlg: ieFlg,
      amount: $(`#amount-input-${calendarId}`).val().replace(/,/g, ''),
      memo: $(`#memo-input-${calendarId}`).val(),
      deleteFlg: deleteFlg
    };
    updateArray.push(JSON.stringify(updateObj));
  }

  // Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_CALENDAR,
    processName : 'カレンダー更新処理',
    url : '/calendarUpdate',
    data : {updateData: JSON.stringify(updateArray)},
    dataType : 'text'
  }

  // 読み込み中画面開く
  $('#loader').fadeIn();  
  
  // カレンダー更新処理(Ajax)
  let result = await ajaxCommonProcess(ajaxDataSet);

  // 読み込み中画面閉じる
  $('#loader').fadeOut();

  if(result == RETURN_CODE_OK) {
    // モーダル閉じる
    modalEvent('close');

    //読み込み中画面開く
    $('#loader').fadeIn();

    //パラメータ
    let startDate = calendarDateRange.startDate.getFullYear() + '-' + 
      ('00' + Number(calendarDateRange.startDate.getMonth()+1)).slice(-2) + '-' + 
      ('00' + calendarDateRange.startDate.getDate()).slice(-2);
    let endDate = calendarDateRange.endDate.getFullYear() + '-' + 
      ('00' + Number(calendarDateRange.endDate.getMonth()+1)).slice(-2) + '-' + 
      ('00' + calendarDateRange.endDate.getDate()).slice(-2);
    let dateObj = {
      startDate : startDate,
      endDate : endDate
    };

    //Ajax 引数
    let ajaxDataSet = {
      pageName : PAGE_NAME_CALENDAR,
      processName : 'カレンダー内訳データ取得処理',
      url : '/calendarList',
      data : dateObj,
      dataType : 'json'
    }

    // カレンダー内訳データ取得(Ajax)
    jsonData = await ajaxCommonProcess(ajaxDataSet);

    // カレンダー日付編集
    calendarDateEdit();

    // 読み込み中画面閉じる
    $('#loader').fadeOut();
  } else {
    $('#uchiwake-message').text(MESSAGE_UPDATE_ERROR);
    $('#uchiwake-message').addClass('message-error');
  }
}

/*
  内訳モーダル開閉
*/
function modalEvent(mode) {
  if(mode == 'open') {
    //メインの#modalごと呼び出し
    $('#modal').fadeIn();
  } else {
    //メインの#modalごと閉じる
    $('#modal').fadeOut();
  }
}

// 選択日
let selectDate = null;
// 選択日 年
let year = '';
// 選択日 月
let month = '';
// 選択日 日
let date = '';

//JSONデータ
let jsonData = [];
// JSON 月
let jsonMonth = '';
// JSON 年
let jsonYear = '';

// selectタグ 支出/収入フラグ
let ieSelectFlg = '';

$(function() {
  // 初期処理
  initProcess();

  // 今日 押下
  $("#today-btn").click(function() {
    // 初期処理
    initProcess();
  });

  // 日付 次の日へ進む
  $("#date-next-btn").click(function() {
    // カレンダー画面の日付設定
    selectDate.setDate(selectDate.getDate()+1);
    year = selectDate.getFullYear();
    month = selectDate.getMonth()+1;
    date = selectDate.getDate();
    $('#calendar-date').text(year + '年' + ('00' + month).slice(-2) +  '月' + ('00' + date).slice(-2) + '日');

    if (jsonYear != year || jsonMonth != month) {
      // カレンダー一覧データ取得
      getCalendarData();
    } else {
      // カレンダーデータ描画
      drawCalendar();
    }
  });

  // 日付 前の日へ戻る
  $("#date-back-btn").click(function() {
    // カレンダー画面の日付設定
    selectDate.setDate(selectDate.getDate()-1);
    year = selectDate.getFullYear();
    month = selectDate.getMonth()+1;
    date = selectDate.getDate();
    $('#calendar-date').text(year + '年' + ('00' + month).slice(-2) +  '月' + ('00' + date).slice(-2) + '日');

    if (jsonYear != year || jsonMonth != month) {
      // カレンダー一覧データ取得
      getCalendarData();
    } else {
      // カレンダーデータ描画
      drawCalendar();
    }
  });

  // 新規登録ボタン押下
  $("#regist-btn").click(function() {
    // モーダル初期処理
    modalOpenInit('regist', '');
  });

  // 登録ボタン押下
  $("#regist").click(function() {
    calendarRegist('regist');
  });

  // 更新ボタン押下
  $("#update").click(function() {
    calendarRegist('update');
  });

  // 削除ボタン押下
  $("#delete").click(function() {
    calendarRegist('delete');
  });

  // モーダル 閉じるボタン押下
  $("#close").click(function() {
    // 削除済みカテゴリー
    if ($('#delete-category-spend').length) {
      $('#delete-category-spend').remove();
    } else if ($('#delete-category-income').length) {
      $('#delete-category-income').remove();
    }
    modalEvent('close');
  });

  // メニュー画面へ遷移
  $("#back-btn").click(function() {
    pageMove('/kakeibooMobile/menu');
  });
});

/*
  初期処理
*/
function initProcess() {
  // カレンダー画面の日付設定
  selectDate = new Date();
  year = selectDate.getFullYear();
  month = selectDate.getMonth()+1;
  date = selectDate.getDate();
  $('#calendar-date').text(year + '年' + ('00' + month).slice(-2) + '月' + ('00' + date).slice(-2) + '日');
  // カレンダー一覧データ取得
  getCalendarData();
}

/*
  カレンダー一覧データ取得
*/
async function getCalendarData() {
  // JSON 年月設定
  jsonYear = year;
  jsonMonth = month;

  // パラメータ
  let yearMonth = {
    year : jsonYear,
    month : jsonMonth
  };
  // Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_CALENDAR,
    processName : 'カレンダー一覧データ取得処理',
    url : '/kakeibooMobile/calendarList',
    data : yearMonth,
    dataType : 'json'
  }

  // 読み込み中画面開く
  $('#loader').fadeIn();

  // カレンダー一覧データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  // カレンダーデータ描画
  drawCalendar();

  // 読み込み中画面閉じる
  $('#loader').fadeOut();
}

/*
  カレンダーデータ描画
*/
function drawCalendar() {
  // JSONで取得してきたものから対象日付のデータのものだけを取得
  let arrayResult = jsonData.filter(el => el.calendarDate === year + '-' + ('00' + month).slice(-2) + '-' + ('00' + date).slice(-2));
  let calendarList = '';
  for (let calendar of arrayResult) {
    let name = `<span style="color: ${INCOME_BLUE}">(収)</span>${calendar.name}`;
    if (calendar.ieFlg === '0') {
      name = `<span style="color: ${SPEND_RED}">(支)</span>${calendar.name}`;
    }
    let memo = '';
    if (calendar.memo) {
      memo = calendar.memo;
    }
    calendarList += 
      `
        <li class="calendar-li" onclick="modalOpenInit('update', '${calendar.calendarId}')">
          <div class="calendar-name-block">
            <p class="calendar-name">
              ${name}
            </p>
          </div>
          <div class="calendar-amount-block">
            <p class="calendar-amount">${Number(calendar.amount).toLocaleString()}円</p>
          </div>
          <div class="calendar-memo-block">
            <p class="calendar-memo">メモ : ${memo}</p>
          </div>
        </li>
      `;
  }

  $('#calendar-ul').children().remove();
  $('#calendar-ul').append(calendarList);
}

/*
  モーダル初期処理
*/
function modalOpenInit(mode, calendarId) {
  if (mode === 'regist') {
    // 登録モーダル

    // タイトル
    $("#modal-title").text('登録');

    // 支出/収入
    $('#spend').prop('disabled', false);
    $('#income').prop('disabled', false);
    changeSpendIncome('spend');

    // 削除ボタン
    $('#delete').css('color', 'rgba(174, 174, 174, 0.973)');
    $('#delete').css('border', '1px solid rgba(174, 174, 174, 0.973)');
    $('#delete').prop('disabled', true);

    // 登録/更新ボタン
    $("#regist").show();
    $("#update").hide();

    // ボタン活性化
    $("#year").prop('disabled', false);
    $("#month").prop('disabled', false);
    $("#date").prop('disabled', false);
    $("#category-spend").prop('disabled', false);
    $("#category-income").prop('disabled', false);

    // カレンダーID設定(空)
    $('#calendar-id').val('');
  } else {
    // 更新モーダル

    let calendarObj = jsonData.find(function(calendar) {return calendar.calendarId === calendarId});

    // タイトル
    $("#modal-title").text('更新');

    // 支出/収入
    $('#spend').prop('disabled', true);
    $('#income').prop('disabled', true);
    let ieFlgText = '';
    if (calendarObj.ieFlg === '0') {
      ieFlgText = 'spend';
    } else {
      ieFlgText = 'income';
    }
    changeSpendIncome(ieFlgText);

    // 削除ボタン
    $('#delete').css('color', 'rgba(197, 61, 31, 0.973)');
    $('#delete').css('border', '1px solid rgba(197, 61, 31, 0.973)');
    $('#delete').prop('disabled', false);

    // 登録/更新ボタン
    $("#regist").hide();
    $("#update").show();

    // カレンダー内容設定
    // 金額
    $("#amount").val(Number(calendarObj.amount).toLocaleString());
    // カテゴリー
    if (calendarObj.id === '9999') {
      // 削除済みカテゴリー(支出)
      $('#category-spend').append(`<option id="delete-category-spend" value="${calendarObj.ieFlg}-${calendarObj.id}">${calendarObj.name}</option>`);
    } else if (calendarObj.id === '9998') {
      // 削除済みカテゴリー(収入)
      $('#category-income').append(`<option id="delete-category-income" value="${calendarObj.ieFlg}-${calendarObj.id}">${calendarObj.name}</option>`);
    }
    if (calendarObj.ieFlg === '0') {
      $("#category-spend option[value='" + calendarObj.ieFlg + '-' + calendarObj.id + "']").prop('selected', true);
    } else if (calendarObj.ieFlg === '1') {
      $("#category-income option[value='" + calendarObj.ieFlg + '-' + calendarObj.id + "']").prop('selected', true);
    }
    // メモ
    let memoText = '';
    if (calendarObj.memo) {
      memoText = calendarObj.memo;
    }
    $("#memo").val(memoText);

    // ボタン非活性化
    $("#year").prop('disabled', true);
    $("#month").prop('disabled', true);
    $("#date").prop('disabled', true);
    $("#category-spend").prop('disabled', true);
    $("#category-income").prop('disabled', true);

    // カレンダーID設定
    $('#calendar-id').val(calendarObj.calendarId);
  }
  modalEvent('open');
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

/*
  支出/収入の切り替え
*/
function changeSpendIncome(mode) {
  if (mode === 'spend') {
    // 支出
    $('#spend').css('background', 'rgba(31, 136, 197, 0.973)');
    $('#spend').css('color', '#FFF');
    $('#income').css('background', 'rgb(255, 255, 255)');
    $('#income').css('color', 'rgba(31, 136, 197, 0.973)');

    // カテゴリー
    $('#category-spend').show();
    $('#category-income').hide();
    ieSelectFlg = 'spend';
  } else {
    // 収入
    $('#spend').css('background', 'rgb(255, 255, 255)');
    $('#spend').css('color', 'rgba(31, 136, 197, 0.973)');
    $('#income').css('background', 'rgba(31, 136, 197, 0.973)');
    $('#income').css('color', '#FFF');

    // カテゴリー
    $('#category-spend').hide();
    $('#category-income').show();
    ieSelectFlg = 'income';
  }

  // カレンダー内容リセット
  $("#amount").val('');
  $("#category-spend option[value='']").prop('selected', true);
  $("#category-income option[value='']").prop('selected', true);
  $("#memo").val('');
  
  // 日付設定
  // 指定年月の日数取得
  let dateNum = new Date(year, month, 0).getDate();
  let dateOption = '';
  for (let i = 1; i <= dateNum; i++) {
    dateOption += `<option value="${i}">${i}</option>`;
  }
  $('#date').children().remove();
  $('#date').append(dateOption);
  //selected設定
  $("#year option[value='" + year + "']").prop('selected', true);
  $("#month option[value='" + month + "']").prop('selected', true);
  $("#date option[value='" + date + "']").prop('selected', true);

  // メッセージリセット
  $('#regist-update-message').text('');
  $('#regist-update-message').removeClass('message-error');
}

/*
  input(金額) フォーカスON
*/
function amountFocusOn() {
  $('#amount').val($('#amount').val().replace(/,/g, ''));
}

/*
  input(金額) フォーカスOUT
*/
function amountFocusOut() {
  // 入力チェック
  if (nullEmptyCheck($('#amount').val()) || numberCheck($('#amount').val())) {
    $('#amount').val('');
  } else {
    $('#amount').val(Number($('#amount').val()).toLocaleString());
  }
}

/*
  カレンダー登録処理
*/
async function calendarRegist(mode) {
  $('#regist-update-message').text('');
  $('#regist-update-message').removeClass('message-error');

  // カレンダーID
  let calendarId = null;
  if (mode !== 'regist') {
    calendarId = $('#calendar-id').val();   
  }
  // 支出/収入フラグ
  let categorySelect = '';
  if (ieSelectFlg === 'spend') {
    categorySelect = $('#category-spend').val();
  } else {
    categorySelect = $('#category-income').val();
  }
  if (nullEmptyCheck(categorySelect)) {
    if (mode === 'regist') {
      $('#regist-update-message').text(MESSAGE_REGIST_ERROR);
    } else if (mode === 'update') {
      $('#regist-update-message').text(MESSAGE_UPDATE_ERROR);
    } else {
      $('#regist-update-message').text(MESSAGE_DELETE_ERROR);
    }
    $('#regist-update-message').addClass('message-error');
    return;
  }
  let ieFlg = categorySelect.split('-')[0];
  let categoryId = categorySelect.split('-')[1];
  // 金額
  let amount = $('#amount').val().replace(/,/g, '');
  if (nullEmptyCheck(amount) || numberCheck(amount)) {
    if (mode === 'regist') {
      $('#regist-update-message').text(MESSAGE_REGIST_ERROR);
    } else if (mode === 'update') {
      $('#regist-update-message').text(MESSAGE_UPDATE_ERROR);
    } else {
      $('#regist-update-message').text(MESSAGE_DELETE_ERROR);
    }
    $('#regist-update-message').addClass('message-error');
    return;
  }
  // メモ
  let memo = null;
  if (!nullEmptyCheck($('#memo').val())) {
    memo = $('#memo').val();
  }
  // 削除フラグ
  let deleteFlg = false;
  if (mode === 'delete') {
    deleteFlg = true;    
  }

  let calendarArray = [];
  let registObj = {
    calendarId: calendarId,
    calendarDate: $("#year").val() + '-' + ('00'+$("#month").val()).slice(-2) + '-' + ('00'+$("#date").val()).slice(-2),
    id: categoryId,
    ieFlg: ieFlg,
    amount: amount,
    memo: memo,
    deleteFlg: deleteFlg
  };
  calendarArray.push(JSON.stringify(registObj));

  // Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_CALENDAR,
    processName : 'カレンダー登録処理',
    url : '/kakeibooMobile/calendarRegist',
    data : {calendarData: JSON.stringify(calendarArray)},
    dataType : 'text'
  }

  // 読み込み中画面開く
  $('#loader').fadeIn();  
  
  // カレンダー更新処理(Ajax)
  let result = await ajaxCommonProcess(ajaxDataSet);

  if(result == RETURN_CODE_OK) {
    // モーダル閉じる
    modalEvent('close');

    // カレンダー一覧データ取得
    getCalendarData();
  } else {
    if (mode === 'regist') {
      $('#regist-update-message').text(MESSAGE_REGIST_ERROR);
    } else if (mode === 'update') {
      $('#regist-update-message').text(MESSAGE_UPDATE_ERROR);
    } else {
      $('#regist-update-message').text(MESSAGE_DELETE_ERROR);
    }
    $('#regist-update-message').addClass('message-error');

    // 読み込み中画面閉じる
    $('#loader').fadeOut();
  }
}

//タイトルの年月
let title_year = 0;
let title_month = 0;

//選択した年月日
let year = 0;
let month = 0;
let date = 0;

//支出/収入フラグ
let flgMode = '';

// 金額入力値一時保存用
let tempInputAmount = '';

// メモ入力値一時保存用
let tempInputMemo = '';

// まとめて登録 取り込みファイルデータ
let captureFileData;

$(function(){
  //画面設定
  if(accessDevice == DESKTOP) {
    // デスクトップの場合
    $('.sum-up-regist-modal-content').css('height', '24%');
    $('.calendar-modal-content').css('height', '75%');
    $('.category-modal-content').css('height', '65%');
    $('.top-area').css('margin-top', '30px');
    $('.input-area').css('height', '83vh');
    $('.input-value-calendar').css('margin-top', '40px');
    $('.input-value').css('margin-top', '90px');
    $('.regist-btn').css('margin-top', '30px');
  } else {
    // ノートPCの場合
    $('.sum-up-regist-modal-content').css('height', '26%');
    $('.calendar-modal-content').css('height', '72.5%');
    $('.category-modal-content').css('height', '74%');
    $('.top-area').css('margin-top', '20px');
    $('.input-area').css('height', '85.5vh');
    $('.input-value-calendar').css('margin-top', '25px');
    $('.input-value').css('margin-top', '85px');
  }
  
  // 初期処理
  initProcess();

  //モード変更 支出
  $("#spend").click(function() {
    //モード変更
    changeMode('spend');
  });
  //モード変更 収入
  $("#income").click(function() {
    //モード変更
    changeMode('income');
  });

  // 戻るボタン押下
  $("#back").click(function() {
    //カレンダー画面へ
    pageMove('/kakeiboo/calendar');
  });

  // まとめて登録モーダル開く
  $('#sum-up-regist').click(function() {
    $('#sum-up-regist-modal-message-span').text('');
    $('#sum-up-regist-modal-message-span').removeClass('message-ok');
    $('#sum-up-regist-modal-message-span').removeClass('message-error');
  
    $('#sum-up-regist-modal').hide();
    $('#category-modal').hide();
    $('#calendar-modal').hide();
    $('#sum-up-regist-modal').show();
    modalEvent('open');
  });

  // まとめて登録モーダル ファイル読み込み
  $('#sum-up-regist-file').change(function(e) {
    if (e.target.files[0] != null) {
      let file_reader = new FileReader();
      file_reader.readAsText(e.target.files[0]);
      // ファイルの読み込みを行ったら実行
      file_reader.addEventListener('load', function(e) {
        captureFileData = e.target.result;
      });
    }
  });

  // まとめて登録モーダル ファイル取り込み
  $('#file-capture').click(function() {
    calendarDataRegistSumUp();
  });

  // まとめて登録モーダル フォーマットダウンロード
  $('#format-download').click(async function() {
    // Ajax 引数
    let ajaxDataSet = {
      pageName : PAGE_NAME_CALENDAR_REGIST,
      processName : 'フォーマットダウンロード処理',
      url : '/formatDownload',
      fileName: 'calendarData_format.xlsm'
    }
  
    // 読み込み中画面開く
    $('#loader').fadeIn();
  
    // フォーマットダウンロード処理(Ajax)
    let result = await ajaxCommonProcessFormatDownload(ajaxDataSet);
  
    // 読み込み中画面閉じる
    $('#loader').fadeOut();
  });

  // まとめて登録モーダル閉じる
  $('#sum-up-regist-modal-close').click(function() {
    if ($('#sum-up-regist-file').val()) {
      $('#sum-up-regist-file').val(null);
    }
    modalEvent('close');
  });
  
  //カレンダーモーダル開く
  $('#date').click(function() {
    $('#sum-up-regist-modal').hide();
    $('#category-modal').hide();
    $('#calendar-modal').hide();
    $('#calendar-modal').show();
    modalEvent('open');
    //カレンダー
    openCalendar();
    //カレンダーのスタイル設定
    calendarStyleSetting();
  });

  $('body').click(function(e) {
    let className = e.target.className;
    //カレンダートップバーボタン選択
    if(className == 'fc-prev-button fc-button fc-button-primary'     || 
       className == 'fc-next-button fc-button fc-button-primary'     || 
       className == 'fc-prevYear-button fc-button fc-button-primary' || 
       className == 'fc-nextYear-button fc-button fc-button-primary' || 
       className == 'fc-today-button fc-button fc-button-primary') {
      //カレンダートップバーボタン選択
      selectCalendarTopBtn(className);
    }
  });

  //日付空にする
  $('#calendar-empty').click(function() {
    year = 0;
    month = 0;
    date = 0;
    $('#date').val('');
    modalEvent('close');
  });

  //カレンダーモーダル閉じる
  $('#calendar-close').click(function() {
    modalEvent('close');
  });

  //カテゴリーモーダル開く
  $('#category').click(function() {
    $('#sum-up-regist-modal').hide();
    $('#category-modal').hide();
    $('#calendar-modal').hide();
    $('#category-modal').show();

    $('.spend-name').hide();
    $('.income-name').hide();
    if(flgMode == 'spend') {
      $('.spend-name').show();
    } else {
      $('.income-name').show();
    }

    modalEvent('open');
  });

  //カテゴリー選択
  $('.category-input').click(function() {
    $('#category').val($(this).val());
    $('#category-id').val($(this).attr('id'));
    modalEvent('close');
  });

  //カテゴリー空にする
  $('#category-empty').click(function() {
    $('#category').val('');
    $('#category-id').val('');
    modalEvent('close');
  });

  //カテゴリーモーダル閉じる
  $('#category-close').click(function() {
    modalEvent('close');
  });
  
  // カレンダー登録処理
  $('#calendar-data-regist').submit(async function(event) {
    calendarDataRegist(event);
  });
});

/*
  初期処理
*/
function initProcess() {
  //収支設定
  changeMode('spend');
}

/*
  モード色変更
*/
function changeMode(mode) {
  $('#spend').removeClass('btn-style-on');
  $('#income').removeClass('btn-style-on');
  $('#spend').addClass('btn-style-off');
  $('#income').addClass('btn-style-off');

  $('#mode-title').removeClass('mode-title-spend');
  $('#mode-title').removeClass('mode-title-income');

  year = 0;
  month = 0;
  date = 0;

  $('#date').val('');
  $('#amount').val('');
  $('#memo').val('');
  $('#category').val('');
  $('#category-id').val('');

  $('#message-text').text('');
  $('#message-text').removeClass('message-ok');
  $('#message-text').removeClass('message-error');

  //モード適用
  let title = '- 支出 -';
  if (mode === 'income') {
    title = '- 収入 -';
  }
  $('#mode-title').text(title);
  $('#mode-title').addClass('mode-title-' + mode);
  $('#' + mode).removeClass('btn-style-off');
  $('#' + mode).addClass('btn-style-on');
  flgMode = mode;
}

/*
  モーダル開閉
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
  カレンダー表示
*/
function openCalendar() {
  //fullcalendar
  let calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
    // //土日の色を変える
    // businessHours: true,
    //日本語化
    locale: 'ja',
    //「＜＞」のアイコンをOFF(うまく表示されないため)
    buttonIcons: false,
    //ボタンの内容
    buttonText: {
      dayGridMonth:'月',
      dayGridWeek:'週',
      dayGridDay:'日',
      today: '今月',
      prev: '<',
      next: '>',
      prevYear: '<<',
      nextYear: '>>'
    },
    //ボタンの位置
    headerToolbar: {
      left: 'prevYear,prev,next,nextYear',
      right: 'today'
    },
    //内容物
    events: [{}],
    //「日」を空にする
    dayCellContent: function(e) {
      e.dayNumberText = e.dayNumberText.replace('日', '');
    },
    //フォーカス設定(日付)
    navLinks: false,
    //フォーカス設定(イベント)
    editable: false,
    //日付枠内押下時の処理
    dateClick: function(info) {
      let dateArray = info.dateStr.split('-');
      year = dateArray[0];
      month = dateArray[1];
      date = dateArray[2];
      $('#date').val(year + '/' + month +  '/' + date);
      modalEvent('close');
    },
  });
  calendar.render();

  //初期表示日付設定
  let today = new Date();
  title_year = today.getFullYear();
  title_month = today.getMonth()+1;
  $('#calendar-title').text(title_year + '年' + title_month +  '月');
}

/*
  カレンダーのスタイル設定
*/
function calendarStyleSetting() {
  let today = new Date();
  let current_year = today.getFullYear();
  let current_month = today.getMonth()+1;
  let current_date = today.getDate();
  let sundayIndex = 7;
  let saturdayIndex = 13;
  let currentMonthFlg = false;
  $('.fc-scrollgrid-sync-inner').each(function(index, el) {
    if($(el.firstChild).text() == '月'  || 
      $(el.firstChild).text() == '火' || 
      $(el.firstChild).text() == '水' || 
      $(el.firstChild).text() == '木' || 
      $(el.firstChild).text() == '金' || 
      $(el.firstChild).text() == '土' || 
      $(el.firstChild).text() == '日') {
      //ヘッダー設定
      //文字
      if($(el.firstChild).text() == '日') {
        //日曜日
        $(el.firstChild).addClass('calendar-text-sunday');
      } else if($(el.firstChild).text() == '土') {
        //土曜日
        $(el.firstChild).addClass('calendar-text-saturday');
      } else {
        //それ以外
        $(el.firstChild).addClass('calendar-text-normal');
      }
      //背景
      $(el).addClass('calendar-back-header');
      //リンク無効
      $(el.firstChild).addClass('calendar-link-none');
    } else {
      if($(el.firstChild.firstChild).text() == 1) {
        //1日がきたら現在のフラグ値の逆を設定
        //今月内の日付のみに「現在の日付の背景色」を適用するため
        currentMonthFlg = !currentMonthFlg;
      }
      //各日設定
      //現在の日付以外
      if(index == sundayIndex) {
        //日曜日
        if(current_year == title_year && 
          current_month == title_month && 
          current_date == $(el.firstChild.firstChild).text() && currentMonthFlg) {
          //現在の日付
          //背景
          $(el).addClass('calendar-back-today');
        } else {
          //現在の日付以外
          //背景
          $(el).addClass('calendar-back-sunday');
        }
        //文字
        $(el.firstChild.firstChild).addClass('calendar-text-sunday');
        sundayIndex += 7;
      } else if(index == saturdayIndex) {
        //土曜日
        if(current_year == title_year && 
          current_month == title_month && 
          current_date == $(el.firstChild.firstChild).text() && currentMonthFlg) {
          //現在の日付
          //背景
          $(el).addClass('calendar-back-today');
        } else {
          //現在の日付以外
          //背景
          $(el).addClass('calendar-back-saturday');
        }
        //文字
        $(el.firstChild.firstChild).addClass('calendar-text-saturday');
        saturdayIndex += 7;
      } else {
        //それ以外
        if(current_year == title_year && 
          current_month == title_month && 
          current_date == $(el.firstChild.firstChild).text() && currentMonthFlg) {
          //現在の日付
          //背景
          $(el).addClass('calendar-back-today');
        } else {
          //現在の日付以外
          //背景
          $(el).addClass('calendar-back-normal');
        }
        //文字
        $(el.firstChild.firstChild).addClass('calendar-text-normal');
      }
      //リンク無効
      $(el.firstChild.firstChild).addClass('calendar-link-none');
    }
  });
}

/*
  カレンダートップバーボタン選択
*/
function selectCalendarTopBtn(className) {
  if (className == 'fc-prev-button fc-button fc-button-primary'){
    //前月
    title_month--;
    title_month = adjustMonth(title_month);
  } else if(className == 'fc-next-button fc-button fc-button-primary') {
    //来月
    title_month++;
    title_month = adjustMonth(title_month);
  } else if(className == 'fc-prevYear-button fc-button fc-button-primary') {
    //前年
    title_year--;
  } else if(className == 'fc-nextYear-button fc-button fc-button-primary') {
    //来年
    title_year++;
  }else if(className == 'fc-today-button fc-button fc-button-primary'){
    //今日
    let today = new Date();
    title_year = today.getFullYear();
    title_month = today.getMonth()+1;
  }
  $('#calendar-title').text(title_year + '年' + title_month +  '月');

  //カレンダーのスタイル設定
  calendarStyleSetting();
}

/*
  月調整
*/
function adjustMonth(month) {
  if(12 < month) {
    month = 1;
    title_year++;
  } else if(month < 1) {
    month = 12;
    title_year--;
  } 
  return month;
}

/*
  金額inputフォーカスON
*/
function inputAmountFocusOn() {
  // 入力値を一時保存
  let value = $('#amount').val().replace(/,/g, '');
  tempInputAmount = value;
  $('#amount').val(value);
}

/*
  金額inputフォーカスOUT
*/
function inputAmountFocusOut() {
  let value = $('#amount').val();
  // 入力チェック
  if (nullEmptyCheck(value)) {
    $('#amount').val('');
  } else if (numberCheck(value)) {
    if (nullEmptyCheck(tempInputAmount)) {
      $('#amount').val('');
    } else {
      $('#amount').val(Number(tempInputAmount).toLocaleString());
    }
  } else {
    $('#amount').val(Number(value).toLocaleString());
  }
}

/*
  メモinputフォーカスON
*/
function inputMemoFocusOn() {
  // 入力値を一時保存
  tempInputMemo = $('#memo').val();
}

/*
  メモinputフォーカスOUT
*/
function inputMemoFocusOut() {
  let value = $('#memo').val();
  // 入力チェック
  if (textLengthCheck(value)) {
    $('#memo').val(tempInputMemo);
  }
}

/*
  カレンダー登録処理
*/
async function calendarDataRegist(event) {
  // HTMLでの送信をキャンセル
  event.preventDefault();
  
  $('#message-text').text('');
  $('#message-text').removeClass('message-ok');
  $('#message-text').removeClass('message-error');

  // パラメータ
  let flg = '';
  if(flgMode == 'spend') {
    flg = '0';
  } else {
    flg = '1';
  }
  let memo = null;
  if (!nullEmptyCheck($("#memo").val())) {
    memo = $("#memo").val();
  }
  let registVal = {
    calendarDate: $("#date").val(),
    id: $("#category-id").val(),
    ieFlg: flg,
    amount: $('#amount').val().replace(/,/g, ''),
    memo: memo
  };
  
  // 空チェック
  for(let key in registVal) {
    if(key != 'memo') {
      if(nullEmptyCheck(registVal[key])) {
        $('#message-text').text(MESSAGE_REGIST_ERROR);
        $('#message-text').addClass('message-error');
        return;
      }
    }
  }
  // 数字チェック
  if(numberCheck(registVal.amount)) {
    $('#message-text').text(MESSAGE_REGIST_ERROR);
    $('#message-text').addClass('message-error');
    return;
  }
  // 文字数チェック
  if(registVal.memo && textLengthCheck(registVal.memo)) {
    $('#message-text').text(MESSAGE_REGIST_ERROR);
    $('#message-text').addClass('message-error');
    return;
  }

  // Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_CALENDAR_REGIST,
    processName : 'カレンダー登録処理',
    url : '/calendarDataRegist',
    data : {registData: JSON.stringify([JSON.stringify(registVal)])},
    dataType : 'text'
  }

  // 読み込み中画面開く
  $('#loader').fadeIn();

  // カレンダー登録処理(Ajax)
  let result = await ajaxCommonProcess(ajaxDataSet);

  // 読み込み中画面閉じる
  $('#loader').fadeOut();

  if(result == RETURN_CODE_OK) {
    changeMode('spend');
    $('#message-text').text(MESSAGE_REGIST_OK);
    $('#message-text').addClass('message-ok');
  } else {
    $('#message-text').text(MESSAGE_REGIST_ERROR);
    $('#message-text').addClass('message-error');
  }
}

/*
  カレンダーまとめて登録処理
*/
async function calendarDataRegistSumUp() {
  $('#sum-up-regist-modal-message-span').text('');
  $('#sum-up-regist-modal-message-span').removeClass('message-ok');
  $('#sum-up-regist-modal-message-span').removeClass('message-error');

  if (captureFileData) {
    let registJsonData = [];
    let fileContentArray = captureFileData.split(/\r\n|\n/);
    for(let i = 1; i < fileContentArray.length-1; i++){
      let fileTextArray = fileContentArray[i].split(',');

      let memo = null;
      if (!nullEmptyCheck(fileTextArray[5])) {
        memo = fileTextArray[5];
      }
      let registVal = {
        calendarDate: fileTextArray[0],
        id: fileTextArray[2],
        ieFlg: fileTextArray[3],
        amount: fileTextArray[4],
        memo: memo
      };

      // 空チェック
      for(let key in registVal) {
        if(key != 'memo') {
          if(nullEmptyCheck(registVal[key])) {
            $('#sum-up-regist-modal-message-span').text(MESSAGE_REGIST_ERROR);
            $('#sum-up-regist-modal-message-span').addClass('message-error');
            return;
          }
        }
      }
      // 日付チェック
      let dateArr = registVal.calendarDate.split('/');
      if (dateArr.length != 3) {
        $('#sum-up-regist-modal-message-span').text(MESSAGE_REGIST_ERROR);
        $('#sum-up-regist-modal-message-span').addClass('message-error');
        return;
      }
      if (numberCheck(String(Number(dateArr[0]))) || 
          numberCheck(String(Number(dateArr[1]))) || 
          numberCheck(String(Number(dateArr[2])))) {
        $('#sum-up-regist-modal-message-span').text(MESSAGE_REGIST_ERROR);
        $('#sum-up-regist-modal-message-span').addClass('message-error');
        return;
      }
      // 数字チェック
      if(numberCheck(registVal.amount)) {
        $('#sum-up-regist-modal-message-span').text(MESSAGE_REGIST_ERROR);
        $('#sum-up-regist-modal-message-span').addClass('message-error');
        return;
      }
      // 文字数チェック
      if(registVal.memo && textLengthCheck(registVal.memo)) {
        $('#sum-up-regist-modal-message-span').text(MESSAGE_REGIST_ERROR);
        $('#sum-up-regist-modal-message-span').addClass('message-error');
        return;
      }

      registJsonData.push(JSON.stringify(registVal));
    }
  
    // Ajax 引数
    let ajaxDataSet = {
      pageName : PAGE_NAME_CALENDAR_REGIST,
      processName : 'カレンダー登録処理',
      url : '/calendarDataRegist',
      data : {registData: JSON.stringify(registJsonData)},
      dataType : 'text'
    }
  
    // 読み込み中画面開く
    $('#loader').fadeIn();
  
    // カレンダー登録処理(Ajax)
    let result = await ajaxCommonProcess(ajaxDataSet);
  
    // 読み込み中画面閉じる
    $('#loader').fadeOut();
  
    if(result == RETURN_CODE_OK) {
      if ($('#sum-up-regist-file').val()) {
        $('#sum-up-regist-file').val(null);
      }
      $('#sum-up-regist-modal-message-span').text(MESSAGE_REGIST_OK);
      $('#sum-up-regist-modal-message-span').addClass('message-ok');
    } else {
      $('#sum-up-regist-modal-message-span').text(MESSAGE_REGIST_ERROR);
      $('#sum-up-regist-modal-message-span').addClass('message-error');
    }
  }
}

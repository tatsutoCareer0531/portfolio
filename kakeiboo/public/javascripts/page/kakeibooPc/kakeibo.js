// 年
let year = 0;
// 月
let month = 0;

// 現在 年
let currentYear = 0;
// 現在 月
let currentMonth = 0;

// カレンダー 指定日
let designatedDate;

// カレンダー 日付の範囲
let calendarDateRange;

// カテゴリー情報一覧
let categoryList = [];

// 「収入合計」
let kakeiboIncomeSumArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// 「支出合計」
let kakeiboSpendSumArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// 家計簿入力値一時保存用
let tempInputNum = '';

// カテゴリー合計入力値一時保存用
let tempInputSumAmount = '';

// Ajax通信用JSONデータ(家計簿)
let jsonData = [];

// Ajax通信用JSONデータ(項目合計算出)
let categorySumList = [];

$(function(){
  //画面設定
  if(accessDevice == DESKTOP) {
    // デスクトップの場合
    $('.search-btn').css('margin-left', '180px');
    $('.sum-calc-btn').css('margin-right', '20px');
    $('.clear-btn').css('margin-left', '20px');
    $('.kakeibo-frame').css('height', '680px');
    $('.kakeibo-area').css('height', '600px');
    $('.regist-btn').css('margin-top', '10px');
    $('.kakeibo-all-check-block').css('left', '70px');
  } else {
    // ノートPCの場合
    $('.search-btn').css('margin-left', '75px');
    $('.sum-calc-btn').css('margin-left', '20px');
    $('.kakeibo-frame').css('height', '560px');
    $('.kakeibo-area').css('height', '485px');
    $('.kakeibo-all-check-block').css('left', '35px');
  }

  // 初期処理
  initProcess();

  // 検索ボタン押下
  $("#search-btn").click(function() {
    search();
  });

  // 項目合計算出モーダル開く
  $("#sum-calc-btn").click(function() {
    sumCalcModalOpen();
  });

  // 項目合計算出モーダル 検索ボタン押下
  $("#sum-calc-search-btn").click(function() {
    sumCalcModalSearch();
  });

  // 出力ボタン押下
  $("#sam-calc-output-btn").click(function() {
    samCalcOutput();
  });

  // モーダル閉じる
  $("#close-btn").click(function() {
    // モーダル閉じる
    modalEvent('close');
  });
  
  // クリアボタン押下
  $("#clear-btn").click(function() {
    clear();
  });

  // 保存ボタン押下
  $("#regist-btn").click(function() {
    regist();
  });
});

/*
  初期処理
*/
async function initProcess() {
  //今日の日付取得
  let today = new Date();
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

  currentYear = year;
  currentMonth = month;

  // 年タイトル設定
  $('#kakeibo-title').text(year + '年分 家計簿');
  //selected設定
  $("#year option[value='" + year + "']").prop('selected', true);

  //読み込み中画面開く
  $('#loader').fadeIn();

  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_KAKEIBO,
    processName : '家計簿一覧取得処理',
    url : '/kakeiboList',
    data : {year: year},
    dataType : 'json'
  };
  
  // 家計簿一覧取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  // 家計簿編集
  kakeiboEdit();

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
  検索
*/
async function search() {
  // 選択した「年」を設定
  year = Number($("#year").val());
  if (year === currentYear) {
    month = currentMonth;
  } else {
    // 現在年以外で指定して検索をしたらデフォルトで1月に設定する
    month = 1;
  }

  // カレンダー 開始日と終了日取得
  calendarDateRange = getDateRange(year, month, designatedDate);

  $('#kakeibo-title').text(year + '年分 家計簿');

  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_KAKEIBO,
    processName : '家計簿一覧取得処理',
    url : '/kakeiboList',
    data : {year: year},
    dataType : 'json'
  };

  //読み込み中画面開く
  $('#loader').fadeIn();

  // 家計簿一覧データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  // 家計簿編集
  kakeiboEdit();

  //読み込み中画面閉じる
  $('#loader').fadeOut();
}

/*
  家計簿編集
*/
function kakeiboEdit() {
  categoryList = [];
  kakeiboIncomeSumArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  kakeiboSpendSumArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  let elements = $('input[name="month-check"]');
  for (let i = 0; i < elements.length; i++){
    elements[i].checked = false;
  }
  $('.check-on').hide();
  $('.check-off').show();
  let allElements = $('input[name="kakeibo-all-check"]');
  allElements[0].checked = false;
  $('#kakeibo-all-icon-on').hide();
  $('#kakeibo-all-icon-off').show();

  $('#kakeibo-message').text('');
  $('#kakeibo-message').removeClass('message-ok');
  $('#kakeibo-message').removeClass('message-error');

  let tag = '';
  let rowCount = 0;
  let incomeCount = 0;
  let spendCount = 0;
  let categoryId = null;
  let kakeiboArray = [];
  for (let i = 0; i < jsonData.length; i++) {
    if (categoryId !== jsonData[i].id) {
      if (categoryId != null) {
        categoryList.push({ieFlg:kakeiboArray[0].ieFlg, id: kakeiboArray[0].id});
        // 収支一番最初の行の設定
        if (kakeiboArray[0].sortKey === '1') {
          rowCount = Number(kakeiboArray[0].ieCount)+1;
          if (kakeiboArray[0].ieFlg === '1') {
            // 削除済みカテゴリー探索(収入)
            if (jsonData.find(function(obj) {return '9998' === obj.id})) {
              rowCount++;
            }
          } else {
            // 削除済みカテゴリー探索(支出)
            if (jsonData.find(function(obj) {return '9999' === obj.id})) {
              rowCount++;
            }
          }
        }
        // 収支のcount
        let count;
        if (kakeiboArray[0].ieFlg === '1') {
          count = ++incomeCount;
        } else {
          count = ++spendCount;
        }
        // 収支のtr,tdタグ作成
        tag += getTag(kakeiboArray, rowCount, count);
      }
      categoryId = jsonData[i].id;
      kakeiboArray = [];
    }
    kakeiboArray.push(jsonData[i]);

    if (i+1 === jsonData.length) {
      categoryList.push({ieFlg:kakeiboArray[0].ieFlg, id: kakeiboArray[0].id});
      // 収支一番最初の行の設定
      if (kakeiboArray[0].sortKey === '1') {
        rowCount = Number(kakeiboArray[0].ieCount)+1;
        if (kakeiboArray[0].ieFlg === '1') {
          // 削除済みカテゴリー探索(収入)
          if (jsonData.find(function(obj) {return '9998' === obj.id})) {
            rowCount++;
          }
        } else {
          // 削除済みカテゴリー探索(支出)
          if (jsonData.find(function(obj) {return '9999' === obj.id})) {
            rowCount++;
          }
        }
      }
      // 収支のcount
      let count;
      if (kakeiboArray[0].ieFlg === '1') {
        count = ++incomeCount;
      } else {
        count = ++spendCount;
      }
      // 収支のtr,tdタグ作成
      tag += getTag(kakeiboArray, rowCount, count);
      // 残金のtr,tdタグ作成
      tag += getBalanceTag();
    }
  }

  $('#kakeibo-list').remove();
  $('#kakeibo-table').append(`<tbody id="kakeibo-list">${tag}</tbody>`);
}

/*
  タグ作成
*/
function getTag(kakeiboArray, rowCount, count) {
  // tdタグの作成
  let td = '';
  for (let i = 1; i <= 12; i++) {
    let id = year + '_' + i + '_' + kakeiboArray[0].ieFlg + '_' + kakeiboArray[0].id;
    let amount = '';
    if (kakeiboArray[0].ledgerDate != null) {
      let resultObj = kakeiboArray.find(function(obj) {return Number(obj.ledgerDate.split('/')[1]) === i});
      if (resultObj) {
        // 同じ月が存在した場合
        amount = resultObj.amount;
        if (kakeiboArray[0].ieFlg === '1') {
          kakeiboIncomeSumArray[i-1] += Number(amount);
        } else {
          kakeiboSpendSumArray[i-1] += Number(amount);
        }
      } else if (kakeiboArray[0].sortKey !== '9999') {
        // 同じ月が存在しない 且つ ソートキーが9999(削除済み)以外
        amount = '0';
      }
    } else {
      // 家計簿テーブルの対象データに存在しないカテゴリー
      amount = '0';
    }
    
    if (amount === '') {
      td += `
        <td>
          <div class="cell-block">
            <span id="kakeibo_span_${id}">
            </span>
          </div>
        </td>
      `;
    } else {
      td += `
        <td>
          <div class="cell-block">
            <span>
              <input
                type="text"
                class="kakeibo-input"
                id="${id}"
                value="${Number(amount).toLocaleString()}"
                autocomplete="off"
                onfocus="numFocusOn('${id}')"
                onblur="numFocusOut('${id}')"
              > 円
            </span>
          </div>
        </td>
      `;
    }
  }
  
  // trタグの作成
  let ieText;
  let bgColor;
  if (kakeiboArray[0].ieFlg === '1') {
    ieText = '収<br>入';
    bgColor = KAKEIBO_BGCOLOR_INCOME;
  } else {
    ieText = '支<br>出';
    bgColor = KAKEIBO_BGCOLOR_SPEND;
  }
  let tr = '';
  if (kakeiboArray[0].sortKey === '1') {
    // 収支最初の1行目の場合
    tr += `
      <tr>
        <th rowspan="${rowCount}" style="background:${bgColor}" id="th_${kakeiboArray[0].ieFlg}" class="cell-sticky-height">
          <div class="cell-spend-income-block">${ieText}</div>
        </th>
        <th style="background:${bgColor}" class="cell-sticky-height2">
          <div class="cell-block">${kakeiboArray[0].name}</div>
        </th>
        ${td}
      </tr>
    `;
  } else {
    // 2行目以降の場合
    tr += `
      <tr>
        <th style="background:${bgColor}" class="cell-sticky-height2">
          <div class="cell-block">${kakeiboArray[0].name}</div>
        </th>
        ${td}
      </tr>
    `;
  }

  // 合計行作成
  if (rowCount-1 === count) {
    let sumText;
    let sumArray;
    if (kakeiboArray[0].ieFlg === '1') {
      sumText = '収入合計';
      sumArray = kakeiboIncomeSumArray;
    } else {
      sumText = '支出合計';
      sumArray = kakeiboSpendSumArray;
    }
    let sumTd = '';
    for (let i = 1; i <= 12; i++) {
      let id = year + '_' + i + '_' + kakeiboArray[0].ieFlg + '_sum';
      sumTd += `
        <td>
          <div class="cell-block" style="text-align:right;">
            <span id="${id}" style="margin-right:17px; font-weight:bold;">${sumArray[i-1].toLocaleString()}円</span>
          </div>
        </td>
      `;
    }
    tr += `
      <tr id="tr_${kakeiboArray[0].ieFlg}_sum">
        <th style="background:${bgColor}" class="cell-last-block cell-sticky-height2">
          <div class="cell-block">${sumText}</div>
        </th>
        ${sumTd}
      </tr>
    `;
  }

  return tr;
}

/*
  残金のtr,tdタグ作成
*/
function getBalanceTag() {
  let td = '';
  for(let i = 1; i <= 12; i++) {
    let id = year + '_' + i + '_balance';
    td += `
      <td>
        <div class="cell-block" style="text-align:right;">
          <span id="${id}" style="margin-right:17px; font-weight:bold;">${(kakeiboIncomeSumArray[i-1]-kakeiboSpendSumArray[i-1]).toLocaleString()}円</span>
        </div>
      </td>
    `;
  }
  let tr = `
    <tr>
      <th colspan="2" style="background:${KAKEIBO_BGCOLOR_BALANCE}" class="cell-last-block cell-sticky-height">
        <div style="margin-left:20px;" class="cell-block">残金(次月繰越)</div>
      </th>
      ${td}
    </tr>
  `;
  return tr;
}

/*
  「全て選択」チェックアイコン切り替え
*/
function allCheckIconChange() {
  let allElements = $('input[name="kakeibo-all-check"]');
  if(allElements[0].checked) {
    // ONにする
    let elements = $('input[name="month-check"]');
    for (let i = 0; i < elements.length; i++){
      elements[i].checked = true;
    }
    $('.check-off').hide();
    $('.check-on').show();
    $('#kakeibo-all-icon-off').hide();
    $('#kakeibo-all-icon-on').show();
  } else {
    // OFFにする
    let elements = $('input[name="month-check"]');
    for (let i = 0; i < elements.length; i++){
      elements[i].checked = false;
    }
    $('.check-on').hide();
    $('.check-off').show();
    $('#kakeibo-all-icon-on').hide();
    $('#kakeibo-all-icon-off').show();
  }
}

/*
  チェックアイコン切り替え
*/
function checkIconChange(num) {
  let elements = $('input[name="month-check"]');
  if (elements[Number(num)-1].checked) {
    // ONにする
    $('#check-off-' + num).hide();
    $('#check-on-' + num).show();
  } else {
    // OFFにする
    $('#check-on-' + num).hide();
    $('#check-off-' + num).show();
  }

  let allCheckflg = true;
  for (let i = 0; i < elements.length; i++){
    if (!elements[i].checked){
      allCheckflg = false;
    }
  }
  if (allCheckflg) {
    let allElements = $('input[name="kakeibo-all-check"]');
    allElements[0].checked = true;
    $('#kakeibo-all-icon-off').hide();
    $('#kakeibo-all-icon-on').show();
  } else {
    let allElements = $('input[name="kakeibo-all-check"]');
    allElements[0].checked = false;
    $('#kakeibo-all-icon-on').hide();
    $('#kakeibo-all-icon-off').show();
  }
}

/*
  クリア処理
*/
function clear() {
  let confirmFlg = confirm('選択した項目をクリアしますか？');
  if(!confirmFlg) {
    return;
  }
  let elements = $('input[name="month-check"]');
  for (let i = 0; i < elements.length; i++){
    if (elements[i].checked){
      elements[i].checked = false;
      // 入力を0にする
      for (let category of categoryList) {
        let value = '0';
        if (category.id === '9999' || category.id === '9998') {
          value = '';
        }
        $(`#${year + '_' + Number(i+1) + '_' + category.ieFlg + '_' + category.id}`).val(value);
      }
      // 「収入合計」
      kakeiboIncomeSumArray[i] = 0;
      $(`#${year + '_' + Number(i+1) + '_1_sum'}`).text('0円');
      // 「支出合計」
      kakeiboSpendSumArray[i] = 0;
      $(`#${year + '_' + Number(i+1) + '_0_sum'}`).text('0円');
      // 残金
      $(`#${year + '_' + Number(i+1) + '_balance'}`).text('0円');
    }
  }
  $('.check-on').hide();
  $('.check-off').show();
  let allElements = $('input[name="kakeibo-all-check"]');
  allElements[0].checked = false;
  $('#kakeibo-all-icon-on').hide();
  $('#kakeibo-all-icon-off').show();
}

/*
  家計簿inputフォーカスON
*/
function numFocusOn(id) {
  let value = $('#' + id).val().replace(/,/g, '');
  // 入力値を一時保存
  tempInputNum = value;
  $('#' + id).val(value);
}

/*
  家計簿inputフォーカスOUT
*/
function numFocusOut(id) {
  let idArray = id.split('_');
  let value = $('#' + id).val();
  if (idArray[3] === '9999' || idArray[3] === '9998') {
    // 削除済みの場合
    // 入力チェック
    if (value === '') {
      // 空文字
      $('#' + id).val(value);
    } else if (value == null || numberCheck(value)) {
      // null or 文字列
      if (tempInputNum === '') {
        $('#' + id).val(tempInputNum);
      } else {
        $('#' + id).val(Number(tempInputNum).toLocaleString());
      }
    } else {
      // 数字
      $('#' + id).val(Number(value).toLocaleString());
    }
  } else {
    // 普通のカテゴリー場合
    // 入力チェック
    if (nullEmptyCheck(value) || numberCheck(value)) {
      $('#' + id).val(Number(tempInputNum).toLocaleString());
    } else {
      $('#' + id).val(Number(value).toLocaleString());
    }
  }

  // 合計計算
  let beforeNum = 0;
  let afterNum = 0;
  if (tempInputNum !== '') {
    beforeNum = Number(tempInputNum);
  }
  if ($('#' + id).val() !== '') {
    afterNum = Number($('#' + id).val().replace(/,/g, ''));
  }
  let index = Number(idArray[1])-1;
  if (idArray[2] === '1') {
    // 収入
    kakeiboIncomeSumArray[index] = kakeiboIncomeSumArray[index] - beforeNum + afterNum;
    $('#' + idArray[0] + '_' + idArray[1] + '_' + idArray[2] + '_sum').text(kakeiboIncomeSumArray[index].toLocaleString() + '円');
  } else {
    // 支出
    kakeiboSpendSumArray[index] = kakeiboSpendSumArray[index] - beforeNum + afterNum;
    $('#' + idArray[0] + '_' + idArray[1] + '_' + idArray[2] + '_sum').text(kakeiboSpendSumArray[index].toLocaleString() + '円');
  }
  // 残金
  $('#' + idArray[0] + '_' + idArray[1] + '_balance').text((kakeiboIncomeSumArray[index]-kakeiboSpendSumArray[index]).toLocaleString() + '円');
}

/*
  家計簿保存
*/
async function regist() {
  let registJsonData = [];
  for (let category of categoryList) {
    for (let i = 1; i <= 12; i++) {
      let id = year + '_' + i + '_' + category.ieFlg + '_' + category.id;
      if (!nullEmptyCheck($('#' + id).val())) {
        let registJsonObj = {
          ledgerDate: year + '/' + ('00'+i).slice(-2),
          id: category.id,
          ieFlg: category.ieFlg,
          amount: $('#' + id).val().replace(/,/g, '')
        }
        registJsonData.push(JSON.stringify(registJsonObj));
      }
    }
  }

  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_KAKEIBO,
    processName : '家計簿登録処理',
    url : '/kakeiboRegist',
    data : {registData: JSON.stringify(registJsonData)},
    dataType : 'text'
  }

  //読み込み中画面開く
  $('#loader').fadeIn();

  // 家計簿登録処理(Ajax)
  let result = await ajaxCommonProcess(ajaxDataSet);

  if(result == RETURN_CODE_OK) {
    //Ajax 引数
    let ajaxDataSet = {
      pageName : PAGE_NAME_KAKEIBO,
      processName : '家計簿一覧取得処理',
      url : '/kakeiboList',
      data : {year: year},
      dataType : 'json'
    };

    // 家計簿一覧データ取得(Ajax)
    jsonData = await ajaxCommonProcess(ajaxDataSet);

    // 家計簿編集
    kakeiboEdit();

    $('#kakeibo-message').text(MESSAGE_REGIST_OK);
    $('#kakeibo-message').addClass('message-ok');
  } else {
    $('#kakeibo-message').text(MESSAGE_REGIST_ERROR);
    $('#kakeibo-message').addClass('message-error');
  }

  //読み込み中画面閉じる
  $('#loader').fadeOut();
}

/*
  項目合計算出モーダル開く
*/
async function sumCalcModalOpen() {
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
    pageName : PAGE_NAME_KAKEIBO,
    processName : 'カテゴリー合計取得処理',
    url : '/categorySumList',
    data : dateObj,
    dataType : 'json'
  }

  //読み込み中画面開く
  $('#loader').fadeIn();

  // カテゴリー合計取得(Ajax)
  categorySumList = await ajaxCommonProcess(ajaxDataSet);

  //読み込み中画面閉じる
  $('#loader').fadeOut();

  // 「年」設定
  $('#sam-calc-year').text(year + '年');
  // 「月」selected設定
  $(`#sum-calc-month option[value='${month}']`).prop('selected', true);

  let allElements = $('input[name="sam-calc-all-check"]');
  allElements[0].checked = false;
  $('#sam-calc-all-check-on').hide();
  $('#sam-calc-all-check-off').show();

  let li = '';
  for (let categoryObj of categorySumList) {
    let color = UCHIWAKE_BDCOLOR_BLUE;
    if (categoryObj.ieFlg === '0') {
      color = UCHIWAKE_BDCOLOR_RED;
    }

    li += `
      <li class="sam-calc-li">
        <div class="sam-calc-li-select-block">
          <label>
            <input 
              type="checkbox"
              id="sam-calc-check-${categoryObj.ieFlg}-${categoryObj.id}"
              class="sam-calc-check"
              name="sam-calc-check"
              onchange="samCalcCheckIconChange('${categoryObj.ieFlg}', '${categoryObj.id}')"
              value=""
            >
            <img id="sam-calc-check-on-${categoryObj.id}" class="sam-calc-icon sam-calc-check-on" src="/assets/images/kakeibooPc/check_on.png">
            <img id="sam-calc-check-off-${categoryObj.id}" class="sam-calc-icon sam-calc-check-off" src="/assets/images/kakeibooPc/check_off.png">
          </label>
        </div>
        <div style="border: 1px solid ${color}" class="sam-calc-li-category-block">
          <div class="sam-calc-category-name">${categoryObj.name}</div>
          <div class="sam-calc-category-input">
            <input 
              type="text"
              id="sam-calc-input-${categoryObj.id}"
              class="sam-calc-input"
              value="${Number(categoryObj.sumAmount).toLocaleString()}"
              autocomplete="off"
              onfocus="sumAmountFocusOn('sam-calc-input-${categoryObj.id}')"
              onblur="sumAmountFocusOut('sam-calc-input-${categoryObj.id}')"
            >
            <span>円</span>
          </div>
        </div>
      </li>
    `;
  }
  $('.sam-calc-li').remove();
  $('.sam-calc-ul').append(li);

  // モーダル開く
  modalEvent('open');
}

/*
  項目合計算出モーダル 検索
*/
async function sumCalcModalSearch() {
  month = Number($("#sum-calc-month").val());
  // カレンダー 開始日と終了日取得
  calendarDateRange = getDateRange(year, month, designatedDate);

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
    pageName : PAGE_NAME_KAKEIBO,
    processName : 'カテゴリー合計取得処理',
    url : '/categorySumList',
    data : dateObj,
    dataType : 'json'
  }

  //読み込み中画面開く
  $('#loader').fadeIn();

  // カテゴリー合計取得(Ajax)
  categorySumList = await ajaxCommonProcess(ajaxDataSet);

  //読み込み中画面閉じる
  $('#loader').fadeOut();

  // チェックしたものをリセット
  let elements = $('input[name="sam-calc-check"]');
  for (let i = 0; i < elements.length; i++){
    elements[i].checked = false;
  }
  $('.sam-calc-check-on').hide();
  $('.sam-calc-check-off').show();
  let allElements = $('input[name="sam-calc-all-check"]');
  allElements[0].checked = false;
  $('#sam-calc-all-check-on').hide();
  $('#sam-calc-all-check-off').show();

  let li = '';
  for (let categoryObj of categorySumList) {
    let color = UCHIWAKE_BDCOLOR_BLUE;
    if (categoryObj.ieFlg === '0') {
      color = UCHIWAKE_BDCOLOR_RED;
    }

    li += `
      <li class="sam-calc-li">
        <div class="sam-calc-li-select-block">
          <label>
            <input
              type="checkbox"
              id="sam-calc-check-${categoryObj.ieFlg}-${categoryObj.id}"
              class="sam-calc-check"
              name="sam-calc-check"
              onchange="samCalcCheckIconChange('${categoryObj.ieFlg}', '${categoryObj.id}')"
              value=""
            >
            <img id="sam-calc-check-on-${categoryObj.id}" class="sam-calc-icon sam-calc-check-on" src="/assets/images/kakeibooPc/check_on.png">
            <img id="sam-calc-check-off-${categoryObj.id}" class="sam-calc-icon sam-calc-check-off" src="/assets/images/kakeibooPc/check_off.png">
          </label>
        </div>
        <div style="border: 1px solid ${color}" class="sam-calc-li-category-block">
          <div class="sam-calc-category-name">${categoryObj.name}</div>
          <div class="sam-calc-category-input">
            <input 
              type="text"
              id="sam-calc-input-${categoryObj.id}"
              class="sam-calc-input"
              value="${Number(categoryObj.sumAmount).toLocaleString()}"
              autocomplete="off"
              onfocus="sumAmountFocusOn('sam-calc-input-${categoryObj.id}')"
              onblur="sumAmountFocusOut('sam-calc-input-${categoryObj.id}')"
            >
            <span>円</span>
          </div>
        </div>
      </li>
    `;
  }
  $('.sam-calc-li').remove();
  $('.sam-calc-ul').append(li);
}

/*
  カテゴリー合計inputフォーカスON
*/
function sumAmountFocusOn(id) {
  // 入力値を一時保存
  let value = $('#' + id).val().replace(/,/g, '');
  tempInputSumAmount = value;
  $('#' + id).val(value);
}

/*
  カテゴリー合計inputフォーカスOUT
*/
function sumAmountFocusOut(id) {
  let idArray = id.split('-');
  let value = $('#' + id).val();
  if (idArray[3] === '9999' || idArray[3] === '9998') {
    // 削除済みの場合
    // 入力チェック
    if (value === '') {
      // 空文字
      $('#' + id).val(value);
    } else if (value == null || numberCheck(value)) {
      // null or 文字列
      if (tempInputSumAmount === '') {
        $('#' + id).val(tempInputSumAmount);
      } else {
        $('#' + id).val(Number(tempInputSumAmount).toLocaleString());
      }
    } else {
      // 数字
      $('#' + id).val(Number(value).toLocaleString());
    }
  } else {
    // 普通のカテゴリー場合
    // 入力チェック
    if (nullEmptyCheck(value) || numberCheck(value)) {
      $('#' + id).val(Number(tempInputSumAmount).toLocaleString());
    } else {
      $('#' + id).val(Number(value).toLocaleString());
    }
  }
}

/*
  項目合計算出モーダル「全て選択」チェックアイコン切り替え
*/
function samCalcAllCheckIconChange() {
  let allElements = $('input[name="sam-calc-all-check"]');
  if(allElements[0].checked) {
    // ONにする
    let elements = $('input[name="sam-calc-check"]');
    for (let i = 0; i < elements.length; i++){
      elements[i].checked = true;
    }
    $('.sam-calc-check-off').hide();
    $('.sam-calc-check-on').show();
    $('#sam-calc-all-check-off').hide();
    $('#sam-calc-all-check-on').show();
  } else {
    // OFFにする
    let elements = $('input[name="sam-calc-check"]');
    for (let i = 0; i < elements.length; i++){
      elements[i].checked = false;
    }
    $('.sam-calc-check-on').hide();
    $('.sam-calc-check-off').show();
    $('#sam-calc-all-check-on').hide();
    $('#sam-calc-all-check-off').show();
  }
}

/*
  項目合計算出モーダルチェックアイコン切り替え
*/
function samCalcCheckIconChange(ieFlg, id) {
  if ($('#sam-calc-check-' + ieFlg + '-' + id).prop("checked")) {
    // ONにする
    $('#sam-calc-check-off-' + id).hide();
    $('#sam-calc-check-on-' + id).show();
  } else {
    // OFFにする
    $('#sam-calc-check-on-' + id).hide();
    $('#sam-calc-check-off-' + id).show();
  }

  let elements = $('input[name="sam-calc-check"]');
  let allCheckflg = true;
  for (let i = 0; i < elements.length; i++){
    if (!elements[i].checked){
      allCheckflg = false;
    }
  }
  if (allCheckflg) {
    let allElements = $('input[name="sam-calc-all-check"]');
    allElements[0].checked = true;
    $('#sam-calc-all-check-off').hide();
    $('#sam-calc-all-check-on').show();
  } else {
    let allElements = $('input[name="sam-calc-all-check"]');
    allElements[0].checked = false;
    $('#sam-calc-all-check-on').hide();
    $('#sam-calc-all-check-off').show();
  }
}

/*
  項目合計出力処理
*/
function samCalcOutput() {
  // 出力処理
  let elements = $('input[name="sam-calc-check"]');
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].checked) {
      elements[i].checked = false;

      let idArray = $(elements[i]).attr('id').split('-');
      let id = year + '_' + month + '_' + idArray[3] + '_' + idArray[4];
      let beforeNum = 0;
      let afterNum = 0;
      if (categoryList.find(function(category) {return category.id === idArray[4]})) {
        // tr行が存在する場合
        if ($('#' + id).val() == null) {
          // inputが存在しない場合
          if ($('#sam-calc-input-' + idArray[4]).val() !== '') {
            afterNum = Number($('#sam-calc-input-' + idArray[4]).val().replace(/,/g, ''));
          }
          $('#kakeibo_span_' + id).append(`
            <input
              type="text"
              class="kakeibo-input"
              id="${id}"
              value="${$('#sam-calc-input-' + idArray[4]).val()}"
              autocomplete="off"
              onfocus="numFocusOn('${id}')"
              onblur="numFocusOut('${id}')"
            > 円
          `);
        } else {
          // inputが存在する場合
          if ($('#' + id).val() !== '') {
            beforeNum = Number($('#' + id).val().replace(/,/g, ''));
          }
          if ($('#sam-calc-input-' + idArray[4]).val() !== '') {
            afterNum = Number($('#sam-calc-input-' + idArray[4]).val().replace(/,/g, ''));
          }
          $('#' + id).val($('#sam-calc-input-' + idArray[4]).val());
        }
      } else {
        // tr行が存在しない場合
        // ※項目合計算出を開く前にカテゴリーを一個追加していたら、家計簿のカテゴリーにはないので一致しない...のパターン(追加)
        // ※削除済みのtr行が存在しないパターン(追加)
        if ($('#sam-calc-input-' + idArray[4]).val() !== '') {
          afterNum = Number($('#sam-calc-input-' + idArray[4]).val().replace(/,/g, ''));
        }
        // tr行追加処理
        addTrTag(idArray, $('#sam-calc-input-' + idArray[4]).val());
        categoryList.push({ieFlg: idArray[3], id: idArray[4]});
      }

      // 合計と残金
      let index = Number(month)-1;
      if (idArray[3] === '1') {
        // 収入
        kakeiboIncomeSumArray[index] = kakeiboIncomeSumArray[index] - beforeNum + afterNum;
        $('#' + year + '_' + month + '_' + idArray[3] + '_sum').text(kakeiboIncomeSumArray[index].toLocaleString() + '円');
      } else {
        // 支出
        kakeiboSpendSumArray[index] = kakeiboSpendSumArray[index] - beforeNum + afterNum;
        $('#' + year + '_' + month + '_' + idArray[3] + '_sum').text(kakeiboSpendSumArray[index].toLocaleString() + '円');
      }
      // 残金
      $('#' + year + '_' + month + '_balance').text((kakeiboIncomeSumArray[index]-kakeiboSpendSumArray[index]).toLocaleString() + '円');
    }
  }
  // モーダル閉じる
  modalEvent('close');
}

/*
  tr行追加処理
*/
function addTrTag(idArray, value) {
  // tdタグの作成
  let td = '';
  for(let i = 1; i <= 12; i++) {
    let id = year + '_' + i + '_' + idArray[3] + '_' + idArray[4];
    if (idArray[4] === '9998' || idArray[4] === '9999') {
      // 削除済みの場合
      if (i === Number(month)) {
        td += `
          <td>
            <div class="cell-block">
              <span>
                <input
                  type="text"
                  class="kakeibo-input"
                  id="${id}"
                  value="${value}"
                  autocomplete="off"
                  onfocus="numFocusOn('${id}')"
                  onblur="numFocusOut('${id}')"
                > 円
              </span>
            </div>
          </td>
        `;
      } else {
        td += `
          <td>
            <div class="cell-block">
              <span id="kakeibo_span_${id}">
              </span>
            </div>
          </td>
        `;
      }
    } else {
      // 普通のカテゴリーの場合
      let amount = '0';
      if (i === Number(month)) {
        amount = value;
      }
      td += `
        <td>
          <div class="cell-block">
            <span>
              <input
                type="text"
                class="kakeibo-input"
                id="${id}"
                value="${amount}"
                autocomplete="off"
                onfocus="numFocusOn('${id}')"
                onblur="numFocusOut('${id}')"
              > 円
            </span>
          </div>
        </td>
      `;
    }
  }

  // trタグの作成
  let rowspanNum = Number($("#th_" + idArray[3]).attr("rowspan"));
  $("#th_" + idArray[3]).attr("rowspan", ++rowspanNum);
  let bgColor;
  if (idArray[3] === '1') {
    // 収入
    bgColor = KAKEIBO_BGCOLOR_INCOME;
  } else {
    // 支出
    bgColor = KAKEIBO_BGCOLOR_SPEND;
  }
  let obj = categorySumList.find(function(category) {return category.id === idArray[4]});
  let tr = `
    <tr>
      <th style="background:${bgColor}" class="cell-sticky-height2">
        <div class="cell-block">${obj.name}</div>
      </th>
      ${td}
    </tr>
  `;
  $(`#tr_${idArray[3]}_sum`).before(tr);
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

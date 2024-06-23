// 年
let year = 0;

// 月
let month = 0;

// 通常(1)/固定費(2)
let mode = '';

// Ajax通信用JSONデータ
let jsonData = {};

$(function(){
  //画面設定
  if(accessDevice == DESKTOP) {
    // デスクトップの場合
    $('.search-btn').css('margin-left', '50px');
    $('.wrapper-area').css('height', '850px');
  } else {
    // ノートPCの場合
    $('.search-btn').css('margin-left', '20px');
    $('.wrapper-area').css('height', '780px');
  }

  //初期処理
  initProcess();

  // 通常ボタン押下
  $('#normal-cost-btn').click(function() {
    // 通常/固定費切り替え
    modeChange('1');
    // クレジット一覧描画
    drawCreditList();
  });

  // 固定費ボタン押下
  $('#fixed-cost-btn').click(function() {
    // 通常/固定費切り替え
    modeChange('2');
    // クレジット一覧描画
    drawCreditList();
  });
  
  // 検索ボタン押下
  $("#search-btn").click(function() {
    search();
  });
});

/*
  初期処理
*/
async function initProcess() {
  //今日の日付取得
  let now = new Date();
  year = now.getFullYear();
  month = now.getMonth()+1;

  //selected設定
  $("#year option[value='" + year + "']").prop('selected', true);
  $("#month option[value='" + month + "']").prop('selected', true);

  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_CREDIT,
    processName : 'クレジット一覧取得処理',
    url : '/creditList',
    data : {yearMonth: year + '/' + ('00'+month).slice(-2)},
    dataType : 'json'
  }

  //読み込み中画面開く
  $('#loader').fadeIn();  

  // 通常/固定費切り替え
  modeChange('1');

  //貯金額内訳データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  // クレジット一覧描画
  drawCreditList();

  //読み込み中画面閉じる
  $('#loader').fadeOut();
}

/*
  検索処理
*/
async function search() {
  year = $("#year").val();
  month = $("#month").val();

  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_CREDIT,
    processName : 'クレジット一覧取得処理',
    url : '/creditList',
    data : {yearMonth: year + '/' + ('00'+month).slice(-2)},
    dataType : 'json'
  }

  //読み込み中画面開く
  $('#loader').fadeIn();

  // 通常/固定費切り替え
  modeChange('1');

  //貯金額内訳データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  // クレジット一覧描画
  drawCreditList();

  //読み込み中画面閉じる
  $('#loader').fadeOut();
}

/*
  クレジット一覧描画
*/
function drawCreditList() {
  let creditList = '';
  let sumAmount = 0;
  for(let credit of jsonData) {
    if (credit.cardNumber === mode) {
      creditList +=  
      `
        <li class="credit-li">
          <div class="credit-name-block">
            <p class="credit-name">
            ${credit.name}
            </p>
          </div>
          <div class="credit-date-block">
            <p class="credit-date">${credit.creditDate}</p>
          </div>
          <div class="credit-amount-block">
            <p class="credit-amount">${Number(credit.amount).toLocaleString()}円</p>
          </div>
        </li>
      `;
      sumAmount += Number(credit.amount);
    }
  }

  // 合計金額設定
  $('#sum-amount').text(sumAmount.toLocaleString() + '円');

  $('#credit-ul').children().remove();
  $('#credit-ul').append(creditList);
}

/*
  通常/固定費切り替え
*/
function modeChange(selectMode) {
  $('#normal-cost-btn').removeClass('btn-style-on');
  $('#fixed-cost-btn').removeClass('btn-style-on');
  $('#normal-cost-btn').addClass('btn-style-off');
  $('#fixed-cost-btn').addClass('btn-style-off');
  if(selectMode == '1') {
    $('#normal-cost-btn').removeClass('btn-style-off');
    $('#normal-cost-btn').addClass('btn-style-on');
  } else {
    $('#fixed-cost-btn').removeClass('btn-style-off');
    $('#fixed-cost-btn').addClass('btn-style-on');
  }
  mode = selectMode;
}

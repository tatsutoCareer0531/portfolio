// タイトル 年月
let year = 0;
let month = 0;

// 通常(1)/固定費(2)
let mode = '';

// JSONデータ
let jsonData = [];

$(function() {
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

  // 「年」選択時
  $("#year").change(function() { 
    search();
  });

  // 「月」選択時
  $("#month").change(function() { 
    search();
  });

  // メニュー画面へ遷移
  $("#back-btn").click(function() {
    pageMove('/kakeibooMobile/menu');
  });
});

/*
  初期処理
*/
async function initProcess() {
  // クレジット利用履歴画面の日付設定
  let today = new Date();
  year = today.getFullYear();
  month = today.getMonth()+1;
  $('#credit-title').text(year + '年' + month + '月');

  //selected設定
  $("#year option[value='" + year + "']").prop('selected', true);
  $("#month option[value='" + month + "']").prop('selected', true);

  // Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_CREDIT,
    processName : 'クレジット一覧データ取得処理',
    url : '/kakeibooMobile/creditList',
    data : {yearMonth : year + '/' + ('00'+month).slice(-2)},
    dataType : 'json'
  }

  // 読み込み中画面開く
  $('#loader').fadeIn();

  // 通常/固定費切り替え
  modeChange('1');

  // クレジット一覧データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  // クレジット一覧描画
  drawCreditList();

  // 読み込み中画面閉じる
  $('#loader').fadeOut();
}

/*
  検索
*/
async function search() {
  // クレジット利用履歴画面の日付設定
  year = $("#year").val();
  month = $("#month").val();
  $('#credit-title').text(year + '年' + month + '月');

  // Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_CREDIT,
    processName : 'クレジット一覧データ取得処理',
    url : '/kakeibooMobile/creditList',
    data : {yearMonth : year + '/' + ('00'+month).slice(-2)},
    dataType : 'json'
  }  

  // 読み込み中画面開く
  $('#loader').fadeIn();

  // 通常/固定費切り替え
  modeChange('1');

  // クレジット一覧データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  // クレジット一覧描画
  drawCreditList();

  // 読み込み中画面閉じる
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
  $('#sum-amount').text(sumAmount.toLocaleString());

  $('#credit-ul').children().remove();
  $('#credit-ul').append(creditList);
}

/*
  通常/固定費切り替え
*/
function modeChange(selectMode) {
  if(selectMode == '1') {
    // 通常費
    $('#normal-cost-btn').css('background', 'rgba(31, 136, 197, 0.973)');
    $('#normal-cost-btn').css('color', '#FFF');
    $('#fixed-cost-btn').css('background', 'rgb(255, 255, 255)');
    $('#fixed-cost-btn').css('color', 'rgba(31, 136, 197, 0.973)');
  } else {
    // 固定費
    $('#normal-cost-btn').css('background', 'rgb(255, 255, 255)');
    $('#normal-cost-btn').css('color', 'rgba(31, 136, 197, 0.973)');
    $('#fixed-cost-btn').css('background', 'rgba(31, 136, 197, 0.973)');
    $('#fixed-cost-btn').css('color', '#FFF');
  }
  mode = selectMode;
}

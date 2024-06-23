// グラフ
const SIMULATION_BAR_GRAPH_BGCOLOR = 'rgb(245, 206, 186)';
const SIMULATION_BAR_GRAPH_BDCOLOR = 'rgb(241, 129, 72)';

//「nヵ月後」
const SIMULATION_LABELS_MONTH = [
  "1ヵ月後", 
  "2ヵ月後", 
  "3ヵ月後", 
  "4ヵ月後", 
  "5ヵ月後", 
  "6ヵ月後", 
  "7ヵ月後", 
  "8ヵ月後", 
  "9ヵ月後", 
  "10ヵ月後", 
  "11ヵ月後", 
  "12ヵ月後", 
];

//「n年後」
const SIMULATION_LABELS_YEAR = [
  "1年後", 
  "2年後", 
  "3年後", 
  "4年後", 
  "5年後", 
  "6年後", 
  "7年後", 
  "8年後", 
  "9年後", 
  "10年後", 
];

// 差額
let differenceAmount = '';

// 支出ID番号
let spendNum = 1;

// 収入ID番号
let incomeNum = 1;

// 金額入力値一時保存用
let tempInputAmount = '';

// 貯金額入力値一時保存用
let tempInputDeposit = '';

// 1か月単位/1年単位
let btnMode = '';

// グラフデータ
let graphData = {
  //横の日付
  labels: [],
  datasets: [
    {
      //ラベル名
      label: '棒グラフ',
      //グラフデータ
      data: [],
      //グラフの色
      backgroundColor: SIMULATION_BAR_GRAPH_BGCOLOR,
      //グラフの線の色
      borderColor: SIMULATION_BAR_GRAPH_BDCOLOR,
      //グラフの線の太さ
      borderWidth: 1
    },
  ]
};

let simulationGraph = null;

$(function(){
  //画面設定
  if(accessDevice == DESKTOP) {
    // デスクトップの場合
    $('.modal-content').css('height', '80%');
    $('#graph').attr('width' , 300);
    $('#graph').attr('height', 133);
    $('.modal-btn-area').css('margin-top', '18px');
    $('.difference-top').css('margin-left', '25px');
    $('.difference-amount-text').css('width', '312px');
    $('.wrapper-area').css('height', '850px');
    $('.main-area').css('height', '77%');
  } else {
    // ノートPCの場合
    $('.modal-content').css('height', '80%');
    $('#graph').attr('width' , 300);
    $('#graph').attr('height', 155);
    $('.modal-btn-area').css('margin-top', '13px');
    $('.difference-top').css('margin-left', '20px');
    $('.difference-amount-text').css('width', '310px');
    $('.wrapper-area').css('height', '770px');
    $('.main-area').css('height', '74%');
  }

  // 一時的に設定
  $('#regist-btn').prop('disabled', true);
  $('#delete-btn').prop('disabled', true);
  $('#regist-btn').css('background-color', 'rgb(186, 186, 186)');
  $('#delete-btn').css('background-color', 'rgb(186, 186, 186)');
  $('#delete-btn').css('color', '#FFF');
  $('#delete-btn').css('border', '1px solid rgb(186, 186, 186)');

  // 追加ボタン(収入)押下
  $('#income-add-btn').click(function() {
    addCategory('income');
  });

  // 追加ボタン(支出)押下
  $('#spend-add-btn').click(function() {
    addCategory('spend');
  });

  // シミュレーションボタン押下
  $('#simulation-btn').click(function() {
    $('#deposit').val('');
    changeMode('month');
    drawGraph();
    modalEvent('open');
  });

  // 設定ボタン押下
  $('#setting-btn').click(function() {
    // グラフ描画
    drawGraph();
  });

  // 1ヵ月単位ボタン押下
  $('#month-btn').click(function() {
    // モード変更 1ヵ月単位/1年単位
    changeMode('month');
    // グラフ描画
    drawGraph();
  });

  // 1年単位ボタン押下
  $('#year-btn').click(function() {
    // モード変更 1ヵ月単位/1年単位
    changeMode('year');
    // グラフ描画
    drawGraph();
  });

  // シミュレーションモーダル 閉じるボタン押下
  $('#close').click(function() {
    modalEvent('close');
  });
});

/*
  カテゴリー行追加
*/
function addCategory(spendIncome) {
  if (spendIncome === 'spend') {
    spendNum++;
    let categoryText = `
      <li id="category-li-spend-${spendNum}" class="category-li category-li-spend">
        <div class="category-li-left">
          <input id="category-spend-${spendNum}" class="category" placeholder="カテゴリー" value="">
          <span class="category-span">:</span>
        </div>
        <div class="category-li-right">
          <input
            id="amount-spend-${spendNum}"
            class="amount"
            placeholder="金額"
            value=""
            onfocus="amountFocusOn('amount-spend-${spendNum}')"
            onblur="amountFocusOut('amount-spend-${spendNum}')"
          >
          <span class="amount-span">円</span>
        </div>
        <div class="category-li-delete">
          <img
            id="spend-delete-${spendNum}"
            class="delete-icon"
            src="/assets/images/kakeibooPc/delete.png"
            onclick="categoryDelete('category-li-spend-${spendNum}')"
          >
        </div>
      </li>
    `;
    $('#category-li-spend').before(categoryText);
  } else {
    incomeNum++;
    let categoryText = `
      <li id="category-li-income-${incomeNum}" class="category-li category-li-income">
        <div class="category-li-left">
          <input id="category-income-${incomeNum}" class="category" placeholder="カテゴリー" value="">
          <span class="category-span">:</span>
        </div>
        <div class="category-li-right">
          <input
            id="amount-income-${incomeNum}"
            class="amount"
            placeholder="金額"
            value=""
            onfocus="amountFocusOn('amount-income-${incomeNum}')"
            onblur="amountFocusOut('amount-income-${incomeNum}')"
          >
          <span class="amount-span">円</span>
        </div>
        <div class="category-li-delete">
          <img
            id="spend-delete-${incomeNum}"
            class="delete-icon"
            src="/assets/images/kakeibooPc/delete.png"
            onclick="categoryDelete('category-li-income-${incomeNum}')"
          >
        </div>
      </li>
    `;
    $('#category-li-income').before(categoryText);
  }
}

/*
  金額inputフォーカスON
*/
function amountFocusOn(id) {
  // 入力値を一時保存
  let value = $('#' + id).val().replace(/,/g, '');
  tempInputAmount = value;
  $('#' + id).val(value);
}

/*
  金額inputフォーカスOUT
*/
function amountFocusOut(id) {
  let value = $('#' + id).val();
  // 空チェック
  if(nullEmptyCheck(value)) {
    $('#' + id).val('');
  } else {
    // 数字チェック
    if (numberCheck(value)) {
      if (tempInputAmount) {
        $('#' + id).val(Number(tempInputAmount).toLocaleString());
      } else {
        $('#' + id).val('');
      }
    } else {
      $('#' + id).val(Number(value).toLocaleString());
    }
  }
  // 合計と差額計算
  sumDifference();
}

/*
  カテゴリー欄 削除
*/
function categoryDelete(id) {
  $('#' + id).remove();
  // 合計と差額計算
  sumDifference();
}

/*
  合計と差額計算
*/
function sumDifference() {
  // 収入合計
  let sumIncome = '';
  $(".category-li-income").each(function(index, el) {
    let amount = $(el).children().children()[2].value;
    if (amount !== '') {
      if (!sumIncome) {
        sumIncome = 0;
      }
      sumIncome += Number(amount.replace(/,/g, ''));
    }
  });
  if (sumIncome !== '') {
    $('#income-sum-amount').text(sumIncome.toLocaleString());
  } else {
    $('#income-sum-amount').text('');
  }

  // 支出合計
  let sumSpend = '';
  $(".category-li-spend").each(function(index, el) {
    let amount = $(el).children().children()[2].value;
    if (amount !== '') {
      if (!sumSpend) {
        sumSpend = 0;
      }
      sumSpend += Number(amount.replace(/,/g, ''));
    }
  });
  if (sumSpend !== '') {
    $('#spend-sum-amount').text(sumSpend.toLocaleString());
  } else {
    $('#spend-sum-amount').text('');
  }

  // 差額
  if (sumIncome === '' && sumSpend === '') {
    differenceAmount = '';
    $('.difference-amount').text('');
  } else {
    differenceAmount = Number(sumIncome)-Number(sumSpend);
    $('.difference-amount').text(differenceAmount.toLocaleString());
  }
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
  モード変更 1ヵ月単位/1年単位
*/
function changeMode(mode) {
  btnMode = mode;
  // ボタン設定
  $('#month-btn').removeClass('btn-style-on');
  $('#year-btn').removeClass('btn-style-on');
  $('#month-btn').addClass('btn-style-off');
  $('#year-btn').addClass('btn-style-off');

  if (btnMode === 'month') {
    $('#month-btn').removeClass('btn-style-off');
    $('#month-btn').addClass('btn-style-on');
  } else {
    $('#year-btn').removeClass('btn-style-off');
    $('#year-btn').addClass('btn-style-on');
  }
}

/*
  グラフ描画
*/
function drawGraph() {
  //再描画の際は一度前のグラフを破棄
  if(simulationGraph != null) {
    simulationGraph.destroy();
  }

  let amountData = [];
  let amount = Number($('#deposit').val().replace(/,/g, ''));
  if (btnMode === 'month') {
    for (let i = 1; i <= 12; i++) {
      amount += differenceAmount;
      amountData.push(amount);
    }
    graphData.labels = SIMULATION_LABELS_MONTH;
  } else {
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 12; j++) {
        amount += differenceAmount;
      }
      amountData.push(amount);
    }
    graphData.labels = SIMULATION_LABELS_YEAR;
  }

  graphData.datasets[0].data = amountData;
  simulationGraph = new Chart(document.getElementById('graph'), {
    type: 'bar',
    data: graphData,
    options: {}
  });
}

/*
  貯金額inputフォーカスON
*/
function depositFocusOn() {
  // 入力値を一時保存
  let value = $('#deposit').val().replace(/,/g, '');
  tempInputDeposit = value;
  $('#deposit').val(value);
}

/*
  貯金額inputフォーカスOUT
*/
function depositFocusOut() {
  let value = $('#deposit').val();
  // 空チェック
  if(nullEmptyCheck(value)) {
    $('#deposit').val('');
  } else {
    // 数字チェック
    if (numberCheck(value)) {
      if (tempInputDeposit) {
        $('#deposit').val(Number(tempInputDeposit).toLocaleString());
      } else {
        $('#deposit').val('');
      }
    } else {
      $('#deposit').val(Number(value).toLocaleString());
    }
  }
}

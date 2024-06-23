// 収入/支出フラグ
let spendIncomeFlg = '';
// 円グラフ/棒グラフフラグ
let circleBarFlg = '';
// 月間/年間フラグ
let yearMonthFlg = '';

// 円グラフ/棒グラフフラグ(一時保存用)
let tempCircleBarFlg = '';
// 月間/年間フラグ(一時保存用)
let tempYearMonthFlg = '';

// 年
let year = 0;
// 月
let month = 0;

// カテゴリー
let category;

//円グラフデータ(支出)
let circleSpendData = {
  //各割合名
  labels: [],
  datasets: [{
    //各割合の背景色
    backgroundColor: [],
    //円グラフデータ
    data: []
  }]
};
//円グラフデータ(収入)
let circleIncomeData = {
  //各割合名
  labels: [],
  datasets: [{
    //各割合の背景色
    backgroundColor: [],
    //円グラフデータ
    data: []
  }]
};
//棒グラフデータ(支出)
let barSpendData = {
  //横の日付
  labels: [],
  datasets: [{
    //ラベル名
    label: '',
    //棒グラフデータ
    data: [],
    //グラフの色
    backgroundColor: '',
    //グラフの線の色
    borderColor: '',
    //グラフの線の太さ
    borderWidth: 1
  }]
};
//棒グラフデータ(収入)
let barIncomeData = {
  //横の日付
  labels: [],
  datasets: [{
    //ラベル名
    label: '',
    //棒グラフデータ
    data: [],
    //グラフの色
    backgroundColor: '',
    //グラフの線の色
    borderColor: '',
    //グラフの線の太さ
    borderWidth: 1
  }]
};

// グラフ
let circleSpendGraph = null;
let circleIncomeGraph = null;
let barSpendGraph = null;
let barIncomeGraph = null;

//Ajax通信用JSONデータ
let jsonData = {};

$(function(){
  //画面設定
  if(accessDevice == DESKTOP) {
    // デスクトップの場合
    $('.search-menu-content').css('height', '50%');
    $('.search-menu-footer-area').css('padding-top', '25px');
    $('.graph-area').css('width', '90%');
    $('.graph-area').css('height', '750px');
    $('#circle-graph-block').css('width', '45%');
    $('#circle-graph-block').css('height', 'auto');
    $('#bar-spend-graph').attr('width' , 320);
    $('#bar-spend-graph').attr('height', 155);
    $('#bar-income-graph').attr('width' , 320);
    $('#bar-income-graph').attr('height', 155);
  } else {
    // ノートPCの場合
    $('.search-menu-content').css('height', '53%');
    $('.search-menu-footer-area').css('padding-top', '18px');
    $('.graph-area').css('width', '90%');
    $('.graph-area').css('height', '620px');
    $('#circle-graph-block').css('width', '48%');
    $('#circle-graph-block').css('height', 'auto');
    $('#bar-spend-graph').attr('width' , 310);
    $('#bar-spend-graph').attr('height', 165);
    $('#bar-income-graph').attr('width' , 310);
    $('#bar-income-graph').attr('height', 165);
  }

  //初期処理
  initProcess();

  // モード変更 支出
  $("#spend-btn").click(function() {
    spendIncomeFlg = 'spend';
    changeSpendIncome();
  });
  // モード変更 収入
  $("#income-btn").click(function() {
    spendIncomeFlg = 'income';
    changeSpendIncome();
  });

  // 検索メニューボタン押下
  $("#search-menu-btn").click(function() {
    // 円グラフ/棒グラフフラグ(一時保存用)
    tempCircleBarFlg = circleBarFlg;
    // 円グラフ/棒グラフボタン設定
    changeCircleBar();

    // 月間/年間フラグ(一時保存用)
    tempYearMonthFlg = yearMonthFlg;
    // 月間/年間ボタン設定
    changeMonthYear();

    // 年月selected設定
    $("#year-select option[value='" + year + "']").prop('selected', true);
    $("#month-select option[value='" + month + "']").prop('selected', true);

    // カテゴリーselected設定
    $("#category-select option[value='" + category + "']").prop('selected', true);

    // モーダルを開く
    modalEvent('open');
  });

  // モード変更 円グラフ
  $("#circle-btn").click(function() {
    tempCircleBarFlg = 'circle';
    changeCircleBar();
  });
  // モード変更 棒グラフ
  $("#bar-btn").click(function() {
    tempCircleBarFlg = 'bar';
    changeCircleBar();
  });

  // モード変更 月間
  $("#month-btn").click(function() {
    tempYearMonthFlg = 'month';
    changeMonthYear();
  });
  // モード変更 年間
  $("#year-btn").click(function() {
    tempYearMonthFlg = 'year';
    changeMonthYear();
  });

  // 検索ボタン押下
  $("#search").click(function() {
    search();
  });

  // モーダル 閉じるボタン押下
  $("#close").click(function() {
    // モーダル閉じる
    modalEvent('close');
  });
});

/*
  初期処理
*/
async function initProcess() {
  // フラグ設定(支出/収入)
  spendIncomeFlg = 'spend';
  // フラグ設定(円グラフ/棒グラフ)
  circleBarFlg = 'circle';
  // フラグ設定(月間/年間フラグ)
  yearMonthFlg = 'month';

  // 年月設定
  let now = new Date();
  year = now.getFullYear();
  month = now.getMonth()+1;
  $("#graph-date-title").text(year + "年 " + month + "月");

  // カテゴリー設定
  category = '';

  // パラメータ
  let yearMonth = year + '/' + ('00' + month).slice(-2);
  let params = {
    graph: circleBarFlg,
    yearMonth: yearMonth,
    category: category
  }
  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_STATISTICS,
    processName : '統計データ取得処理',
    url : '/statisticsList',
    data : params,
    dataType : 'json'
  }
  //読み込み中画面開く
  $('#loader').fadeIn();
  
  //月間・年間統計内訳データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  //読み込み中画面閉じる
  $('#loader').fadeOut();

  // グラフデータ設定
  graphDataSetting();

  // グラフ描画
  drawGraph();

  // グラフ表示変更 円グラフ/棒グラフ
  changeGraph();

  // モード変更 支出/収入
  changeSpendIncome();
}

/*
  グラフデータ設定
*/
function graphDataSetting() {
  if (circleBarFlg === 'circle') {
    let spendNameList = [];
    let spendRatioList = [];
    let incomeNameList = [];
    let incomeRatioList = [];

    for (let graphData of jsonData.spendGraphData) {
      spendNameList.push(graphData.name);
      spendRatioList.push(graphData.ratio);
    }
    for (let graphData of jsonData.incomeGraphData) {
      incomeNameList.push(graphData.name);
      incomeRatioList.push(graphData.ratio);
    }

    // 円グラフデータ 支出
    circleSpendData = {
      labels: spendNameList, // カテゴリー名
      datasets: [{
        backgroundColor: CIRCLE_GRAPH_BGCOLOR_SPEND,
        data: spendRatioList // 金額
      }]
    };
    // 円グラフデータ 収入
    circleIncomeData = {
      labels: incomeNameList, // カテゴリー名
      datasets: [{
        backgroundColor: CIRCLE_GRAPH_BGCOLOR_INCOME,
        data: incomeRatioList // 金額
      }]
    };
  } else {
    let barLabels = [];
    let spendAmountList = [];
    let incomeAmountList = [];
    for(let i = 0; i < 12; i++) {
      let resultSpend = jsonData.spendGraphData.find(el => el.graphDate === year + '/' + ('00' + Number(i+1)).slice(-2));
      if (resultSpend) {
        spendAmountList.push(resultSpend.amount);
      } else {
        spendAmountList.push(null);
      }
      let resultIncome = jsonData.incomeGraphData.find(el => el.graphDate === year + '/' + ('00' + Number(i+1)).slice(-2));
      if (resultIncome) {
        incomeAmountList.push(resultIncome.amount);
      } else {
        incomeAmountList.push(null);
      }
      barLabels.push((i+1) + '月');
    }

    // 棒グラフデータ 支出
    barSpendData = {
      labels: barLabels,
      datasets: [{
        label: '支出',
        data: spendAmountList,
        backgroundColor: BAR_GRAPH_BGCOLOR_RED,
        borderColor: BAR_GRAPH_BDCOLOR_RED,
        borderWidth: 1
      }]
    };
    // 棒グラフデータ 収入
    barIncomeData = {
      labels: barLabels,
      datasets: [{
        label: '収入',
        data: incomeAmountList,
        backgroundColor: BAR_GRAPH_BGCOLOR_BLUE,
        borderColor: BAR_GRAPH_BDCOLOR_BLUE,
        borderWidth: 1
      }]
    };
  }
}

/*
  グラフ描画
*/
function drawGraph() {
  //再描画の際は一度前のグラフを破棄
  if(circleSpendGraph != null) {
    circleSpendGraph.destroy();
  }
  if(circleIncomeGraph != null) {
    circleIncomeGraph.destroy();
  }
  if(barSpendGraph != null) {
    barSpendGraph.destroy();
  }
  if(barIncomeGraph != null) {
    barIncomeGraph.destroy();
  }

  if (circleBarFlg === 'circle') {
    // 円グラフ
    // 円グラフ(支出)
    circleSpendGraph = new Chart(document.getElementById("circle-spend-graph"), {
      type: 'doughnut',
      data: circleSpendData,
      options: {}
    });
    // 円グラフ(収入)
    circleIncomeGraph = new Chart(document.getElementById("circle-income-graph"), {
      type: 'doughnut',
      data: circleIncomeData,
      options: {}
    });
  } else {
    // 棒グラフ
    // 棒グラフ(支出)
    barSpendGraph = new Chart(document.getElementById('bar-spend-graph'), {
      type: 'bar',
      data: barSpendData,
      options: {}
    });
    // 棒グラフ(収入)
    barIncomeGraph = new Chart(document.getElementById('bar-income-graph'), {
      type: 'bar',
      data: barIncomeData,
      options: {}
    });
  }
}

/*
  グラフ表示変更 円グラフ/棒グラフ
*/
function changeGraph() {
  // グラフ設定(円グラフ/棒グラフ)
  $('#circle-graph-block').hide();
  $('#bar-graph-block').hide();
  if (circleBarFlg === 'circle') {
    $('#circle-graph-block').show();
  } else {
    $('#bar-graph-block').show();
  }
}

/*
  モード変更 支出/収入
*/
function changeSpendIncome() {
  // ボタン設定
  $('#spend-btn').removeClass('btn-style-on');
  $('#income-btn').removeClass('btn-style-on');
  $('#spend-btn').addClass('btn-style-off');
  $('#income-btn').addClass('btn-style-off');
  $('#' + spendIncomeFlg + '-btn').removeClass('btn-style-off');
  $('#' + spendIncomeFlg + '-btn').addClass('btn-style-on');

  // グラフ設定(支出/収入)
  $('#circle-spend-graph').hide();
  $('#circle-income-graph').hide();
  $('#bar-spend-graph').hide();
  $('#bar-income-graph').hide();
  if (spendIncomeFlg === 'spend') {
    if (circleBarFlg === 'circle') {
      $('#circle-spend-graph').show();
    } else {
      $('#bar-spend-graph').show();
    }
  } else {
    if (circleBarFlg === 'circle') {
      $('#circle-income-graph').show();
    } else {
      $('#bar-income-graph').show();
    }
  }
}

/*
  モード変更 円グラフ/棒グラフ
*/
function changeCircleBar() {
  $('#circle-btn').removeClass('btn-style-on');
  $('#bar-btn').removeClass('btn-style-on');
  $('#circle-btn').addClass('btn-style-off');
  $('#bar-btn').addClass('btn-style-off');
  $('#' + tempCircleBarFlg + '-btn').removeClass('btn-style-off');
  $('#' + tempCircleBarFlg + '-btn').addClass('btn-style-on');

  if (tempCircleBarFlg === 'circle') {
    // 円グラフ
    // 月間、年間ボタンを活性化する
    $("#year-btn").prop('disabled', false);
    $("#month-btn").prop('disabled', false);
    // カテゴリーを非活性化する
    $("#category-select").prop('disabled', true);

    // 月間モードにする
    tempYearMonthFlg = 'month';
    changeMonthYear();
  } else {
    // 棒グラフ
    // 月間、年間ボタンを非活性化する
    $("#year-btn").prop('disabled', true);
    $("#month-btn").prop('disabled', true);
    // カテゴリーを活性化する
    $("#category-select").prop('disabled', false);

    // 年間モードにする
    tempYearMonthFlg = 'year';
    changeMonthYear();
  }
}

/*
  モード変更 月間/年間
*/
function changeMonthYear() {
  $('#month-btn').removeClass('btn-style-on');
  $('#year-btn').removeClass('btn-style-on');
  $('#month-btn').addClass('btn-style-off');
  $('#year-btn').addClass('btn-style-off');
  $('#' + tempYearMonthFlg + '-btn').removeClass('btn-style-off');
  $('#' + tempYearMonthFlg + '-btn').addClass('btn-style-on');

  if (tempYearMonthFlg === 'month') {
    // 月間モードにする
    $("#month-select").prop('disabled', false);
  } else {
    // 年間モードにする
    $("#month-select").prop('disabled', true);
  }
}

/*
  検索処理
*/
async function search() {
  // フラグ設定(支出/収入)
  spendIncomeFlg = 'spend';
  $("#spend-btn").prop('disabled', false);
  $("#income-btn").prop('disabled', false);
  // フラグ設定(円グラフ/棒グラフ)
  circleBarFlg = tempCircleBarFlg;
  // フラグ設定(月間/年間フラグ)
  yearMonthFlg = tempYearMonthFlg;

  // 年月設定
  let yearMonth;
  if ($("#month-select").prop('disabled')) {
    // 年
    year = $("#year-select").val();
    yearMonth = year;
    $("#graph-date-title").text(year + "年");
  } else {
    // 年月
    year = $("#year-select").val();
    month = $("#month-select").val();
    yearMonth = year + '/' + ('00' + month).slice(-2);
    $("#graph-date-title").text(year + "年 " + month + "月");
  }

  // カテゴリー設定
  let categorySelect = '';
  if (!$("#category-select").prop('disabled')) {
    category = $("#category-select").val();
    if (category.split('-').length >= 2) {
      categorySelect = category.split('-')[1];
      if (category.split('-')[0] === '0') {
        spendIncomeFlg = 'spend'
      } else {
        spendIncomeFlg = 'income';
      }
      $("#spend-btn").prop('disabled', true);
      $("#income-btn").prop('disabled', true);
    }
  }

  // パラメータ
  let params = {
    graph: circleBarFlg,
    yearMonth: yearMonth,
    category: categorySelect
  }
  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_STATISTICS,
    processName : '統計データ取得処理',
    url : '/statisticsList',
    data : params,
    dataType : 'json'
  }
  //読み込み中画面開く
  $('#loader').fadeIn();
  
  //月間・年間統計内訳データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  //読み込み中画面閉じる
  $('#loader').fadeOut();

  // グラフデータ設定
  graphDataSetting();

  //グラフ描画
  drawGraph();
  
  // グラフ表示変更 円グラフ/棒グラフ
  changeGraph();

  // モード変更 支出/収入
  changeSpendIncome();

  // モーダル閉じる
  modalEvent('close');
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

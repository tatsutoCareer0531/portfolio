// 年
let year = 0;

// 月
let month = 0;

// Ajax通信用JSONデータ
let jsonData = {};

// 東日本銀行貯金額データ
let higashiDepositData = '0';

// グラフデータ
let graphData = {
  //横の日付
  labels: LABELS,
  datasets: [
    {
      //ラベル名
      label: '折れ線グラフ',
      //タイプ
      type: "line",
      //...?
      fill: false,
      //グラフデータ
      data: [],
      //グラフの線の色
      borderColor: LINE_GRAPH_COLOR_ORANGE,
    },
    {
      //ラベル名
      label: '棒グラフ',
      //グラフデータ
      data: [],
      //グラフの色
      backgroundColor: BAR_GRAPH_BGCOLOR_ORANGE,
      //グラフの線の色
      borderColor: BAR_GRAPH_BDCOLOR_ORANGE,
      //グラフの線の太さ
      borderWidth: 1
    },
  ]
};

let depositGraph = null;

$(function(){
  //画面設定
  if(accessDevice == DESKTOP) {
    // デスクトップの場合
    $('.deposit-graph-area').css('height', '750px');
    $('#graph').attr('width' , 300);
    $('#graph').attr('height', 150);
    $('.search-btn').css('margin-left', '180px');
    $('.current-deposit-list').css('font-size', '21px');
  } else {
    // ノートPCの場合
    $('.deposit-graph-area').css('height', '600px');
    $('#graph').attr('width' , 300);
    $('#graph').attr('height', 152);
    $('.search-btn').css('margin-left', '75px');
    $('.current-deposit-list').css('font-size', '20px');
  }

  //初期処理
  initProcess();

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

  //日付タイトル設定
  $("#date-title").text(year + "年");
  //selected設定
  $("#year option[value='" + year + "']").prop('selected', true);

  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_DEPOSIT,
    processName : '東日本銀行貯金額一覧データ取得処理',
    url : '/higashiDepositList',
    data : {year: year},
    dataType : 'json'
  }

  //読み込み中画面開く
  $('#loader').fadeIn();  

  //貯金額内訳データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  //グラフ描画
  drawGraph();

  // 現在の貯金額設定
  let yearMonth = year + '/' + ('00'+month).slice(-2);
  const depositJson = jsonData.find(function(deposit) {return deposit.depositDate === yearMonth});
  if (depositJson) {
    higashiDepositData = depositJson.amount;
  }
  $("#deposit-year").text(year);
  $("#deposit-month").text(month);
  $("#higashi-deposit").text(Number(higashiDepositData).toLocaleString());

  //読み込み中画面閉じる
  $('#loader').fadeOut();
}

/*
  グラフ描画
*/
function drawGraph() {
  //再描画の際は一度前のグラフを破棄
  if(depositGraph != null) {
    depositGraph.destroy();
  }

  let amountData = [];
  for (let i = 1; i <= 12; i++) {
    let amount = null;
    let yearMonth = year + '/' + ('00'+i).slice(-2);
    const depositJson = jsonData.find(function(deposit) {return deposit.depositDate === yearMonth});
    if (depositJson) {
      amount = depositJson.amount;
    }
    amountData.push(amount);
  }

  graphData.datasets[0].data = amountData;
  graphData.datasets[1].data = amountData;

  depositGraph = new Chart(document.getElementById('graph'), {
    type: 'bar',
    data: graphData,
    options: {}
  });
}

/*
  検索処理
*/
async function search() {
  year = $("#year").val();
  $("#date-title").text(year + "年");

  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_DEPOSIT,
    processName : '東日本銀行貯金額一覧データ取得処理',
    url : '/higashiDepositList',
    data : {year: year},
    dataType : 'json'
  }

  //読み込み中画面開く
  $('#loader').fadeIn();

  //前月の貯金額内訳データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);
  
  //グラフ描画
  drawGraph();

  //読み込み中画面閉じる
  $('#loader').fadeOut();
}

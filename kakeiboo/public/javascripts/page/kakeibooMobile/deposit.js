// 年
let year = 0;

// 月
let month = 0;

//Ajax通信用JSONデータ
let jsonData = {};

//グラフデータ
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

$(function() {
  //初期処理
  initProcess();

  // 「年」選択時
  $("#year").change(function() { 
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
  // 今日の日付取得
  let now = new Date();
  year = now.getFullYear();
  month = now.getMonth()+1;

  // 年タイトル設定
  $("#deposit-title").text(year + "年");
  // selected設定
  $("#year option[value='" + year + "']").prop('selected', true);

  // Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_DEPOSIT,
    processName : '貯金額一覧データ取得処理',
    url : '/kakeibooMobile/higashiDepositList',
    data : {year: year},
    dataType : 'json'
  }

  // 読み込み中画面開く
  $('#loader').fadeIn();  

  // 貯金額内訳データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  // グラフ描画
  drawGraph();

  // 現在の貯金額設定
  let currentAmount = '0';
  let yearMonth = year + '/' + ('00'+month).slice(-2);
  const depositJson = jsonData.find(function(deposit) {return deposit.depositDate === yearMonth});
  if (depositJson) {
    currentAmount = depositJson.amount;
  }
  $("#deposit-year").text(year);
  $("#deposit-month").text(month);
  $("#deposit-amount").text(Number(currentAmount).toLocaleString() + '円');

  // 読み込み中画面閉じる
  $('#loader').fadeOut();
}

/*
  検索
*/
async function search() {
  year = $("#year").val();
  // 年タイトル設定
  $("#deposit-title").text(year + "年");

  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_DEPOSIT,
    processName : '貯金額一覧データ取得処理',
    url : '/kakeibooMobile/higashiDepositList',
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

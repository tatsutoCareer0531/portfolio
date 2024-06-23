// 今日の日付
let today;
// 年
let year;
// 月
let month;
// 日
let date;

// カレンダー 指定日
let designatedDate;

// カレンダー 日付の範囲
let calendarDateRange;

// 横の日付
let labels = [];

// グラフデータ(支出)
let spendAmountList = [];

// グラフデータ(収入)
let incomeAmountList = [];

// 棒グラフデータ
let graphData = {};

let barGraph = null;

// ニューススクロール
let $scrollX = 0;

// JSONデータ
let jsonData = {};

$(function(){
  //画面設定
  if(accessDevice == DESKTOP) {
    // デスクトップの場合
    $('.graph-area').css('top', '-50px');
    $('.graph-area').css('width', '90%');
    $('.graph-area').css('height', '85%');
    $('#bar-graph').attr('width' , 300);
    $('#bar-graph').attr('height', 150);
    $('.graph-title').css('font-size', '19px');
  } else {
    // ノートPCの場合
    $('.graph-area').css('top', '-35px');
    $('.graph-area').css('width', '95%');
    $('.graph-area').css('height', '90%');
    $('#bar-graph').attr('width' , 300);
    $('#bar-graph').attr('height', 168);
    $('.graph-title').css('font-size', '21px');
  }

  // 初期処理
  initProcess();

  //モード変更 支出
  $("#spend").click(function() {
    //グラフ切り替え
    changeGraph('spend');
    //グラフの再描画
    drawGraph();
  });

  //モード変更 収入
  $("#income").click(function() {
    //グラフ切り替え
    changeGraph('income');
    //グラフの再描画
    drawGraph();
  });

  // 「年」選択時
  $("#year-select").change(function() {
    search();
  });

  // 「月」選択時
  $("#month-select").change(function() {
    search();
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
  date = today.getDate();
  today = new Date(year, month-1, date);

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

  // 年月selected設定
  $("#year-select option[value='" + year + "']").prop('selected', true);
  $("#month-select option[value='" + month + "']").prop('selected', true);

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
    pageName : PAGE_NAME_MENU,
    processName : 'グラフデータ取得処理',
    url : '/graphList',
    data : dateObj,
    dataType : 'json'
  }

  // カレンダー内訳データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  // グラフデータと横の日付設定
  let currentDate = new Date(calendarDateRange.startDate);
  while(true) {
    if (!(calendarDateRange.startDate <= currentDate && currentDate <= calendarDateRange.endDate)) {
      break;
    }

    // グラフデータ
    let tempDate = currentDate.getFullYear() + '-' + ('00' + Number(currentDate.getMonth()+1)).slice(-2) + '-' + ('00' + currentDate.getDate()).slice(-2);
    let resultSpend = jsonData.spendGraphData.find(el => el.graphDate === tempDate);
    if (resultSpend) {
      spendAmountList.push(resultSpend.amount);
    } else {
      spendAmountList.push(null);
    }
    let resultIncome = jsonData.incomeGraphData.find(el => el.graphDate === tempDate);
    if (resultIncome) {
      incomeAmountList.push(resultIncome.amount);
    } else {
      incomeAmountList.push(null);
    }
    
    // 横の日付
    labels.push(currentDate.getDate() + '日');
    currentDate.setDate(currentDate.getDate()+1);
  }

  //グラフ設定
  changeGraph('spend');

  //グラフの描画
  drawGraph();

  //ニュース設定
  newsSetting();

  // 読み込み中画面閉じる
  $('#loader').fadeOut();
}

/*
  グラフ切り替え
*/
function changeGraph(mode) {
  $('#spend').removeClass('btn-style-on');
  $('#income').removeClass('btn-style-on');
  $('#spend').addClass('btn-style-off');
  $('#income').addClass('btn-style-off');

  if(mode == 'spend') {
    //グラフデータ
    graphData = {
      //横の日付
      labels: labels,
      datasets: [{
        //ラベル名
        label: '支出',
        //棒グラフデータ
        data: spendAmountList,
        //グラフの色
        backgroundColor: BAR_GRAPH_BGCOLOR_RED,
        //グラフの線の色
        borderColor: BAR_GRAPH_BDCOLOR_RED,
        //グラフの線の太さ
        borderWidth: 1
      }]
    };
  } else {
    //グラフデータ
    graphData = {
      //横の日付
      labels: labels,
      datasets: [{
        //ラベル名
        label: '収入',
        //棒グラフデータ
        data: incomeAmountList,
        //グラフの色
        backgroundColor: BAR_GRAPH_BGCOLOR_BLUE,
        //グラフの線の色
        borderColor: BAR_GRAPH_BDCOLOR_BLUE,
        //グラフの線の太さ
        borderWidth: 1
      }]
    };
  }
  $('#' + mode).removeClass('btn-style-off');
  $('#' + mode).addClass('btn-style-on');
}

/*
  グラフ描画
*/
function drawGraph() {
  //再描画の際は一度前のグラフを破棄
  if(barGraph != null) {
    barGraph.destroy();
  }
  //グラフの描画
  barGraph = new Chart(document.getElementById('bar-graph'), {
    type: 'bar',
    data: graphData,
    options: {}
  });
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
  ニュース設定
*/
function newsSetting() {
  //天気の日付設定
  $('#weather-date').text(month + '月' + date + '日' + 'の天気');
  //ニュース文字数CSS調整...※幅設定 : (文字数+15) x 20 x 2
  $('#news-text').css('width', ((Number($('#news-info').val())+15) * 20 * 2) + 'px');
  //ニューススクロール
  autoScroll();
}

/*
  ニューススクロール
*/
function autoScroll() {
  let $newsArea = document.getElementById("news-area");
  $newsArea.scrollLeft = ++$scrollX;
  if($scrollX < $newsArea.scrollWidth - $newsArea.clientWidth){
    setTimeout("autoScroll()", 15);
  }else{
    $scrollX = 0;
    $newsArea.scrollLeft = 0;
    setTimeout("autoScroll()", 15);
  }
}

/*
  検索
*/
async function search() {
  // 日付設定
  year = $('#year-select').val();
  month = $('#month-select').val();;

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
    pageName : PAGE_NAME_MENU,
    processName : 'グラフデータ取得処理',
    url : '/graphList',
    data : dateObj,
    dataType : 'json'
  }

  // カレンダー内訳データ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  // グラフデータと横の日付設定
  labels = [];
  spendAmountList = [];
  incomeAmountList = [];
  let currentDate = new Date(calendarDateRange.startDate);
  while(true) {
    if (!(calendarDateRange.startDate <= currentDate && currentDate <= calendarDateRange.endDate)) {
      break;
    }

    // グラフデータ
    let tempDate = currentDate.getFullYear() + '-' + ('00' + Number(currentDate.getMonth()+1)).slice(-2) + '-' + ('00' + currentDate.getDate()).slice(-2);
    let resultSpend = jsonData.spendGraphData.find(el => el.graphDate === tempDate);
    if (resultSpend) {
      spendAmountList.push(resultSpend.amount);
    } else {
      spendAmountList.push(null);
    }
    let resultIncome = jsonData.incomeGraphData.find(el => el.graphDate === tempDate);
    if (resultIncome) {
      incomeAmountList.push(resultIncome.amount);
    } else {
      incomeAmountList.push(null);
    }
    
    // 横の日付
    labels.push(currentDate.getDate() + '日');
    currentDate.setDate(currentDate.getDate()+1);
  }

  //グラフ設定
  changeGraph('spend');

  //グラフの描画
  drawGraph();

  // 読み込み中画面閉じる
  $('#loader').fadeOut();
}

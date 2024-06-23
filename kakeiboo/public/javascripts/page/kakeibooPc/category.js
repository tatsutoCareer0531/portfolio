// 支出/収入
let mode = '';

// Ajax通信用JSONデータ
let jsonData = {};

// 支出カテゴリー番号(id割り振り用)
let categorySpendNum = 0;

// 収入カテゴリー番号(id割り振り用)
let categoryIncomeNum = 0;

//削除情報
let deleteInfoArray = [];

$(function(){
  //画面設定
  if(accessDevice == DESKTOP) {
    // デスクトップの場合
    $('.wrapper-area').css('height', '850px');
    $('.category-block').css('height', '81%');
  } else {
    // ノートPCの場合
    $('.wrapper-area').css('height', '770px');
    $('.category-block').css('height', '78%');
  }

  //初期処理
  initProcess();

  //支出ボタン押下
  $('#spend-btn').click(function() {
    //カテゴリー切り替え
    categoryChange('spend');
  });

  //収入ボタン押下
  $('#income-btn').click(function() {
    //カテゴリー切り替え
    categoryChange('income');
  });

  //新規追加ボタン押下
  $('#add-btn').click(function() {
    //カテゴリー追加
    addCategory();
  });

  //更新ボタン押下
  $('#update-btn').click(function() {
    //更新
    update();
  });

  /*
    ページ遷移 各種設定画面
  */
  $('#back-btn').click(function() {
    //各種設定画面へ
    pageMove('/kakeiboo/setting');
  });

  //上アイコン押下
  $(document).on("click", ".sort-up", function(event) {
    let currentNum = event.target.id.split('-')[3];
    let previousEl = $("#category-list-" + mode + "-" + currentNum)[0].previousElementSibling;
    if(previousEl != null) {
      let previousNum = previousEl.id.split('-')[3];
      // リスト並び替え
      categorySort(currentNum, previousNum, 'up');
    }
  });

  //下アイコン押下(OFF)
  $(document).on("click", ".sort-down", function(event) {
    let currentNum = event.target.id.split('-')[3];
    let nextEl = $("#category-list-" + mode + "-" + currentNum)[0].nextElementSibling;
    if(nextEl != null) {
      let nextNum = nextEl.id.split('-')[3];
      // リスト並び替え
      categorySort(currentNum, nextNum, 'down');
    }
  });

  //削除アイコン押下(ON)
  $(document).on("click", ".check-on", function(event) {
    //アイコン変更
    iconChange(event, 'on');
  });

  //削除アイコン押下(OFF)
  $(document).on("click", ".check-off", function(event) {
    //アイコン変更
    iconChange(event, 'off');
  });
});

/*
  初期処理
*/
async function initProcess() {
  //Ajax 引数
  let ajaxDataSet = {
    pageName : PAGE_NAME_CATEGORY,
    processName : 'カテゴリーデータ取得処理',
    url : '/settingCategory',
    data : {},
    dataType : 'json'
  }

  //読み込み中画面開く
  $('#loader').fadeIn();

  //カテゴリーデータ取得(Ajax)
  jsonData = await ajaxCommonProcess(ajaxDataSet);

  //読み込み中画面閉じる
  $('#loader').fadeOut();

  //カテゴリー内容描画
  drawCategory();

  //ドラッグ&ドロップ機能(支出)
  Sortable.create(categorySpend, {
    // handle: '.icon-move-sample1',
    animation: 300,
  });
  //ドラッグ&ドロップ機能(収入)
  Sortable.create(categoryIncome, {
    // handle: '.icon-move-sample2',
    animation: 300,
  });

  //支出モード
  categoryChange('spend');
  $('#message-text').text('');
  $('#message-text').removeClass('message-ok');
  $('#message-text').removeClass('message-error');
}

/*
  カテゴリー内容描画
*/
function drawCategory() {
  let spendText = '';
  let incomeText = '';
  for(let category of jsonData) {
    if(category.ieFlg == '0') {
      spendText += 
        '<li id="category-list-spend-' + category.sortKey + '" class="category-li category-li-spend">' + 
          '<div style="border: 1px solid rgb(255, 100, 100);" class="input-sort-block">' + 
            '<div class="input-block">' + 
              '<input type="text" class="category-input-spend" value="' + category.name + '" autocomplete="off">' + 
            '</div>' + 
            '<div class="icon-block">' + 
              '<div class="sort-block">' + 
                '<img id="sort-up-spend-' + category.sortKey + '" class="sort-icon sort-up" src="/assets/images/kakeibooPc/sort_up.png">' + 
                '<img id="sort-down-spend-' + category.sortKey + '" class="sort-icon sort-down" src="/assets/images/kakeibooPc/sort_down.png">' + 
              '</div>' + 
            '</div>' + 
          '</div>' + 
          '<div class="delete-block">' + 
            '<img id="check-on-spend-' + category.sortKey + '" class="sort-icon check-on" src="/assets/images/kakeibooPc/category_check_on.png">' + 
            '<img id="check-off-spend-' + category.sortKey + '" class="sort-icon check-off" src="/assets/images/kakeibooPc/category_check_off.png">' + 
          '</div>' + 
          '<input class="category-id" type="hidden" value="' + category.id + '">' + 
        '</li>';

      // カテゴリー番号設定(支出)
      if(Number(categorySpendNum) < Number(category.sortKey)) {
        categorySpendNum = category.sortKey;
      }
    } else {
      incomeText += 
        '<li id="category-list-income-' + category.sortKey + '" class="category-li category-li-income">' + 
          '<div style="border: 1px solid rgb(119, 167, 255);" class="input-sort-block">' + 
            '<div class="input-block">' + 
              '<input type="text" class="category-input-income" value="' + category.name + '" autocomplete="off">' + 
            '</div>' + 
            '<div class="icon-block">' + 
              '<div class="sort-block">' + 
                '<img id="sort-up-income-' + category.sortKey + '" class="sort-icon sort-up" src="/assets/images/kakeibooPc/sort_up.png">' + 
                '<img id="sort-down-income-' + category.sortKey + '" class="sort-icon sort-down" src="/assets/images/kakeibooPc/sort_down.png">' + 
              '</div>' + 
            '</div>' + 
          '</div>' + 
          '<div class="delete-block">' + 
            '<img id="check-on-income-' + category.sortKey + '" class="sort-icon check-on" src="/assets/images/kakeibooPc/category_check_on.png">' + 
            '<img id="check-off-income-' + category.sortKey + '" class="sort-icon check-off" src="/assets/images/kakeibooPc/category_check_off.png">' + 
          '</div>' + 
          '<input class="category-id" type="hidden" value="' + category.id + '">' + 
        '</li>';

      // カテゴリー番号設定(収入)
      if(Number(categoryIncomeNum) < Number(category.sortKey)) {
        categoryIncomeNum = category.sortKey;
      }
    }
  }

  $('#categorySpend').children().remove();
  $('#categoryIncome').children().remove();
  $('#categorySpend').append(spendText);
  $('#categoryIncome').append(incomeText);

  $('.check-on').hide();
  $('#categoryIncome').hide();
}

/*
  カテゴリー切り替え
*/
function categoryChange(selectMode) {
  $('#categorySpend').hide();
  $('#categoryIncome').hide();
  $('#spend-btn').removeClass('btn-style-on');
  $('#income-btn').removeClass('btn-style-on');
  $('#spend-btn').addClass('btn-style-off');
  $('#income-btn').addClass('btn-style-off');
  if(selectMode == 'spend') {
    $('#categorySpend').show();
    $('#spend-btn').removeClass('btn-style-off');
    $('#spend-btn').addClass('btn-style-on');
    mode = selectMode;
  } else {
    $('#categoryIncome').show();
    $('#income-btn').removeClass('btn-style-off');
    $('#income-btn').addClass('btn-style-on');
    mode = selectMode;
  }
}

/*
  カテゴリー追加
*/
function addCategory() {
  let text = ''
  if(mode == 'spend') {
    //カテゴリー番号設定(支出)
    let num = ++categorySpendNum;
    text = 
      '<li id="category-list-spend-' + num + '" class="category-li category-li-spend">' + 
        '<div style="border: 1px solid rgb(99, 99, 99);" class="input-sort-block">' + 
          '<div class="input-block">' + 
            '<input type="text" class="category-input-spend" value="" autocomplete="off">' + 
          '</div>' + 
          '<div class="icon-block">' + 
            '<div class="sort-block">' + 
              '<img id="sort-up-spend-' + num + '" class="sort-icon sort-up" src="/assets/images/kakeibooPc/sort_up.png">' + 
              '<img id="sort-down-spend-' + num + '" class="sort-icon sort-down" src="/assets/images/kakeibooPc/sort_down.png">' + 
            '</div>' + 
          '</div>' + 
        '</div>' + 
        '<div class="delete-block">' +
          '<img id="check-on-spend-' + num + '" class="sort-icon check-on" src="/assets/images/kakeibooPc/category_check_on.png">' +
          '<img id="check-off-spend-' + num + '" class="sort-icon check-off" src="/assets/images/kakeibooPc/category_check_off.png">' +
        '</div>' + 
        '<input class="category-id" type="hidden" value="">' + 
      '</li>';

    $('#categorySpend').prepend(text);
    $('#check-on-spend-' + num).hide();
  } else {
    //カテゴリー番号設定(収入)
    let num = ++categoryIncomeNum;
    text = 
      '<li id="category-list-income-' + num + '" class="category-li category-li-income">' + 
        '<div style="border: 1px solid rgb(99, 99, 99);" class="input-sort-block">' + 
          '<div class="input-block">' + 
            '<input type="text" class="category-input-income" value="" autocomplete="off">' + 
          '</div>' + 
          '<div class="icon-block">' + 
            '<div class="sort-block">' + 
              '<img id="sort-up-income-' + num + '" class="sort-icon sort-up" src="/assets/images/kakeibooPc/sort_up.png">' + 
              '<img id="sort-down-income-' + num + '" class="sort-icon sort-down" src="/assets/images/kakeibooPc/sort_down.png">' + 
            '</div>' + 
          '</div>' + 
        '</div>' + 
        '<div class="delete-block">' +
          '<img id="check-on-income-' + num + '" class="sort-icon check-on" src="/assets/images/kakeibooPc/category_check_on.png">' +
          '<img id="check-off-income-' + num + '" class="sort-icon check-off" src="/assets/images/kakeibooPc/category_check_off.png">' +
        '</div>' + 
        '<input class="category-id" type="hidden" value="">' + 
      '</li>';

    $('#categoryIncome').prepend(text);
    $('#check-on-income-' + num).hide();
  }
}

/*
  更新処理
*/
async function update() {
  $('#message-text').text('');
  $('#message-text').removeClass('message-ok');
  $('#message-text').removeClass('message-error');

  let emptyFlg = false;

  let updateData = [];
  let sortNumSpend = 1;
  let sortNumIncome = 1;

  //支出
  $(".category-li-spend").each(function(index, el) {
    //空チェック
    let categoryName = $(el.firstChild.firstChild.firstChild).val();
    if(nullEmptyCheck(categoryName)) {
      emptyFlg = true;
    }

    // 削除フラグ設定
    let deleteFlg = false;
    let num = el.id.split("-")[3];
    let deleteIndex = deleteInfoArray.findIndex(({deletePk}) => deletePk == "spend-" + num);
    if(deleteIndex !== -1) {
      deleteFlg = true;
    }

    // ソートキー設定
    let sortKey = 0;
    if (!deleteFlg) {
      sortKey = sortNumSpend++;
    }

    let updateObj = {
      id: $(el.lastChild).val(),
      ieFlg: '0',
      name: categoryName,
      sortKey: sortKey,
      deleteFlg: deleteFlg
    }
    updateData.push(JSON.stringify(updateObj));
  });
  //収入
  $(".category-li-income").each(function(index, el) {
    //空チェック
    let categoryName = $(el.firstChild.firstChild.firstChild).val();
    if(nullEmptyCheck(categoryName)) {
      emptyFlg = true;
    }

    // 削除フラグ設定
    let deleteFlg = false;
    let num = el.id.split("-")[3];
    let deleteIndex = deleteInfoArray.findIndex(({deletePk}) => deletePk == "income-" + num);
    if(deleteIndex !== -1) {
      deleteFlg = true;
    }

    // ソートキー設定
    let sortKey = 0;
    if (!deleteFlg) {
      sortKey = sortNumIncome++;
    }

    let updateObj = {
      id: $(el.lastChild).val(),
      ieFlg: '1',
      name: categoryName,
      sortKey: sortKey,
      deleteFlg: deleteFlg
    }
    updateData.push(JSON.stringify(updateObj));
  });

  if (emptyFlg) {
    $('#message-text').text(MESSAGE_UPDATE_ERROR);
    $('#message-text').addClass('message-error');
  } else {
    //Ajax 引数
    let ajaxDataSet = {
      pageName : PAGE_NAME_CATEGORY,
      processName : 'カテゴリー更新処理',
      url : '/categoryUpdate',
      data : {updateData: JSON.stringify(updateData)},
      dataType : 'text'
    }

    // 読み込み中画面開く
    $('#loader').fadeIn();

    // カテゴリー更新処理(Ajax)
    let result = await ajaxCommonProcess(ajaxDataSet);
    if(result == RETURN_CODE_OK) {
      // Ajax 引数
      ajaxDataSet = {
        pageName : PAGE_NAME_CATEGORY,
        processName : 'カテゴリーデータ取得処理',
        url : '/settingCategory',
        data : {},
        dataType : 'json'
      }

      // カテゴリーデータ取得(Ajax)
      jsonData = await ajaxCommonProcess(ajaxDataSet);

      // カテゴリー内容描画
      drawCategory();

      // 支出モード
      categoryChange('spend');

      // 削除情報を空にする
      deleteInfoArray = [];

      $('#message-text').text(MESSAGE_UPDATE_OK);
      $('#message-text').addClass('message-ok');
    } else {
      $('#message-text').text(MESSAGE_UPDATE_ERROR);
      $('#message-text').addClass('message-error');
    }
    //読み込み中画面閉じる
    $('#loader').fadeOut();
  }
}

/*
  リスト並び替え
*/
function categorySort(currentNum, previousNextNum, sortMode){
  if(sortMode == 'up') {
    $('#category-list-' + mode + "-" + previousNextNum).before($('#category-list-' + mode + "-" + currentNum));
  } else {
    $('#category-list-' + mode + "-" + previousNextNum).after($('#category-list-' + mode + "-" + currentNum));
  }
}

/*
  削除アイコン変更
*/
function iconChange(event, iconMode) {
  let num = event.target.id.split('-')[3];
  if(iconMode == 'off') {
    $("#check-on-" + mode + "-" + num).show();
    $("#check-off-" + mode + "-" + num).hide();
    //削除情報をつめる
    let deleteInfo = {
      deletePk: mode + "-" + num,
      id: $(event.target.parentNode.nextElementSibling).val(),
    };
    deleteInfoArray.push(deleteInfo);
  } else {
    $("#check-on-" + mode + "-" + num).hide();
    $("#check-off-" + mode + "-" + num).show();
    //削除情報を削除
    let index = deleteInfoArray.findIndex(({deletePk}) => deletePk == mode + "-" + num);
    deleteInfoArray.splice(index, 1);
  }
}

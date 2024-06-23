<template>
  <div class="photoListContents">
    <!-- 画像モーダル -->
    <ModalPhoto 
      v-show="showContent" 
      @modalClick="changeModal"
      :photoData="photoData"
    ></ModalPhoto>
    <!-- 写真一覧 -->
    <div v-for="(photoInfo, index) in photoList" :key="index">
      <!-- 写真日付 -->
      <div class="w-100 my-2 photo-date">{{ dateFormatYmd(photoInfo.ymd) }}</div>
      <!-- 写真 -->
      <div class="row">
        <div
          class="photo-list col-6 col-sm-6 col-md-4 col-lg-3 col-xxl-2"
          v-for="(data, index) in photoInfo.dataList"
          :key="index"
          v-on:click="changeModal(true, data)"
        >
          <div class="photo">
            <img class="photo-img" :src="data.url">
          </div>
        </div>
      </div>
    </div>
    <!-- 無限スクロール -->
    <infinite-loading spinner="circles" v-if="infiniteScrollFlg" @infinite="infiniteHandler">
      <div class="my-4" slot="no-more">----- 検索結果は以上です-----</div>
    </infinite-loading>
  </div>
</template>

<script>
import jszip from 'jszip'
import ModalPhoto from '@/components/ModalPhoto';

export default {
  name: 'PhotoListContents',
  data: function () {
    return {
      // API 写真一覧データ取得(開始)
      rowNumStart: 1,
      // API 写真一覧データ取得(終了)
      rowNumEnd: 100,
      // API ZIPファイル
      apiZipFile: null,
      // 写真一覧情報(表示用)
      photoList: [],
      // 処理中の年月日
      tempYmd: null,
      // 処理中の写真情報
      tempPhotoInfo: {
        ymd: null,
        dataList:[]
      },
      // 処理中のindex
      tempArrIndex: 0,
      // API取得時の全画像枚数 ※取得されたら直上パスのフォルダの分も入っている(全画像枚数分+1)
      fileMaxNum: 0,
      // スクロール時の一回の画像表示数
      oneScrollNum: 30,
      // 無限スクロールタグのフラグ 表示/非表示
      infiniteScrollFlg: false,
      // モーダル 表示/非表示
      showContent: false,
      // モーダル 内容
      photoData: {
        id: null,
        url: null
      },
    }
  },
  components: {
    // 画像モーダル
    ModalPhoto,
  },
  created: async function() {
    // 写真一覧取得
    await this.getPhotoList();
    // 写真設定
    this.photoList = await this.photoSetting();
    this.infiniteScrollFlg = true;
  },
  methods: {
    /*
      写真一覧取得
    */
    getPhotoList: async function() {
      console.log('写真一覧取得処理開始');
      try {
        let resultData = new Blob([], {type: 'application/zip'});
        if (this.infiniteScrollFlg) {
          this.rowNumStart += 100;
          this.rowNumEnd += 100;
        }
        const url = `${this.API_URL_3000}/photo/getList?rowNumStart=${this.rowNumStart}&rowNumEnd=${this.rowNumEnd}`;
        await this.axios.get(url, {
          responseType: 'blob'
        }).then((res)=> {
          resultData = res.data;
        }).catch((e)=> {
          console.log('写真一覧データ取得処理エラー');
          throw e;
        });
        console.log('写真一覧データ取得OK');
        this.apiZipFile = null;
        this.tempArrIndex = 0;
        this.fileMaxNum = 0;
        if (resultData.size !== 0) {
          this.apiZipFile = await jszip.loadAsync(resultData);
          this.tempArrIndex = 0;
          this.fileMaxNum = Object.entries(this.apiZipFile.files).length;
        }
      } catch (e) {
        console.log('写真一覧取得処理エラー');
        console.log(e);
        // エラー画面に遷移
        this.pageMove('Error', false);
      }
      console.log('写真一覧取得処理終了');
    },
    /*
      写真設定
    */
    photoSetting: async function() {
      console.log(`写真設定開始: ${this.tempArrIndex}`);
      const photoList = this.photoList;
      let count = 1;
      const url = window.URL || window.webkitURL;
      for (let i = this.tempArrIndex; i < Object.entries(this.apiZipFile.files).length; i++) {
        const filePath = Object.entries(this.apiZipFile.files)[i][0];
        const fileData = Object.entries(this.apiZipFile.files)[i][1];
        if (filePath.indexOf('jpg') !== -1) {
          // スクロール時の一回の画像表示数を超えたら終わり
          if (count > this.oneScrollNum) {
            this.tempArrIndex = i;
            break;
          }
          const ymd = filePath.split('/')[1].split('.')[0].split('_')[0];
          const id = filePath.split('/')[1].split('.')[0].split('_')[1];
          if (this.tempYmd !== ymd) {
            this.tempYmd = ymd;
            this.tempPhotoInfo = {
              ymd: this.tempYmd,
              dataList:[]
            };
            photoList.push(this.tempPhotoInfo);
          }
          const data = await fileData.async('blob');
          this.tempPhotoInfo.dataList.push({
            id: id,
            url: url.createObjectURL(data)
          });
          count++;

          if (i+1 === Object.entries(this.apiZipFile.files).length) {
            this.tempArrIndex = i+1;
          }
        }
      }
      console.log(`写真設定終了: ${this.tempArrIndex}`);
      return photoList;
    },
    /*
      一番下までスクロール時
    */
    infiniteHandler: async function($state) {
      if (this.infiniteScrollFlg) {
        const self = this;
        if (this.tempArrIndex !== this.fileMaxNum) {
          console.log('画像追加処理開始');
          // 写真設定
          self.photoList = await this.photoSetting();
          // 再読み込み
          $state.loaded();
          console.log('画像追加処理終了');
        } else {
          if (this.tempArrIndex < (this.rowNumEnd-this.rowNumStart)+2) {
            // 画像表示が最大数のため読み込み終了
            $state.complete();
          } else {
            console.log('画像再取得処理開始');
            // 写真一覧取得
            await this.getPhotoList();
            if (this.fileMaxNum === 0) {
              // 画像表示が最大数のため読み込み終了
              $state.complete();
            } else {
              // 写真設定
              self.photoList = await this.photoSetting();
              // 再読み込み
              $state.loaded();
            }
            console.log('画像再取得処理終了');
          }
        }
      }
    },
    /*
      モーダル表示切り替え
    */
    changeModal: function(mode, value) {
      this.showContent = mode;
      this.photoData = value;

      if(mode) {
        // スクロールを停止する
        document.addEventListener('touchmove', this.noscroll, {passive: false});
        document.addEventListener('wheel', this.noscroll, {passive: false});
      } else {
        // スクロールを動かす
        document.removeEventListener('touchmove', this.noscroll);
        document.removeEventListener('wheel', this.noscroll);
      }
    },
    /*
      スクロール ON/OFF
    */
    noscroll: function(e){
      e.preventDefault();
    },
    /*
      日付フォーマット(年月日)
    */
    dateFormatYmd: function(photoDate) {
      return `${photoDate.substr(0,4)}年${Number(photoDate.substr(4,2))}月${Number(photoDate.substr(6,2))}日`;
    },
  }
}
</script>

<style scoped>
.photoListContents {
  width: 100%;
  height: 86vh;
  overflow-y: auto;
  overflow-x: hidden;
}
.photo-date {
  font-size: 19px;
  text-align: left;
}
.photo-list {
  margin: 0px;
  padding-left: 4px;
  padding-right: 4px;
  padding-bottom: 20px;
}
.photo {
  width: 174px;
  height: 164px;
}
.photo-img {
  width:100%;
  height:100%;
  object-fit:cover;
}
</style>

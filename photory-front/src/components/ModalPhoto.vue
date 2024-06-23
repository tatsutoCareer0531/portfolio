<template>
  <div class="modalPhoto">
    <div class="overlay">
      <!-- 横 -->
      <div class="content-W" v-if="photoWH === 'W'">
        <!-- 画像 -->
        <div class="img-block-W">
          <img class="photo-img" :src="photoData.url">
        </div>
        <!-- 詳細 -->
        <div>
          <p class="photo-place">場所 : {{ photoPlace }}</p>
          <p class="photo-date">日時 : {{ photoDate }}</p>
          <button class="back-btn" v-on:click="closeModal">閉じる</button>
        </div>
      </div>
      <!-- 縦 -->
      <div class="content-H" v-if="photoWH === 'H'">
        <!-- 画像 -->
        <div class="img-block-H">
          <img class="photo-img" :src="photoData.url">
        </div>
        <!-- 詳細 -->
        <div>
          <p class="photo-place">場所 : {{ photoPlace }}</p>
          <p class="photo-date">日時 : {{ photoDate }}</p>
          <button class="back-btn" v-on:click="closeModal">閉じる</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalPhoto',
  props: ['photoData'],
  data: function () {
    return {
      photoWH: null,
      photoPlace: null,
      photoDate: null,
    }
  },
  watch: {
    photoData: {
      handler: async function() {
        if (this.photoData.id) {
          console.log(`ID: ${this.photoData.id}`);
          // 写真詳細取得
          await this.getPhotoDetail();
        }
      },
    }
  },
  methods: {
    /*
      写真詳細取得
    */
    getPhotoDetail: async function() {
      console.log('写真詳細取得処理開始');
      // 写真詳細情報取得
      const result = await this.getPhotoDetailInfo(this.photoData.id);
      console.log('写真詳細情報取得OK');
      if (result.statusCode === this.STATUS_CODE_OK) {
        this.photoWH = result.data.photoWH;
        this.photoPlace = result.data.photoPlace.replace(/_/g, ', ');
        this.photoDate = this.dateFormatYmdHHMM(new Date(result.data.photoDatetime));
      } else {
        console.log('写真詳細取得処理エラー');
        // エラー画面に遷移
        this.pageMove('Error', false);
      }
      console.log('写真詳細取得処理終了');
    },
    /*
      写真詳細情報取得
    */
    getPhotoDetailInfo: async function(id) {
      console.log('写真詳細情報取得処理開始');
      let result = {
        statusCode: null,
        data: {}
      };
      await this.axios.post(`${this.API_URL_3000}/photo/getDetailInfo`, {id: id}).then((res)=> {
        result = JSON.parse(res.data);
      }).catch((e)=> {
        console.log('写真詳細情報取得処理エラー');
        console.log(e);
        result = {
          statusCode: this.STATUS_CODE_BAD_REQUEST,
          data: {}
        };
      });
      console.log(`ステータスコード : ${result.statusCode}`);
      console.log('写真詳細情報取得処理終了');
      return result;
    },
    /*
      日付フォーマット(年月日時分)
    */
    dateFormatYmdHHMM: function(photoDate) {
      const y = photoDate.getFullYear();
      const m = photoDate.getMonth()+1;
      const d = photoDate.getDate();
      const hh = ('00'+photoDate.getHours()).slice(-2);
      const mm = ('00'+photoDate.getMinutes()).slice(-2);
      return `${y}年 ${m}月 ${d}日 ${hh}:${mm}`;
    },
    /*
      モーダル閉じる
    */
    closeModal: function() {
      this.photoWH = null;
      this.photoDate = null;
      this.photoPlace = null;
      this.$emit("modalClick", false, {
        id: null,
        url: null
      });
    },
  }
}
</script>

<style scoped>
.overlay{
  /* 画面全体を覆う設定 */
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0, 0, 0, 0.75);
  /* 画面の中央に要素を表示させる設定 */
  display: flex;
  align-items: center;
  justify-content: center;
  /* 要素を重ねた時の順番 */
  z-index:11;
}
/* 画像 横 */
.content-W {
  width: 90%;
  height: 405px;
  background: #fff;
  border-radius: 4px;
  z-index: 12;
}
.img-block-W {
  width: 100%;
  height: 65%;
}
/* 画像 縦 */
.content-H {
  width: 81%;
  height: 665px;
  background: #fff;
  border-radius: 4px;
  z-index: 12;
}
.img-block-H {
  width: 100%;
  height: 79%;
}

/* 画像本体 */
.photo-img {
  width:100%;
  height:100%;
  object-fit:cover;
  border-radius: 3px 3px 0 0;
}

/* 詳細 */
.photo-place {
  width: 94%;
  height: 50px;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 0;
  margin-right: auto;
  margin-left: auto;
}
.photo-date {
  margin-bottom: 0;
  margin-left:10px;
  text-align: left;
}
.back-btn {
  width: 90px;
  height: 35px;
  margin-top: 9px;
  background-color: rgb(255, 255, 255);
  color: rgba(74, 162, 214, 0.973);
  border: 1px solid rgba(74, 162, 214, 0.973);
  border-radius: 7px;
  text-decoration: none;
  font-size: 13px;
}
</style>

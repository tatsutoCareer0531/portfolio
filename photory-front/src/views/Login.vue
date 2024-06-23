<template>
  <div class="login">
    <!-- ログインフォーム -->
    <div class="row login-block">
      <div class="mx-auto w-50">
        <b-input-group class="w-100 mt-4 mb-4">
          <b-form-input
            class="login-input-id"
            v-model="id"
            type="text"
            placeholder="ログインID"
          ></b-form-input>
        </b-input-group>
        <b-input-group class="w-100 mb-1">
          <b-form-input
            class="login-input-password"
            v-model="password"
            type="password"
            placeholder="パスワード"
          ></b-form-input>
        </b-input-group>
        <div class="error">
          <span v-if="errorFlg">ログインに失敗しました</span>
        </div>
        <b-input-group class="mt-1">
          <b-input-group-append class="w-100">
            <button class="login-btn" v-on:click="login()">ログイン</button>
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
    <!-- 写真一覧 -->
    <div class="row photo-list-block">
      <div class="photo-list">
        <ul>
          <li class="photo-li" v-for="(url, index) in urlList" :key="index">
            <div class="photo">
              <img class="photo-img" :src="url" :alt="url">
            </div>
          </li>
        </ul>
        <ul>
          <li class="photo-li" v-for="(url, index) in urlList" :key="index">
            <div class="photo">
              <img class="photo-img" :src="url" :alt="url">
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import jszip from 'jszip'

export default {
  name: 'Login',
  data: function () {
    return {
      // 写真URL一覧
      urlList: [],
      // ID
      id: '',
      // パスワード
      password: '',
      // エラーメッセージ表示/非表示
      errorFlg: false,
    }
  },
  created: async function() {
    // ランダム写真一覧取得
    await this.getRandomPhotoList();
  },
  methods: {
    /*
      ランダム写真一覧取得
    */
    getRandomPhotoList: async function() {
      console.log('ランダム写真一覧取得処理開始');
      try {
        // ランダム写真一覧データ取得
        const resultData = await this.getRandomPhotoListData();
        console.log('ランダム写真一覧データ取得OK');
        if (resultData.size === 0) {
          throw new Error('ランダム写真一覧取得数エラー');
        }
        const url = window.URL || window.webkitURL;
        const zip = await jszip.loadAsync(resultData);
        if (Object.entries(zip.files).length !== 7) {
          throw new Error('ランダム写真一覧取得数エラー');
        }
        for (let file of Object.entries(zip.files)) {
          const filePath = file[0];
          const fileData = file[1];
          if (filePath.indexOf('jpg') !== -1) {
            const data = await fileData.async('blob');
            this.urlList.push(url.createObjectURL(data));
          }
        }
      } catch(e) {
        console.log('ランダム写真一覧取得処理エラー');
        console.log(e);
        // エラー画面に遷移
        this.pageMove('Error', false);
      }
      console.log('ランダム写真一覧取得処理終了');
    },
    /*
      ランダム写真一覧データ取得
    */
    getRandomPhotoListData: async function() {
      console.log('ランダム写真一覧データ取得処理開始');
      let resultData = new Blob([], {type: 'application/zip'});
      await this.axios.get(`${this.API_URL_3000}/photo/getRandomList`, {
        responseType: 'blob'
      }).then((res)=> {
        resultData = res.data;
      }).catch((e)=> {
        console.log('ランダム写真一覧データ取得処理エラー');
        throw e;
      });
      console.log('ランダム写真一覧データ取得処理終了');
      return resultData;
    },
    /*
      ログイン
    */
    login: async function() {
      console.log('ログイン処理開始');
      const id = this.id;
      const password = this.password;

      // 入力チェック
      if (this.inputCheck(id, password)) {
        this.errorFlg = true;
        console.log('入力チェックエラー');
        console.log('ログイン処理終了');
        return;
      }

      // ログイン情報取得
      const result = await this.getLoginInfo(id, password);
      if (result.statusCode === this.STATUS_CODE_OK) {
        console.log('ログインOK');
        // 写真一覧画面に遷移
        this.pageMove('PhotoList', true);
      } else if (result.statusCode === this.STATUS_CODE_NO_CONTENT) {
        console.log('ログインエラー');
        this.errorFlg = true;
      } else {
        console.log('ログイン処理エラー');
        // エラー画面に遷移
        this.pageMove('Error', false);
      }
      console.log('ログイン処理終了');
    },
    /*
      入力チェック
    */
    inputCheck: function(id, password) {
      // 空チェック
      if (!id || !password) {
        return true;
      }
      // 半角英数字チェック
      if (!(id.match(/^[0-9A-Za-z]+$/)) || !(password.match(/^[0-9A-Za-z]+$/))) {
        return true;
      }
      return false;
    },
    /*
      ログイン情報取得
    */
    getLoginInfo: async function(id, password) {
      console.log('ログイン情報取得処理開始');
      let result = {
        statusCode: null,
        data: {}
      };
      const params = {id: id, password: password};
      await this.axios.post(`${this.API_URL_3000}/login/getInfo`, params).then((res)=> {
        result = JSON.parse(res.data);
      }).catch((e)=> {
        console.log('ログイン情報取得処理エラー');
        console.log(e);
        result = {
          statusCode: this.STATUS_CODE_BAD_REQUEST,
          data: {}
        };
      });
      console.log(`ステータスコード : ${result.statusCode}`);
      console.log('ログイン情報取得処理終了');
      return result;
    }
  },
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 86vh;
}
/* ログインフォーム */
.login-block {
  height: 50%;
}
.login-input-id {
  color: rgb(110, 110, 110);
  font-size: 14px;
}
.login-input-password {
  color: rgb(65, 65, 65);
  font-size: 14px;
}
.form-control::-webkit-input-placeholder {
  color: rgb(170, 170, 170);
  font-size: 0.8em;
}
.error {
  height: 25px;
  margin-top: 0;
  margin-bottom: 0;
  color: rgb(150, 59, 59);
  font-size: 13px;
  text-align: left;
}
.login-btn {
  width: 90px;
  height: 35px;
  background-color: rgb(255, 255, 255);
  color: rgba(74, 162, 214, 0.973);
  border: 1px solid rgba(74, 162, 214, 0.973);
  border-radius: 7px;
  text-decoration: none;
  font-size: 13px;
}
/* 写真一覧 */
.photo-list-block {
  position: relative;
  height: 50%;
}
.photo-list {
  position: absolute;
  bottom: 2px;
  width: 100%;
  height: 300px;
  overflow: hidden;
  white-space: nowrap;
}
ul {
  display: inline-block;
  margin: 0;
  padding: 0;
  animation: hscroll2 25s linear infinite;
}
li {
  display: inline-block;
}
@keyframes hscroll2 {
  /* 画面描画時の開始位置 */
  0% { transform:translateX(1px); }
  /* 終了位置 */
  100% { transform:translateX(-100%); }
}
.photo-li {
  margin: 0px 2px;
}
.photo {
  width: 310px;
  height: 300px;
}
.photo-img {
  width:100%;
  height:100%;
  object-fit:cover;
}
</style>

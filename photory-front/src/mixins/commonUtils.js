// API_URL
const API_URL_3000 = 'http://aaa.bbb.ccc.ddd:xxxx';

// ステータスコード
const STATUS_CODE_OK = '200';
const STATUS_CODE_NO_CONTENT = '204';
const STATUS_CODE_BAD_REQUEST = '400';

export default {
  data: function() {
    return {
      API_URL_3000: API_URL_3000,
      STATUS_CODE_OK: STATUS_CODE_OK,
      STATUS_CODE_NO_CONTENT: STATUS_CODE_NO_CONTENT,
      STATUS_CODE_BAD_REQUEST: STATUS_CODE_BAD_REQUEST,
    }
  },
  methods: {
    /*
      ページ遷移
    */
    pageMove: function(pageName, value) {
      // ログイン情報を保持
      this.$store.dispatch("setLoginInfo", value);
      // 画面遷移
      this.$router.push({ name: pageName });
    }
  }
};

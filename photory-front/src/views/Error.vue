<template>
  <div class="error">
    <p class="error-message">システムエラーが発生しました。</p>
    <b-input-group class="mt-1">
      <b-input-group-append class="w-100">
        <button class="top-btn" v-on:click="pageMove('Login', false)">ログイン画面へ</button>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script>
export default {
  name: 'Error',
}
</script>

<style scoped>
.error-message {
  margin-top: 10px;
  font-size: 17px;
}
.top-btn {
  width: 120px;
  height: 35px;
  background-color: rgb(255, 255, 255);
  color: rgba(99, 102, 104, 0.973);
  border: 1px solid rgba(129, 135, 139, 0.973);
  border-radius: 7px;
  text-decoration: none;
  font-size: 13px;
}
</style>

<template>
  <div id="app" class="container">
    <div id="header">
      <CommonHeader></CommonHeader>
    </div>
    <div id="main">
      <router-view/>
    </div>
  </div>
</template>

<script>
import 'normalize.css'
import CommonHeader from '@/components/CommonHeader.vue'

export default {
  name: 'App',
  components: {
    CommonHeader
  }
}
</script>

<style>
#app {
  font-family: YuGothic, "游ゴシック体", "Yu Gothic", "ヒラギノ角ゴ Pro", "Hiragino Kaku Gothic Pro", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
  background-color: rgb(255, 255, 255);
  color: rgb(110, 110, 110);
  text-align: center;
}
</style>

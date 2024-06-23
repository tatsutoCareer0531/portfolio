<template>
  <div class="photoList">
    <!-- 写真一覧 -->
    <PhotoListContents></PhotoListContents>
    <div class="logout-btn-block" v-on:click="pageMove('Login', false)">
      <div class="logout-btn">
        <img class="logout-btn-img" alt="logout" src="../assets/logout.png">
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import PhotoListContents from '@/components/PhotoListContents.vue'

export default {
  name: 'PhotoList',
  components: {
    PhotoListContents
  },
}
</script>

<style scoped>
.logout-btn-block {
  width: 55px;
  height: 55px;
  background-color: rgb(255, 255, 255);
  color: rgba(74, 162, 214, 0.973);
  border: 1px solid rgba(74, 162, 214, 0.973);
  border-radius: 50%;
  text-decoration: none;
  font-size: 10px;
  font-weight: bold;
  position: fixed;
  bottom: 20px; 
  right: 20px;
  z-index: 10;
}
.logout-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}
.logout-btn-img {
  width:100%;
  height:100%;
  object-fit:cover;
}
</style>

<template>
  <div class="dashboard-container app-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <div class="dashboard-text">⚒️博客后台系统</div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// TODO 添加数据显示：有多少篇文章，有多少条留言，有多少个项目..
export default {
  name: 'Dashboard'
  // computed: {
  //   ...mapGetters([
  //     'name'
  //   ])
  // }
}
</script>

<style lang="scss" scoped>
.dashboard-container{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
}
.dashboard-text{
  font-weight: lighter;
  font-size: 46px;
  color: #333;
}
</style>

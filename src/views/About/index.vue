<template>
  <div class="about-container app-container">
    <div class="block">
      <p>关于我</p>
      <el-input v-model="input" placeholder="请输入内容" width="50vw" :disabled="!editMode" />
      <div>
        <el-button type="primary" plain @click="handleEditButtonClick">{{ dispalyContent }}</el-button>
        <el-button v-show="editMode" type="warning" plain @click="handleCancelButtonClick">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAboutUrl, setAboutUrl } from '@/api/about'

export default {
  data() {
    return {
      input: '',
      dispalyContent: '编辑',
      editMode: false,
      originUrl: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const resp = await getAboutUrl()
      this.input = resp.data
      // 存储
      this.originUrl = { ...resp.data }
    },
    handleEditButtonClick() {
      if (this.editMode) {
        // 如果是编辑模式,提交表单
        this.dispalyContent = '编辑'
        setAboutUrl(this.input).then(() => {
          this.$message({
            type: 'success',
            message: '修改成功!',
            center: true
          })
          this.fetchData()
        }).catch(error => {
          this.$message({
            type: 'danger',
            message: error,
            center: true
          })
        })
        this.editMode = !this.editMode
      } else {
        // 如果原本不是编辑模式,进入编辑模式
        this.dispalyContent = '完成'
        this.editMode = !this.editMode
      }
    },
    handleCancelButtonClick() {
      // 退出编辑模式
      this.editMode = false
      this.dispalyContent = '编辑'
      this.input = this.originUrl
      this.$message({
        type: 'info',
        message: '取消修改',
        center: true
      })
    }
  }
}
</script>

<style scoped>
.block{
  display: flex;
  flex-direction: column;
  width: 50%;
}
.block>*{
  margin: 15px 0;
  flex: 0 0 auto;
}
</style>

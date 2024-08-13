<template>
  <div class="project-increase-container app-container">
    <!-- 项目标题 -->
    <div class="block">
      <p>项目标题<label style="color: lightcoral;">*</label></p>
      <el-input v-model="form.name" placeholder="请输入内容" />
    </div>

    <!-- 项目描述 -->
    <div class="block">
      <p>项目描述<label style="color: lightcoral;">*</label></p>
      <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入内容" />
    </div>

    <!-- Url -->
    <div class="block">
      <p>项目Url地址</p>
      <el-input v-model="form.url" placeholder="请输入内容" />
    </div>

    <!-- Github -->
    <div class="block">
      <p>项目Github仓库<label style="color: lightcoral;">*</label></p>
      <el-input v-model="form.github" placeholder="请输入内容" />
    </div>

    <!-- 预览图片 -->
    <div class="lastRow">
      <div class="block">
        <p>预览图片<label style="color: lightcoral;">*</label></p>
        <Upload v-model="form.thumb" style="align-items: start;" />
      </div>

      <!-- 项目排序 -->
      <div class="block">
        <p>等级排序<label style="color: lightcoral;">*</label></p>
        <div class="content">
          <el-select v-model="form.order" placeholder="请选择排序等级">
            <el-option label="Lv-1" :value="1" />
            <el-option label="Lv-2" :value="2" />
            <el-option label="Lv-3" :value="3" />
            <el-option label="Lv-4" :value="4" />
            <el-option label="Lv-5" :value="5" />
          </el-select>

          <!-- 发布按钮 -->
          <el-button style="width: 100px;" type="primary" plain @click="handlePrimaryProject">发布</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addProject } from '@/api/project'
import Upload from '@/components/Upload'

export default {
  components: {
    Upload
  },
  data() {
    return {
      form: {
        name: '',
        thumb: '',
        order: '',
        description: '',
        url: '',
        github: ''
      }
    }
  },
  methods: {
    /** 发布项目 */
    async handlePrimaryProject() {
      if (this.form.name && this.form.description && this.form.order && this.form.github && this.form.thumb) {
        const data = { ...this.form }
        data.description = data.description.split(',')
        await addProject(data)
        this.$message({
          type: 'success',
          message: '发布成功!',
          center: true
        })
        this.$router.push('/Project/ProjectList')
      } else {
        this.$message({
          type: 'warning',
          message: '请填写必要内容!',
          center: true
        })
        return
      }
    }
  }
}
</script>

<style scoped>
.content {
  height: 178px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.lastRow {
  display: flex;
}

.lastRow>* {
  margin-right: 50px;
}
</style>

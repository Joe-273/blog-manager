<template>
  <div class="upload-container">
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :headers="headers"
    >
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    headers() {
      return { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
    }
  },
  methods: {
    handleAvatarSuccess(resp) {
      if (!resp.code && resp.data) {
        this.$emit('input', resp.data)
        this.$message.success({
          message: '图片成功上传至服务器!',
          center: true
        })
      }
    }
  }
}
</script>

<style  scoped>
.upload-container{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-uploader .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: cover;
    border-radius: 6px;
  }
</style>

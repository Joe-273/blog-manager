<template>
  <div class="setting-container app-container">
    <!-- Part 1 -->
    <el-row class="line">
      <el-col :span="6" style="margin-right: 35px;">
        <!-- 网站标题 -->
        <div class="block">
          <p>网站标题<label style="color: lightcoral;">*</label></p>
          <el-input v-model="form.siteTitle" placeholder="请输入内容" :disabled="!editMode" />
        </div>
        <div class="block">
          <p>个人头像<label style="color: lightcoral;">*</label></p>
          <el-input v-model="form.avatar" placeholder="请输入个人头像Url（或上传图片）" :disabled="!editMode" />
        </div>
        <div class="block">
          <p>网站图标<label style="color: lightcoral;">*</label></p>
          <el-input v-model="form.favicon" placeholder="请输入网站图标Url（或上传图片）" :disabled="!editMode" />
        </div>
      </el-col>

      <el-col :span="5">
        <!-- 个人头像 -->
        <div class="block">
          <p>个人头像</p>
          <Upload v-model="form.avatar" :disabled="!editMode" style="align-items: start;" />
        </div>
      </el-col>

      <el-col :span="5">
        <!-- 网站图标 -->
        <div class="block">
          <p>网站图标</p>
          <Upload v-model="form.favicon" :disabled="!editMode" style="align-items: start;" />
        </div>
      </el-col>
    </el-row>

    <!-- Part 2 -->
    <el-row class="line">
      <el-col :span="6" style="margin-right: 35px;">
        <div class="block">
          <p>QQ账号<label style="color: lightcoral;">*</label></p>
          <el-input v-model="form.qq" placeholder="请输入内容" :disabled="!editMode" />
        </div>
        <div class="block">
          <p>微信号<label style="color: lightcoral;">*</label></p>
          <el-input v-model="form.weixin" placeholder="请输入内容" :disabled="!editMode" />
        </div>
      </el-col>

      <el-col :span="5">
        <!-- qq -->
        <div class="block">
          <p>QQ二维码(可选)</p>
          <Upload v-model="form.qqQrCode" :disabled="!editMode" style="align-items: start;" />
        </div>
      </el-col>

      <el-col :span="5">
        <!-- 微信 -->
        <div class="block">
          <p>微信二维码(可选)</p>
          <Upload v-model="form.weixinQrCode" :disabled="!editMode" style="align-items: start;" />
        </div>
      </el-col>
    </el-row>

    <!-- Part 3 -->
    <el-row>
      <el-col :span="12">
        <!-- github -->
        <div class="block">
          <p>GitHub ID<label style="color: lightcoral;">*</label></p>
          <el-input v-model="form.githubName" placeholder="请输入内容" :disabled="!editMode" />
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <div class="block">
          <p>GitHub 网址<label style="color: lightcoral;">*</label></p>
          <el-input v-model="form.github" placeholder="请输入内容" :disabled="!editMode" />
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <!-- 邮箱 -->
        <div class="block" style="margin: 0;">
          <p>个人邮箱<label style="color: lightcoral;">*</label></p>
          <el-input v-model="form.mail" placeholder="请输入内容" :disabled="!editMode" />
        </div>
      </el-col>
    </el-row>

    <el-row class="line">
      <el-col :span="12">
        <div class="block" style="margin: 0;">
          <p>备案号<label style="color: lightcoral;">*</label></p>
          <el-input v-model="form.icp" placeholder="请输入内容" :disabled="!editMode" />
        </div>
      </el-col>
    </el-row>

    <!-- Part 4 -->
    <div>
      <el-button type="primary" plain @click="handleEditButtonClick">{{ dispalyContent }}</el-button>
      <el-button v-show="editMode" type="warning" plain @click="handleCancelButtonClick">取消</el-button>
    </div>

  </div>
</template>

<script>
import { setGlobalSetting, getGlobalSetting } from '@/api/setting'
import Upload from '@/components/Upload'

export default {
  components: {
    Upload
  },
  data() {
    return {
      form: '',
      originForm: '',
      editMode: false,
      dispalyContent: '编辑'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const resp = await getGlobalSetting()
      this.form = resp.data
      this.originForm = { ...resp.data }
    },
    /** 点击编辑/完成 */
    handleEditButtonClick() {
      if (this.editMode) {
        // 如果是编辑模式,提交表单
        this.dispalyContent = '编辑'
        setGlobalSetting(this.form).then(() => {
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
    /** 点击取消 */
    handleCancelButtonClick() {
      // 退出编辑模式
      this.editMode = false
      this.dispalyContent = '编辑'
      this.form = this.originForm
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
  .line{
    width: 100%;
    padding-bottom: 35px;
    margin-bottom: 15px;
    border-bottom: 1px solid #DCDFE6 ;
  }

</style>

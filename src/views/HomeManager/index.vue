<template>
  <div class="home-manager-container app-container">
    <!-- 数据表格 -->
    <!-- 数据表格 -->
    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="data"
      border
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        width="50"
        align="center"
      >
        <template slot-scope="scope">
          <div class="column">
            <el-button
              v-show="scope.$index !== 0"
              size="mini"
              icon="el-icon-arrow-up"
              circle
              type="text"
              @click="handleItemUp(scope.$index)"
            />
            {{ scope.$index + 1 }}
            <el-button
              v-show="scope.$index < data.length-1"
              size="mini"
              icon="el-icon-arrow-down"
              circle
              type="text"
              @click="handleItemDown(scope.$index)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="标题"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        width="350"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column
        label="占位图预览"
        align="center"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.midImg"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="原图预览"
        align="center"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.bigImg"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑内容" :hide-after="1500" placement="top" :open-delay="750">
            <el-button type="primary" plain icon="el-icon-edit" circle @click="handleEditButtonClick(data[scope.$index])" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除此项" :hide-after="1500" placement="top" :open-delay="750">
            <el-button type="danger" plain icon="el-icon-delete" circle @click="handleDeleteButtonClick(data[scope.$index])" />
          </el-tooltip>

        </template>
      </el-table-column>

    </el-table>

    <!-- 添加banner -->
    <div class="block">
      <el-button
        type="primary"
        round
        plain
        icon="el-icon-circle-plus-outline"
        @click="handleAddBanner"
      >
        添加Banner
      </el-button>
    </div>

    <!-- Dialog -->
    <!-- Dialog -->
    <!-- Dialog -->
    <el-dialog title="编辑内容" :visible.sync="dialogFormVisible" top="8vh">
      <el-form :model="form">

        <!-- 标题 -->
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>

        <!-- 描述 -->
        <el-form-item label="描述">
          <el-input v-model="form.description" placeholder="请输入标语描述" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" />
        </el-form-item>

        <el-form-item label="占位图">
          <el-input v-model="form.midImg" placeholder="请输入占位图Url（或上传图片）" />
        </el-form-item>

        <el-form-item label="原图">
          <el-input v-model="form.bigImg" placeholder="请输入原图Url（或上传图片）" />
        </el-form-item>

        <!-- 图片 -->
        <el-row class="upload row-bg" type="flex" justify="space-around">
          <el-col :span="8">
            <!-- 占位图 -->
            <p style="">占位图</p>
            <Upload v-model="form.midImg" :value="form.midImg" upload-title="占位图" />
          </el-col>

          <el-col :span="8">
            <!-- 原图 -->
            <p>原图</p>
            <Upload v-model="form.bigImg" :value="form.bigImg" upload-title="原图" />
          </el-col>
        </el-row>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleBannerConfirmEdit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getBanner, setBanner } from '@/api/banner'
import Upload from '@/components/Upload'

export default {
  components: {
    Upload
  },
  data() {
    return {
      loading: false,
      data: [],
      // Dialog数据
      dialogFormVisible: false,
      // 表单项存储数据
      form: {
        midImg: '',
        bigImg: '',
        title: '',
        description: ''
      },
      // 对Bannder进行操作的模式
      mode: 'edit'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /** 排序按钮 */
    handleItemUp(currentIndex) {
      if (currentIndex === 0) {
        return
      }
      [this.data[currentIndex], this.data[currentIndex - 1]] = [this.data[currentIndex - 1], this.data[currentIndex]]
      setBanner(this.data).then(resp => {
        this.data = resp.data
      })
    },
    handleItemDown(currentIndex) {
      if (currentIndex >= this.data.length - 1) {
        return
      }
      [this.data[currentIndex], this.data[currentIndex + 1]] = [this.data[currentIndex + 1], this.data[currentIndex]]
      setBanner(this.data).then(resp => {
        this.data = resp.data
      })
    },

    /* 点击添加Banner按钮 */
    handleAddBanner() {
      // 初始化表单项
      this.form = {
        midImg: '',
        bigImg: '',
        title: '',
        description: ''
      }
      // 设置添加模式
      this.mode = 'add'

      this.dialogFormVisible = true
    },

    /* 点击删除按钮 */
    handleDeleteButtonClick(item) {
      let newData = [...this.data]
      newData = newData.filter(i => i.id !== item.id)

      this.$confirm('此操作将永久删除该Banner, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setBanner(newData).then(resp => {
          this.data = resp.data
          this.$message({
            type: 'success',
            message: '删除成功!',
            center: true
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          center: true
        })
      })
    },

    /* 确认 编辑/添加 事件*/
    handleBannerConfirmEdit() {
      let newData = [...this.data]
      let message = ''

      if (this.mode === 'edit') {
        // 编辑模式: 修改存在的数组项
        newData.map(i => {
          if (this.form.id && (i.id === this.form.id)) {
            return this.form
          }
        })
        message = '修改成功!'
      } else if (this.mode === 'add') {
        // 添加模式: 拓展原数组
        newData.push(this.form)
        message = '添加成功!'
      } else if (this.mode === 'del') {
        // 删除模式: 删除数组项
        newData = newData.filter(i => i.id !== this.form.id)
        message = '删除成功!'
      }

      // 发送POST请求
      setBanner(newData).then(resp => {
        this.data = resp.data
        this.$message.success({
          message,
          center: true
        })
        this.dialogFormVisible = false
        this.dialogVisible = false
      })
    },

    /* 点击编辑按钮 */
    handleEditButtonClick(item) {
      this.form = item
      // 设置编辑模式
      this.mode = 'edit'

      // 打开对话框
      this.dialogFormVisible = true
    },

    // 获取数据
    fetchData() {
      this.loading = true
      getBanner().then(resp => {
        this.data = resp.data
        this.loading = false
      })
    }

  }
}
</script>

<style  scoped>
.block{
  width: 100%;
  padding: 20px 0 ;
  text-align: center;
  border: 1px solid #EBEEF5 ;
  border-top: none;
}
.upload{
  text-align: center;
}
.column{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.column  *{
  margin: 0;
  border: none;
  background: transparent;
}
</style>

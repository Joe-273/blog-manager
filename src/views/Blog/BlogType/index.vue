<template>
  <div class="blog-type-container app-container">
    <!-- 输入框 -->
    <div style="margin: 15px 0;width: 40%;;min-width: 300px; display: flex; ">
      <el-input v-model="input" placeholder="请输入要添加的分类名称" class="input-with-select">
        <el-select slot="prepend" v-model="select" style="width: 130px;" placeholder="选择分类等级">
          <el-option label="Lv-1" value="1" />
          <el-option label="Lv-2" value="2" />
          <el-option label="Lv-3" value="3" />
          <el-option label="Lv-4" value="4" />
          <el-option label="Lv-5" value="5" />
        </el-select>
      </el-input>
      <el-button icon="el-icon-plus" plain type="primary" style="margin-left: 5px;" @click="handleAddClick">添加</el-button>
    </div>

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
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        label="分类等级"
        align="center"
      >
        <template slot-scope="scope">
          Lv-{{ scope.row.order }}
        </template>
      </el-table-column>

      <el-table-column
        label="博客类别"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column
        label="文章数量"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.articleCount }}
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

    <!-- Dialog -->
    <el-dialog title="编辑分类信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.name" style="width: 130px;" />
        </el-form-item>

        <el-form-item label="排序等级">
          <el-select v-model="form.order" style="width: 130px;" placeholder="选择分类等级">
            <el-option label="Lv-1" :value="1" />
            <el-option label="Lv-2" :value="2" />
            <el-option label="Lv-3" :value="3" />
            <el-option label="Lv-4" :value="4" />
            <el-option label="Lv-5" :value="5" />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleBannerConfirmEdit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getOneBlogCategory,
  getBlogCategories,
  deleteBlogCategory,
  addBlogCategory,
  changeBlogCategory
} from '@/api/blogType'

export default {
  data() {
    return {
      data: [],
      input: '',
      select: '',
      dialogFormVisible: false,
      loading: false,
      form: {
        order: '',
        name: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /** 编辑按钮 */
    async handleEditButtonClick({ id }) {
      const resp = await getOneBlogCategory(id)
      this.form = resp.data
      this.dialogFormVisible = true
    },
    /** 确认编辑 */
    async handleBannerConfirmEdit() {
      await changeBlogCategory({ categoryId: this.form.id, data: this.form })
      this.fetchData()
      this.$message({
        type: 'success',
        message: '修改成功!',
        center: true
      })
      this.dialogFormVisible = false
      // 初始化form
      this.form = {
        order: '',
        name: ''
      }
    },

    /** 删除 */
    handleDeleteButtonClick(item) {
      this.$confirm('此操作将删除该分类,且该分类下所有文章的分类状态将被设置为"全部", 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteBlogCategory(item.id)
        this.fetchData()
        this.$message({
          message: '删除成功!',
          type: 'success',
          center: true
        })
        this.$message({
          type: 'success',
          message: '删除成功!',
          center: true
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          center: true
        })
      })
    },
    /** 添加 */
    async handleAddClick() {
      if (!this.input) {
        this.$message({
          message: '请先输入分类名称',
          type: 'warning',
          center: true
        })
        return
      }
      if (!this.select) {
        this.$message({
          message: '请先选择分类等级',
          type: 'warning',
          center: true
        })
        return
      }

      await addBlogCategory({ name: this.input, order: this.select })
      this.input = ''
      this.fetchData()
      this.$message({
        message: '添加成功!',
        type: 'success',
        center: true
      })
    },
    /** 获取数据 */
    async fetchData() {
      this.loading = true
      const resp = await getBlogCategories()
      this.loading = false
      this.data = resp.data
    }
  }
}
</script>

<style  scoped>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>

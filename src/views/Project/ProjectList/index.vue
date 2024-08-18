<template>
  <div class="project-list-container app-container">
    <!-- 数据表格 -->
    <!-- 数据表格 -->
    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="data"
      border
      style="width: 100%"
    >
      <!--  -->
      <el-table-column
        label="序号"
        width="50"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <!--  -->

      <el-table-column
        label="排序等级"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          Lv-{{ scope.row.order }}
        </template>
      </el-table-column>

      <el-table-column
        label="项目名称"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <a slot="reference" href="#" target="_blank" @click.prevent="handleGoToProject(scope.row)">{{ scope.row.name }}</a>
        </template>
      </el-table-column>
      <!--  -->
      <el-table-column
        label="项目描述"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.description.toString() }}
        </template></el-table-column>

      <el-table-column
        label="预览图"
        align="center"
        width="160"
        :preview-src-list="srcList"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.thumb"
            fit="cover"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="220"
        align="center"
      >
        <template slot-scope="scope">
          <div class="flexBlock">
            <el-tooltip class="item" effect="dark" content="Github链接" :hide-after="1500" placement="top" :open-delay="750">
              <el-button plain class="github" icon="iconfont icon-github" circle @click="handleGithubButtonClick(data[scope.$index])" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑内容" :hide-after="1500" placement="top" :open-delay="750">
              <el-button type="primary" plain icon="el-icon-edit" circle @click="handleEditButtonClick(data[scope.$index])" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除此项" :hide-after="1500" placement="top" :open-delay="750">
              <el-button type="danger" plain icon="el-icon-delete" circle @click="handleDeleteButtonClick(data[scope.$index])" />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

    </el-table>

    <!-- Dialog -->
    <!-- Dialog -->
    <!-- Dialog -->
    <el-dialog title="编辑项目" top="10vh" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="项目名称">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>

        <el-form-item label="项目名称描述(每一段描述使用英文逗号分隔)">
          <el-input v-model=" form.description" autocomplete="off" />
        </el-form-item>

        <el-form-item label="项目链接">
          <el-input v-model="form.url" autocomplete="off" />
        </el-form-item>

        <el-form-item label="Github地址">
          <el-input v-model="form.github" autocomplete="off" />
        </el-form-item>

        <el-row class="lastRow">
          <el-col :span="9">
            <!-- 预览图 -->
            <p>预览图</p>
            <Upload v-model="form.thumb" style=" align-items: flex-start;" />
          </el-col>
          <el-col :span="12">
            <!-- 排序等级 -->
            <p>排序等级</p>
            <el-select v-model="form.order" placeholder="请选择排序等级">
              <el-option label="Lv-1" :value="1" />
              <el-option label="Lv-2" :value="2" />
              <el-option label="Lv-3" :value="3" />
              <el-option label="Lv-4" :value="4" />
              <el-option label="Lv-5" :value="5" />
            </el-select>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleProjectConfirmEdit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getProjects, deleteProject, editProject } from '@/api/project'
import Upload from '@/components/Upload'

export default {
  components: {
    Upload
  },
  data() {
    return {
      loading: false,
      data: [], // 远程获取的数据
      srcList: [], // 预览图链接数组
      form: '',

      dialogFormVisible: false
    }
  },
  async created() {
    this.fetchData()
  },
  methods: {
    /** 编辑 */
    async handleEditButtonClick(project) {
      this.dialogFormVisible = true
      this.form = project
      this.form.description = this.form.description.toString()
    },
    /** 确认编辑 */
    async handleProjectConfirmEdit() {
      const data = { ...this.form }
      data.description = this.form.description.split(',')

      await editProject(data)

      this.dialogFormVisible = false
      this.fetchData()
      this.$message({
        type: 'success',
        message: '修改成功!',
        center: true
      })
    },
    /** 删除 */
    handleDeleteButtonClick(project) {
      this.$confirm('此操作将删除该项目链接, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteProject(project.id)
        this.fetchData()
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
    handleGithubButtonClick(project) {
      window.open(project.github, '_blank')
    },
    handleGoToProject(project) {
      console.log(project)
      // window.open(project.url, '_blank')
    },

    async fetchData() {
      this.loading = true
      const { data } = await getProjects()
      this.loading = false
      this.data = data

      // 添加完善地址链接的地址到srcList
      this.data.forEach(i => {
        this.srcList.push(i.thumb)
      })
    }
  }
}
</script>

<style scoped>
.flexBlock{
  display: flex;
  justify-content: center;
  align-items: center;
}
.github{
  padding: 10px;
}
</style>

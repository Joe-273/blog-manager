<template>
  <div class="comment-manager-container app-container">
    <!-- 数据表格 -->
    <!-- 数据表格 -->
    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="data"
      border
      style="width: 100%"
    >
      <!-- 序号 -->
      <el-table-column
        label="序号"
        width="50"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.$index + 1 + (currentPage-1)*eachPage }}
        </template>
      </el-table-column>

      <!-- 头像 -->
      <el-table-column
        label="头像"
        align="center"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 40px; height: 40px"
            :src="scope.row.avatar"
            fit="cover"
            :preview-src-list="srcList"
          />
        </template>
      </el-table-column>

      <!-- 昵称 -->
      <el-table-column
        label="昵称"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>

      <!-- 评论内容 -->
      <el-table-column
        label="评论内容"
        width="280"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <!-- 所属文章 -->
      <el-table-column
        label="所属文章"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.blog.title }}
        </template>
      </el-table-column>

      <!-- 评论时间 -->
      <el-table-column
        label="评论时间"
        align="center"
        :width="240"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.createDate,true) }}
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="删除评论" :hide-after="1500" placement="top" :open-delay="750">
            <el-button type="danger" plain icon="el-icon-delete" circle @click="handleDeleteButtonClick(data[scope.$index])" />
          </el-tooltip>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <!-- 分页 -->
    <!-- 分页 -->
    <el-pagination
      style="margin: 20px 0;"
      background
      layout="prev, pager, next,total,-> ,sizes,jumper"
      :total="count"
      :page-sizes="[5,10,15,20]"
      :page-size="eachPage"
      :current-page.sync="pagerCurrentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
    />

  </div>
</template>

<script>
import { getComment, deleteComment } from '@/api/comment'
import formatTime from '@/utils/formatDate.js'
export default {
  data() {
    return {
      loading: false,
      data: [], // 远程获取的数据
      srcList: [], // 预览图链接数组

      // 分页数据
      eachPage: 10, // 每一页显示的条数
      currentPage: 1, // 当前页码,默认第一页
      totalPage: 0, // 总页数
      count: 0, // 总数据条数
      pagerCurrentPage: 1 // 分页栏的当前页码
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /** 分页函数 */
    handleSizeChange(eachPage) {
      this.eachPage = parseInt(eachPage)
      this.currentPage = 1
      this.pagerCurrentPage = 1
      this.fetchData()
    },
    handleCurrentChange(pageNumber) {
      this.currentPage = parseInt(pageNumber)
      this.fetchData()
    },
    handlePrevClick() {
      this.currentPage--
    },
    handleNextClick() {
      this.currentPage++
    },

    /** 删除评论 */
    handleDeleteButtonClick(commentInfo) {
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteComment(commentInfo.id)
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

    formatTime,
    async fetchData() {
      this.loading = true
      const resp = await getComment(this.currentPage, this.eachPage)
      this.data = resp.data.rows
      this.loading = false

      // 添加完善地址链接的地址到srcList
      this.data.forEach(i => {
        this.srcList.push(i.avatar)
      })

      // 分页数据
      this.count = resp.data.total
      this.totalPage = Math.ceil(this.count / this.eachPage)
      if (this.currentPage > this.totalPage) {
        // 删除文章时,当最后一页的最后一条数据被删除后,总页码数-1,当前页码数就会大于总页码数
        this.currentPage = this.totalPageq
        this.fetchData()
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>

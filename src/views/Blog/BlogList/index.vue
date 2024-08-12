<template>
  <div class="blog-list-container app-container">
    <!-- 数据表格 -->
    <!-- 数据表格 -->
    <!-- 数据表格 -->
    <el-table
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
          {{ scope.$index + 1 + (currentPage-1)*eachPage }}
        </template>
      </el-table-column>
      <!--  -->
      <el-table-column
        label="文章名称"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="预览"
            width="200"
            trigger="hover"
          >
            <el-image
              style="width: 180px; height: 180px"
              :src="scope.row.thumb"
              fit="cover"
              :preview-src-list="srcList"
            />
            <a slot="reference" href="#" target="_blank" @click.prevent="handleGoToBlog(scope.row)">{{ scope.row.title }}</a>
          </el-popover>
        </template>
      </el-table-column>
      <!--  -->
      <el-table-column
        label="文章描述"
        width="340"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <!--  -->
      <el-table-column
        label="浏览数"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.scanNumber }}
        </template>
      </el-table-column>
      <el-table-column
        label="评论量"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.commentNumber }}
        </template>
      </el-table-column>
      <el-table-column
        label="所属分类"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.category.name }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        align="center"
        :width="240"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.createDate,true) }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑内容" :hide-after="1500" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle @click="handleEditButtonClick(data[scope.$index])" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除此项" :hide-after="1500" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDeleteButtonClick(data[scope.$index])" />
          </el-tooltip>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin: 20px 0;"
      background
      layout="prev, pager, next,total,-> ,sizes,jumper"
      :total="count"
      :page-sizes="[5,10,15,20]"
      :page-size="eachPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
    />

  </div>
</template>

<script>
import { getBlogByPager, deleteBlogByPager } from '@/api/blog'
import { FRONT_ENT_URL } from '@/config'
import formatTime from '@/utils/formatDate.js'

export default {
  data() {
    return {
      data: [], // 远程获取的数据
      srcList: [], // 预览图链接数组

      // 分页数据
      eachPage: 10, // 每一页显示的条数
      currentPage: 1, // 当前页码,默认第一页
      totalPage: 0, // 总页数
      count: 0 // 总数据条数
      // pagerCurrentPage: 1 // 分页栏的当前页码

    }
  },
  async created() {
    await this.fetchData()
  },
  methods: {
    handleSizeChange(eachPage) {
      this.eachPage = parseInt(eachPage)
      this.currentPage = 1
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

    /* 点击删除按钮 */
    handleDeleteButtonClick(blogInfo) {
      this.$confirm('此操作将永久删除该文章和其所有评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteBlogByPager(blogInfo.id)
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
    /* 点击编辑按钮 */
    handleEditButtonClick() {},

    handleGoToBlog(blogInfo) {
      window.open(`${FRONT_ENT_URL}/blog/detail/${blogInfo.id}`)
    },

    // 格式化日期
    formatTime,

    async fetchData() {
      const resp = await getBlogByPager(this.currentPage, this.eachPage)
      this.data = resp.data.rows

      // 添加完善地址链接的地址到srcList
      this.data.forEach(i => {
        this.srcList.push(i.thumb)
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

<style lang="less" scoped></style>

<template>
  <div class="blog-list-container app-container">
    <!-- 筛选 -->
    <div class="firstRow">
      <div class="leftPart">
        <el-select
          v-model="chooseCategories"
          multiple
          filterable
          allow-create
          default-first-option
          style="flex: 3"
          placeholder="请选择显示的分类"
        >
          <el-option
            v-for="item in categories"
            :key="item.id"
            :value="item.id"
            :label="item.name"
            style="display: flex; justify-content: space-between"
          >
            <span>
              {{ item.name }}
            </span>
            <span style="padding-right: 10%; color: #ccc; font-size: 14px">
              {{ item.articleCount }}篇
            </span>
          </el-option>
        </el-select>
        <el-input
          v-model="keyword"
          style="flex: 1"
          @blur="handleBlur"
          @focus="handleFocus"
          placeholder="请输入关键词"
        />
        <el-button
          icon="el-icon-search"
          type="primary"
          plain
          @click="handleFilteBlog"
        />
      </div>
      <div class="rightPart">
        <el-button type="danger" plain @click="handleDeletChecked"
          >删除选中</el-button
        >
      </div>
    </div>

    <!-- 数据表格 -->
    <!-- 数据表格 -->
    <!-- 数据表格 -->
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="data"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- 序号 -->
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (currentPage - 1) * eachPage }}
        </template>
      </el-table-column>
      <!-- 文章名称 -->
      <el-table-column label="文章名称" width="160" align="center">
        <template slot-scope="scope">
          <el-popover placement="top-start" trigger="hover">
            <el-image
              style="width: 180px; height: 180px"
              :src="scope.row.thumb"
              fit="cover"
              :preview-src-list="srcList"
              v-if="scope.row.thumb !== ''"
            />
            <a
              slot="reference"
              href="#"
              target="_blank"
              @click.prevent="handleGoToBlog(scope.row)"
              >{{ scope.row.title }}</a
            >
          </el-popover>
        </template>
      </el-table-column>
      <!-- 文章描述 -->
      <el-table-column label="文章描述" align="left">
        <template slot-scope="scope">
          <span style="white-space: pre-wrap">{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <!-- 浏览数 -->
      <el-table-column label="浏览数" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.scanNumber }}
        </template>
      </el-table-column>
      <!-- 评论量 -->
      <el-table-column label="评论量" align="center" width="80">
        <template slot-scope="scope">
          {{ scope.row.commentNumber }}
        </template>
      </el-table-column>
      <!-- 所属分类 -->
      <el-table-column label="所属分类" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.category ? scope.row.category.name : "无分类" }}
        </template>
      </el-table-column>
      <!-- 创建日期 -->
      <el-table-column label="创建日期" align="center" :width="100">
        <template slot-scope="scope">
          {{ formatTime(scope.row.createDate, true) }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑内容"
            :hide-after="1500"
            placement="top"
            :open-delay="750"
          >
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              circle
              @click="handleEditButtonClick(data[scope.$index])"
            />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除此项"
            :hide-after="1500"
            placement="top"
            :open-delay="750"
          >
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              circle
              @click="handleDeleteButtonClick(data[scope.$index])"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- checkbox -->
      <el-table-column
        type="selection"
        align="center"
        select="isSelected"
        prop="id"
      />
    </el-table>

    <!-- 分页 -->
    <!-- 分页 -->
    <!-- 分页 -->
    <el-pagination
      style="margin: 20px 0"
      background
      layout="prev, pager, next,total,-> ,sizes,jumper"
      :total="count"
      :page-sizes="[5, 10, 15, 20]"
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
import { getBlogByPager, deleteBlogByPager } from "@/api/blog";
import { FRONT_ENT_URL } from "@/config";
import { getBlogCategories } from "@/api/blogType";

import formatTime from "@/utils/formatDate.js";

export default {
  data() {
    return {
      loading: false,
      data: [], // 远程获取的数据
      srcList: [], // 预览图链接数组
      categories: [], // 分类数据
      chooseCategories: [], // 筛选的分类
      keywordOnFocus: "",
      keyword: "", // 关键字筛选
      selectionArray: [], // 批量选中的

      // 分页数据
      eachPage: 10, // 每一页显示的条数
      currentPage: 1, // 当前页码,默认第一页
      totalPage: 0, // 总页数
      count: 0, // 总数据条数
      pagerCurrentPage: 1, // 分页栏的当前页码
    };
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    /** 批量删除 */
    handleSelectionChange(value) {
      this.selectionArray = value;
    },
    handleDeletChecked() {
      if (this.selectionArray.length === 0) {
        // 未选中
        this.$message({
          type: "warning",
          message: "你还没有任何选中项",
          center: true,
        });
        return;
      }

      this.$confirm("此操作为危险操作, 三思而后行！", "警告", {
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(async () => {
          for (let i = 0; i < this.selectionArray.length; i += 3) {
            const batch = this.selectionArray.slice(i, i + 3);
            await Promise.all(
              batch.map((item) => {
                deleteBlogByPager(item.id);
              })
            );
          }
          setTimeout(() => {
            this.fetchData();
            this.$message({
              type: "success",
              message: "删除成功！",
              center: true,
            });
          }, 1500);
        })
        .catch(() => {
          this.$refs.multipleTable.clearSelection();
          this.$message({
            type: "info",
            message: "那没事了~",
            center: true,
          });
        });
    },

    /** 筛选博客 */
    async handleFilteBlog() {
      await this.fetchData();
    },
    handleFocus() {
      this.keywordOnFocus = this.keyword;
    },
    async handleBlur() {
      if (this.keyword === "" && this.keyword !== this.keywordOnFocus) {
        // 清空关键字的
        await this.fetchData();
      }
    },

    /** 分页函数 */
    handleSizeChange(eachPage) {
      this.eachPage = parseInt(eachPage);
      this.currentPage = 1;
      this.pagerCurrentPage = 1;
      this.fetchData();
    },
    handleCurrentChange(pageNumber) {
      this.currentPage = parseInt(pageNumber);
      this.fetchData();
    },
    handlePrevClick() {
      this.currentPage--;
    },
    handleNextClick() {
      this.currentPage++;
    },

    /* 点击删除按钮 */
    handleDeleteButtonClick(blogInfo) {
      this.$confirm("此操作将永久删除该文章和其所有评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deleteBlogByPager(blogInfo.id);
          this.fetchData();
          this.$message({
            type: "success",
            message: "删除成功!",
            center: true,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            center: true,
          });
        });
    },

    /* 点击编辑按钮 */
    handleEditButtonClick(blogInfo) {
      this.$router.push(`/Blog/EditBlog/${blogInfo.id}`);
    },

    /** 超链接 */
    handleGoToBlog(blogInfo) {
      window.open(`${FRONT_ENT_URL}/blog/detail/${blogInfo.id}`);
    },

    // 格式化日期
    formatTime,

    // 请求数据
    async fetchData() {
      try {
        this.loading = true;
        if (this.categories.length === 0) {
          // 第一次请求
          this.loading = true;
          const [resp, categories] = await Promise.all([
            getBlogByPager(this.currentPage, this.eachPage),
            getBlogCategories(),
          ]);
          this.data = resp.data.rows;
          this.categories = categories.data;
          this.count = resp.data.total;
        } else if (
          this.keyword === "" &&
          (this.chooseCategories.length === this.categories.length ||
            this.chooseCategories.length === 0)
        ) {
          // 没有进行筛选
          const resp = await getBlogByPager(this.currentPage, this.eachPage);
          this.data = resp.data.rows;
          this.count = resp.data.total;
        } else if (this.chooseCategories.length === 0 && this.keyword !== "") {
          // 仅关键词筛选
          const resp = await getBlogByPager(
            this.currentPage,
            this.eachPage,
            -1,
            this.keyword
          );
          this.data = resp.data.rows;
          this.count = resp.data.total;
        } else {
          // 有分类，进行筛选
          const result = await Promise.all(
            this.chooseCategories.map((id) =>
              getBlogByPager(
                this.currentPage,
                this.eachPage,
                id || -1,
                this.keyword
              )
            )
          );
          this.data = [];
          this.count = 0;
          result.map((item) => {
            this.data.push(...item.data.rows);
            this.count += item.data.total;
          });
        }
        // 数据都拿到了

        // 添加完善地址链接的地址到srcList
        this.data.forEach((i) => {
          this.srcList.push(i.thumb);
        });

        this.totalPage = Math.ceil(this.count / this.eachPage);
        if (this.currentPage > this.totalPage) {
          // 删除文章时,当最后一页的最后一条数据被删除后,总页码数-1,当前页码数就会大于总页码数
          this.currentPage = this.totalPage;
          this.fetchData();
        }
      } catch (error) {
        // 错误处理
        console.error("Error fetching blog data and categories:", error);
        throw error;
        KJ;
      } finally {
        this.loading = false;
      }
      // try {
      //   this.loading = true
      //   const [resp, categories] = await Promise.all([
      //     getBlogByPager(this.currentPage, this.eachPage),
      //     getBlogCategories()
      //   ])

      //   this.data = resp.data.rows
      //   this.categories = categories.data

      //   // 添加完善地址链接的地址到srcList
      //   this.data.forEach(i => {
      //     this.srcList.push(i.thumb)
      //   })

      //   // 分页数据
      //   this.count = resp.data.total
      //   this.totalPage = Math.ceil(this.count / this.eachPage)
      //   if (this.currentPage > this.totalPage) {
      //   // 删除文章时,当最后一页的最后一条数据被删除后,总页码数-1,当前页码数就会大于总页码数
      //     this.currentPage = this.totalPage
      //     this.fetchData()
      //   }
      // } catch (error) {
      //   // 错误处理
      //   console.error('Error fetching blog data and categories:', error)
      //   throw error
      // } finally {
      //   this.loading = false
      // }
    },
  },
};
</script>

<style scoped>
.firstRow {
  width: 100%;
  margin: 0 0 15px 0;
  display: flex;
  justify-content: space-between;
}
.leftPart {
  width: 70%;
  display: flex;
}
.rightPart {
  display: flex;
}
</style>

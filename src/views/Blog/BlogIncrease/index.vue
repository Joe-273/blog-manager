<template>
  <div class="blog-increase-container  app-container">
    <!-- 文章标题 -->
    <div class="block">
      <p>文章标题<label style="color: lightcoral;">*</label></p>
      <el-input v-model="form.title" placeholder="请输入内容" />
    </div>

    <!-- 文章内容 -->
    <div class="block">
      <p>文章内容<label style="color: lightcoral;">*</label></p>
      <v-md-editor v-model="content" height="680px" class="markdown" @change="debounceChangeHandle" />
    </div>

    <!-- 文章描述 -->
    <div class="block">
      <p>文章描述<label style="color: lightcoral;">*</label></p>
      <el-input
        v-model="form.description"
        type="textarea"
        :autosize="{ minRows: 4}"
        placeholder="请输入内容"
      />
    </div>

    <!-- 文章预览图 -->
    <div class="lastRow">
      <div class="block">
        <p>预览图片</p>
        <Upload v-model="form.thumb" style="align-items: start;" />
      </div>

      <!-- 文章分类 -->
      <div class="block">
        <p>文章分类<label style="color: lightcoral;">*</label></p>
        <div class="content">
          <el-select v-model="form.categoryId" placeholder="请选择一个分类">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>

          <!-- 发布按钮 -->
          <el-button style="width: 100px;" type="primary" plain @click="handlePrimaryBlog">{{ isEditMode ? "重新" : "" }}发布</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Upload from '@/components/Upload'
import { getBlogCategories } from '@/api/blogType'
import { addBlog, getOneBlog, editBlog } from '@/api/blog'
// html转为markdown
import TurndownService from 'turndown'

export default {
  components: {
    Upload
  },
  data() {
    return {
      form: {
        title: '',
        htmlContent: '',
        description: '',
        thumb: '',
        categoryId: '',
        markdownContent: ''
      },
      categories: [],
      content: '',

      // 是否为编辑文章模式
      isEditMode: false,
      // 处于编辑模式的时候下面的数据才会有值
      currentBlogId: ''
    }
  },
  created() {
    if (this.$route.meta.editBlogMode) {
      // -----------//
      // 编辑文章模式 //
      // -----------//
      this.isEditMode = true
      this.currentBlogId = this.$route.params.blogId
      // 回填内容到表单
      getOneBlog(this.currentBlogId).then(resp => {
        this.form.title = resp.data.title
        this.form.description = resp.data.description
        this.form.categoryId = resp.data.category.id || ''
        this.form.thumb = resp.data.thumb
        // 将html转为markdown再回填
        const turndownService = new TurndownService()
        this.form.markdownContent = turndownService.turndown(resp.data.htmlContent)
        this.content = this.form.markdownContent
      })
    }

    getBlogCategories().then(resp => {
      this.categories = resp.data
    })
    //  把防抖函数放入this中
    this.debounceChangeHandle = this.debounce(this.handleGetHtml, 200)
  },
  methods: {
    // 防抖函数
    debounce(func, wait) {
      let timeout
      return function(...args) {
        const later = () => {
          clearTimeout(timeout)
          func.apply(this, args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    },
    /** 获取Html */
    handleGetHtml(text, html) {
      this.form.htmlContent = this.setAnchor(html)
      this.form.markdownContent = text
    },

    /** 设置锚链接ID */
    setAnchor(html) {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html

      const headers = tempDiv.querySelectorAll('h1,h2,h3,h4,h5,h6')

      headers.forEach(header => {
        // 获取 data-v-md-heading 属性的值
        const id = header.getAttribute('data-v-md-heading').trim()

        // 直接将 data-v-md-heading 的值设置为 id，不论是否已有 id
        header.setAttribute('id', id)
      })

      return tempDiv.innerHTML
    },

    /** 发布文章 */
    handlePrimaryBlog() {
      const data = {
        ...this.form,
        toc: [],
        createDate: new Date().getTime()
      }

      if (data.title && data.description && data.htmlContent && data.categoryId) {
        if (this.isEditMode) {
          // 编辑模式
          editBlog({ id: this.currentBlogId, data }).then(() => {
            this.$router.push('/Blog/BlogList')
            this.$message({
              type: 'success',
              message: '修改成功!',
              center: true
            })
          })
        } else {
          // 添加文章
          // 提交发布文章请求
          addBlog(data).then(() => {
            this.$message({
              type: 'success',
              message: '发布成功!',
              center: true
            })
            this.$router.push('/Blog/BlogList')
          })
        }
      } else {
        this.$message({
          type: 'warning',
          center: true,
          message: '请填写必要内容!'
        })
      }
    }
  }
}
</script>

<style scoped>
.blog-increase-container {
  margin: 0;
}
.block{
  margin-top: 30px;
}
.markdown{
  box-shadow: none;
  border: 1px solid #DCDFE6;
}
.content{
  height: 178px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.lastRow{
  display: flex;
}
.lastRow>*{
  margin-right: 50px;
}
</style>

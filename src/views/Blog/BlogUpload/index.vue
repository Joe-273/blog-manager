<template>
  <div class="blog-upload-container app-container">
    <div class="content">

      <div class="part">
        <el-transfer v-model="chooseList" :titles="['选择的文件', '上传的文件']" :data="leftList">
          <el-select slot="right-footer" v-model="categoryId" size="medium" placeholder="请选择一个分类">
            <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-transfer>

        <div class="block">
          <el-button type="primary" plain @click="triggerFileInput">选择文件</el-button>
          <el-button type="primary" plain @click="handleUpload">批量上传</el-button>
        </div>

        <!-- 隐藏文件选择器 -->
        <input ref="fileInput" type="file" multiple style="display: none" accept=".md" @change="handleFilesSelected">
      </div>

      <div class="part upload">
        <p>预览图片</p>
        <Upload v-model="thumb" style="align-items: start;" />
        <!-- 文章预览图 -->
        <p>预览图片</p>
        <el-input v-model="thumb" placeholder="请输入Url（或上传图片）" />

      </div>
    </div>

  </div>
</template>

<script>
import md from '@/utils/markdownToHtml'

import { getBlogCategories } from '@/api/blogType'
import { addBlog } from '@/api/blog'
import Upload from '@/components/Upload'

export default {
  components: {
    Upload
  },
  data() {
    return {
      leftList: [],
      chooseList: [],
      categoryId: null,
      categories: [],
      thumb: ''
    }
  },
  created() {
    getBlogCategories().then((resp) => {
      this.categories = resp.data
    })
  },
  methods: {
    /** 选择文件 */
    handleFilesSelected(event) {
      // 从事件对象中获取文件列表
      const files = event.target.files

      Array.from(files).forEach((file) => {
        const reader = new FileReader()

        reader.onload = function(e) {
          // 确保在文件读取完成后添加到leftList中
          const content = e.target.result
          const title = content.match(/^#\s+(.+)$/m) // 获取标题
          const _firstSubTitle = content.match(/^##\s+(.+)$/m)
          let description
          if (title && _firstSubTitle) {
            const titleIndex = content.indexOf(title[0])
            const _firstSubTitleIndex = content.indexOf(_firstSubTitle[0])

            // 提取标题1到第一个标题2之间的字符串,作为描述
            // 去掉空行处理
            description = content
              .substring(titleIndex + title[0].length, _firstSubTitleIndex)
              .split('\n')
              .filter((line) => line.trim())
              .join('\n')
            if (description === '') {
              description = '作者懒得雅痞，啥描述都没加上哦~'
            }
          } else {
            console.log('No title 1 or title 2 found')
          }

          const blogData = {
            title: title && title[1],
            htmlContent: md.render(content),
            description,
            thumb: this.thumb,
            categoryId: null,
            markdownContent: content
          }
          this.leftList.push({
            key: file.name,
            label: file.name,
            disabled: !file.name.endsWith('.md'),
            blogData
          })
        }.bind(this) // 使用bind(this)确保this指向组件实例
        reader.readAsText(file)
      })
    },
    /** 事件触发 */
    triggerFileInput() {
      // 触发隐藏的文件输入框
      this.$refs.fileInput.click()
    },
    /** 上传 */
    async handleUpload() {
      if (!this.chooseList.length) {
        this.$message({
          type: 'warning',
          message: '请选择需要上传的文件',
          center: true
        })
        return
      } else if (this.categoryId === null) {
        this.$message({
          type: 'warning',
          message: '请选择文章分类',
          center: true
        })
        return
      }
      const uploadData = this.leftList
        .filter((i) => this.chooseList.includes(i.key))
        .map((i) => ({
          ...i.blogData,
          categoryId: this.categoryId
        }))
      console.log(uploadData)
      try {
        await Promise.all(uploadData.map((item) => addBlog(item)))
        this.$message({
          type: 'success',
          message: '上传成功!',
          center: true
        })
        this.$router.push('/Blog/BlogList')
      } catch (error) {
        this.$message({
          type: 'error',
          message: '中途出现错误了',
          center: true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.blog-upload-container {
  width: 100%;
  display: flex;
}

.block {
  width: 582px;
  display: flex;
  justify-content: space-between;
}

.block>* {
  width: 200px;
  margin-top: 10px;
}
.content {
  flex: 1 ;
  display: flex;
  justify-content: space-around;
}
.part{
  height: 338px;
  padding: 0 35px;
}
.part.upload{
  flex: 1 ;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>

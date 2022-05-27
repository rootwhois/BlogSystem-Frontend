<template>
  <div>
    <div class="block">
      <!-- 时间线 文章 -->
      <el-timeline class="timeline">
        <el-timeline-item
          class="timeline-item"
          :timestamp="'「 ' + tag.tagName + ' 」标签下的文章'"
          placement="top"
        >
          {{ total }}篇文章
          <el-card
            class="card"
            v-for="(article, index) in tag.articles"
            :key="index"
            shadow="hover"
          >
            <h4 class="title">
              <router-link
                :to="{
                  name: 'ArticleDetail',
                  params: { articleId: article.articleId },
                }"
                class="title"
              >
                {{ article.articleTitle }}
                <el-tag v-show="article.articleTop" class="top">置顶</el-tag>
              </router-link>
            </h4>
            <p class="description">{{ article.articleDescription }}</p>
            <div class="btn">
              <router-link
                :to="{
                  name: 'ArticleDetail',
                  params: { articleId: article.articleId },
                }"
                ><el-button round type="primary"
                  >阅读全文</el-button
                ></router-link
              >
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <!-- 分页 -->
      <el-pagination
        background
        class="pagination"
        layout="prev, pager, next"
        v-show="total > 0"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-count="totalPage"
        :total="total"
        @current-change="getTag"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "TagDetail",
  data() {
    return {
      tag: "",
      currentPage: 1,
      totalPage: 0,
      pageSize: 5,
      total: 0,
    };
  },
  methods: {
    getTag(currentPage) {
      const tagId = this.$route.params.tagId;
      this.$axios.get("/api/tag/one?tagId=" + tagId).then((resp) => {
        this.tag = resp.data.data;
        this.getArticles(this.tag, currentPage);
      });
    },
    getArticles(tag, currentPage) {
      this.$axios
        .get(
          "/api/article/listByTagId?tagId=" +
            tag.tagId +
            "&currentPage=" +
            currentPage
        )
        .then((resp) => {
          this.$set(this.tag, "articles", resp.data.data.records);
          this.currentPage = resp.data.data.current;
          this.totalPage = resp.data.data.pages;
          this.pageSize = resp.data.data.size;
          this.total = resp.data.data.total;
        });
    },
  },
  created() {
    this.getTag(1);
  },
  watch: {
    $route() {
      this.getTag(1);
    },
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100vh; //核心
  overflow-x: hidden; //核心
}
.title {
  font-size: 20px;
  color: #606266;
}
.description {
  font-size: 15px;
  text-align: left;
}
.tag {
  margin-left: 10px;
}
.main {
  margin-left: 100px;
  margin-right: 50px;
}
.top {
  margin-left: 20px;
}
.pagination {
  text-align: center;
}
.btn {
  text-align: center;
}
.timeline-item .el-timeline-item__timestamp {
  font-size: 20px;
  font-weight: 500;
  padding: 20px 0;
}
.card {
  margin-top: 20px;
}
</style>
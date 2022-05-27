<template>
  <div>
    <div class="block">
      <!-- 时间线 文章 -->
      <el-timeline class="timeline">
        <el-timeline-item
          :timestamp="article.createTime"
          placement="top"
          v-for="(article, index) in articles"
          :key="index"
        >
          <el-card shadow="hover">
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
            <p class="description">{{ article.articleDescription | ellipsis }}</p>
            <div class="comment">
              <span class="el-icon-s-comment">共 {{article.commentCount}} 条评论</span>
            </div>
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
        :current-page="currentPage"
        :page-size="pageSize"
        :page-count="totalPage"
        :total="total"
        @current-change="getArticles"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      articles: [],
      sorts: [],
      tags: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 5,
      total: 0,
    };
  },
  methods: {
    getArticles(currentPage) {
      this.$axios
        .get("/api/article/list?currentPage=" + currentPage)
        .then((resp) => {
          this.articles = resp.data.data.records;
          this.currentPage = resp.data.data.current;
          this.totalPage = resp.data.data.pages;
          this.pageSize = resp.data.data.size;
          this.total = resp.data.data.total;
        });
    },
    getSorts() {
      this.$axios.get("/api/sort/listAll").then((resp) => {
        this.$set(this, "sorts", resp.data.data);
      });
    },
    getTags() {
      this.$axios.get("/api/tag/listAll").then((resp) => {
        this.tags = resp.data.data;
      });
    },
  },
  created() {
    this.getArticles(1);
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 150) {
        return value.slice(0, 150) + "...";
      }
      return value;
    },
  },
};
</script>

<style lang="less" scoped>
.el-icon-s-comment {
  text-align: right;
}
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
  min-height: 700px;
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
.comment {
  text-align: right;
  margin-right: 50px;
}
</style>
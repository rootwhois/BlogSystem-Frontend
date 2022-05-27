<template>
  <div>
    <div class="block">
      <!-- 时间线 文章 -->
      <el-timeline class="timeline">
        <el-timeline-item
          class="timeline-item"
          :timestamp="'「 ' + sort.sortName + ' 」分类下的文章'"
          placement="top"
        >
          {{ total }}篇文章
          <el-card
            class="card"
            v-for="(article, index) in sort.articles"
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
        @current-change="getSort"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "SortDetail",
  data() {
    return {
      sort: "",
      currentPage: 1,
      totalPage: 0,
      pageSize: 5,
      total: 0,
    };
  },
  methods: {
    getSort(currentPage) {
      const sortId = this.$route.params.sortId;
      this.$axios.get("/api/sort/one?sortId=" + sortId).then((resp) => {
        this.sort = resp.data.data;
        this.getArticles(this.sort, currentPage);
      });
    },
    getArticles(sort, currentPage) {
      this.$axios
        .get(
          "/api/article/listBySortId?sortId=" +
            sort.sortId +
            "&currentPage=" +
            currentPage
        )
        .then((resp) => {
          this.$set(this.sort, "articles", resp.data.data.records);
          this.currentPage = resp.data.data.current;
          this.totalPage = resp.data.data.pages;
          this.pageSize = resp.data.data.size;
          this.total = resp.data.data.total;
        });
    },
  },
  created() {
    this.getSort(1);
  },
  watch: {
    $route() {
      this.getSort(1);
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
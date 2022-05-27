<template>
  <div>
    <div class="block">
      <!-- 时间线 文章 -->
      <el-timeline class="timeline">
        <el-timeline-item
          class="timeline-item"
          :timestamp="sort.sortName"
          placement="top"
          v-for="(sort, index) in sorts"
          :key="index"
        >
          <router-link
            :to="{
              name: 'SortDetail',
              params: { sortId: sort.sortId },
            }"
          >
            <span v-if="sort.articles" class="link">
              {{ sort.articleCount }}篇文章
              <span v-show="sort.articleCount > 5"> （查看更多）</span></span
            >
          </router-link>
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
            <p class="description">
              {{ article.articleDescription | ellipsis }}
            </p>
            <!-- <div class="comment">
              <span class="el-icon-s-comment"
                >共 {{ article.commentCount }} 条评论</span
              >
            </div> -->
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
          <div class="more-btn" v-show="sort.articleCount > 5">
            <router-link
              :to="{
                name: 'SortDetail',
                params: { sortId: sort.sortId },
              }"
            >
              <el-button round
                >查看 「{{ sort.sortName }}」分类下的更多文章</el-button
              >
            </router-link>
          </div>
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
        @current-change="getSorts"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sort",
  data() {
    return {
      sorts: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 5,
    };
  },
  methods: {
    getSorts(currentPage) {
      this.$axios
        .get("/api/sort/list?currentPage=" + currentPage)
        .then((resp) => {
          this.sorts = resp.data.data.records;
          this.currentPage = resp.data.data.current;
          this.totalPage = resp.data.data.pages;
          this.pageSize = resp.data.data.size;
          this.total = resp.data.data.total;
          this.getArticles(this.sorts);
        });
    },
    getArticles(sorts) {
      for (let i = 0; i < sorts.length; i++) {
        this.$axios
          .get("/api/article/listBySortId?sortId=" + sorts[i].sortId)
          .then((resp) => {
            this.$set(sorts[i], "articles", resp.data.data.records);
          });
      }
    },
  },
  created() {
    this.getSorts(1);
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
.more-btn {
  text-align: center;
  margin-top: 20px;
}
.comment {
  text-align: right;
  margin-right: 50px;
}
</style>
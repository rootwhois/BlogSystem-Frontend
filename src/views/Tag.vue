<template>
  <div>
    <div class="block">
      <div class="tag-group">
        <router-link
          class="el-tag--plain link"
          v-for="(tag, index) in tags"
          :key="index"
          :to="{ name: 'TagDetail', params: { tagId: tag.tagId } }"
        >
          <el-tag effect="plain" class="tag">
            {{ tag.tagName }}  （{{ tag.articleCount }}篇）
          </el-tag>
        </router-link>
      </div>
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
      tags: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 100,
      total: 0,
    };
  },
  methods: {
    getSorts(currentPage) {
      this.$axios
        .get(
          "/api/tag/list?currentPage=" +
            currentPage +
            "&pageSize=" +
            this.pageSize
        )
        .then((resp) => {
          this.tags = resp.data.data.records;
          this.currentPage = resp.data.data.current;
          this.totalPage = resp.data.data.pages;
          this.pageSize = resp.data.data.size;
          this.total = resp.data.data.total;
        });
    },
  },
  created() {
    this.getSorts(1);
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
.main {
  margin-left: 100px;
  margin-right: 50px;
}
.top {
  margin-left: 20px;
}
.pagination {
  text-align: center;
  margin-top: 50px;
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
.tag {
  margin-right: 30px;
  margin-top: 20px;
}
</style>
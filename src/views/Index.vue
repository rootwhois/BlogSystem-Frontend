<template>
  <div>
    <el-container class="container">
      <!-- header -->
      <el-header height="100px"><head-nav 
      v-on:handleSwitchRouter="switchRouter"></head-nav></el-header>
      <el-container>
        <el-container>
          <!-- main -->
          <el-main class="main">
            <router-view></router-view>
          </el-main>
          <!-- footer -->
          <el-footer><foot-nav></foot-nav></el-footer>
        </el-container>
        <el-aside width="450px"><sidebar></sidebar></el-aside>
      </el-container>
    </el-container>
    <el-backtop target=".container">
      <div
        style="
           {
            height: 100%;
            width: 100%;
            background-color: #f2f5f6;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
            text-align: center;
            line-height: 40px;
            color: #1989fa;
          }
        "
      >
        UP
      </div>
    </el-backtop>
  </div>
</template>

<script>
import HeadNav from "@/components/HeadNav.vue";
import Sidebar from "@/components/Sidebar.vue";
import FootNav from "@/components/FootNav.vue";
export default {
  name: "Index",
  components: { HeadNav, Sidebar, FootNav },
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
    switchRouter(name) {
      this.$router.push({
        name: name,
      });
    },
    getArticles(currentPage) {
      this.$axios
        .get("/api/article/list?currentPage=" + currentPage)
        .then((resp) => {
          this.articles = resp.data.data.records;
          this.currentPage = resp.data.data.current;
          this.totalPage = resp.data.data.pages;
          this.pageSize = resp.data.data.size;
          this.total = resp.data.data.total;

          // this.getSorts();
          // this.getTags();

          // console.log(this.sorts);

          // for (let i = 0; i < this.articles.length; i++) {
          //   let articleSorts = [];
          //   let sortVo = this.articles[i].articleSortsVo;
          //   for (let j = 0; j < sortVo.length; j++) {
          //     for (let k = 0; k < this.sorts.length; k++) {
          //       if (sortVo[j].sortId === this.sorts[k].sortId) {
          //         articleSorts.push(this.sorts[k]);
          //       }
          //     }
          //   }
          // }

          //   let articleTags = [];
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
</style>
<template>
  <div>
    <div class="detail">
      <h2 class="title">{{ article.articleTitle }}</h2>
      <el-divider content-position="center" class="minibar">
        创建时间：{{ article.createTime }} &nbsp;&nbsp; 更新时间：{{
          article.updateTime
        }}
        &nbsp;&nbsp; 分类：
        <span v-for="(sort, index) in article.articleSorts" :key="index">
          <router-link
            class="link"
            :to="{
              name: 'SortDetail',
              params: { sortId: sort.sortId ? sort.sortId : -1 },
            }"
          >
            {{ sort.sortName }}
          </router-link>
        </span>

        <el-link icon="el-icon-edit" v-show="editPermission">
          <span class="link" @click="clickMenu()">编辑</span>
        </el-link>
      </el-divider>
      <div class="markdown-body main-content" v-html="article.articleContent"></div>
      <br />
      <div>
        <router-link
          class="el-tag--plain link"
          v-for="(tag, index) in article.articleTags"
          :key="index"
          :to="{ name: 'TagDetail', params: { tagId:tag.tagId ? tag.tagId : -1 } }"
        >
          <el-tag class="tag">
            {{ tag.tagName }}
          </el-tag>
        </router-link>
      </div>
      <el-divider> </el-divider>
      <comment></comment>
    </div>
  </div>
</template>

<script>
import Comment from "@/components/Comment.vue";
export default {
  name: "ArticleDetail",
  components: { Comment },
  data() {
    return {
      article: {},
      editPermission: false,
    };
  },
  methods: {
    clickMenu() {
      let item = {
        name: "ArticleEdit",
        label: "文章编辑",
        params: { articleId: this.article.articleId },
      };
      this.$router.push({
        name: item.name,
        params: item.params,
      });
      this.$store.commit("selectMenu", item);
    },
    getArticle(articleId) {
      // 存在articleId，则为编辑，需要回显
      if (articleId) {
        
        this.$axios.get("/api/article/one?id=" + articleId).then((resp) => {
          this.article = resp.data.data;
          // 对md格式进行渲染得到html格式的内容
          var MarkdownIt = require("markdown-it");
          var md = new MarkdownIt();
          var result = md.render(resp.data.data.articleContent);
          this.article.articleContent = result;

          if (this.$store.getters.getUser) {
            this.editPermission =
              this.article.articleUserId ===
              this.$store.getters.getUser.userId;
          }

          // 获取文章的分类
          let sortsVo = resp.data.data.articleSorts;
          let sorts = [];
          this.$axios.get("/api/sort/listAll").then((resp) => {
            let data = resp.data.data;
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < sortsVo.length; j++) {
                if (data[i].sortId === sortsVo[j]) {
                  sorts.push(data[i]);
                }
              }
            }
            this.$set(this.article, "articleSorts", sorts);
          });

          // 获取文章的标签
          let tagsVo = resp.data.data.articleTags;
          let tags = [];
          this.$axios.get("/api/tag/listAll").then((resp) => {
            let data = resp.data.data;
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < tagsVo.length; j++) {
                if (data[i].tagId === tagsVo[j]) {
                  tags.push(data[i]);
                }
              }
            }
            this.$set(this.article, "articleTags", tags);
          });
        });
      }
    },
  },
  created() {
    const articleId = this.$route.params.articleId;
    this.getArticle(articleId);
  },
  watch: {
    $route(to, from) {
      const articleId = to.params.articleId;
      this.getArticle(articleId);
    },
  },
};
</script>

<style lang="less" scoped>
.tag {
  margin-right: 20px;
}
.title {
  font-size: 20px;
}
.content {
  font-size: 15px;
}
.detail {
  margin-left: 100px;
  margin-right: 50px;
  min-height: 700px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px 15px;
}
.detail .title {
  font-size: 40px;
  text-align: center;
}
.minibar .el-divider__text {
  font-weight: 200;
}
.main-content {
  min-height: 400px;
}
</style>
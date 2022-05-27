<template>
  <div>
    <el-card class="box-card side" shadow="hover">
      <h3 class="webname">{{ webName }}</h3>
      <el-row class="demo-avatar demo-basic"></el-row>
      <div class="block">
        <el-avatar :size="100" :src="user.avatar"></el-avatar>
        <div class="username">{{ user.username }}</div>
      </div>
      <br />
      <el-descriptions
        class="descriptions"
        title=""
        :column="3"
        direction="vertical"
        :colon="false"
      >
        <el-descriptions-item label="文章数">
          <router-link
            class="link"
            :to="{
              name: 'Home',
            }"
            >{{ articleCount }}
          </router-link>
        </el-descriptions-item>
        <el-descriptions-item label="分类数">
          <router-link
            class="link"
            :to="{
              name: 'Sort',
            }"
            >{{ sortCount }}
          </router-link>
        </el-descriptions-item>
        <el-descriptions-item label="标签数">
          <router-link
            class="link"
            :to="{
              name: 'Tag',
            }"
          >
            {{ tagCount }}
          </router-link>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card
      class="box-card side"
      shadow="hover"
      v-show="$route.name === 'Index' || $route.name === 'Home'"
    >
      <div slot="header" class="clearfix">
        <span>最近评论</span>
      </div>
      <div v-for="(item, index) in commentList" :key="index" class="text item">
        <router-link
          :to="{
            name: 'ArticleDetail',
            params: { articleId: item.commentArticleId },
          }"
        >
          <span class="link"
            ><span>@</span><span style="color: #834">{{ item.commentNickname }}</span>
            评论：<span style="text-decoration: underline">{{
              item.commentContent | ellipsis
            }}</span></span
          >
        </router-link>
        <el-divider></el-divider>
      </div>
    </el-card>

    <el-card
      class="box-card side"
      shadow="hover"
      v-show="$route.name !== 'Sort' && $route.name !== 'SortDetail'"
    >
      <div slot="header" class="clearfix">
        <span>分类</span>
      </div>
      <div  class="text item" v-for="(item, index) in sortList" :key="index">
        <router-link :to="{ name: 'SortDetail', params: { sortId: item.sortId } }">
          <span>{{ item.sortName }}</span>
        </router-link>
        <el-divider></el-divider>
      </div>
    </el-card>

    <el-card
      class="box-card side"
      shadow="hover"
      v-show="$route.name !== 'Tag' && $route.name !== 'TagDetail'"
    >
      <div slot="header" class="clearfix">
        <span>标签</span>
      </div>
      <div  class="text item" v-for="(item, index) in tagList" :key="index">
        <router-link :to="{ name: 'TagDetail', params: { tagId: item.tagId } }">
          <span>{{ item.tagName }}</span>
        </router-link>
        <el-divider></el-divider>
      </div>
    </el-card>

    <el-card
      class="box-card side"
      shadow="hover"
      v-show="$route.name !== 'Home'"
    >
      <div slot="header" class="clearfix">
        <span>最新文章</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="$router.push({ name: 'Home' })"
          v-show="$route.name !== 'Index' && $route.name !== 'Home'"
          >更多文章</el-button
        >
      </div>
      <div class="text item" v-for="(item, index) in articleList" :key="index">
        <router-link
          :to="{
            name: 'ArticleDetail',
            params: { articleId: item.articleId },
          }"
        >
          <span>{{ item.articleTitle }} </span>
        </router-link>
        <el-divider></el-divider>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      articleList: [],
      commentList: [],
      tagList: [],
      sortList: [],
      user: {
        username: "我",
        avatar:
          "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      },
      webIsOpen: true,
      webName: "我的博客",
      webDomain: "127.0.0.1",
      articleCount: 0,
      sortCount: 0,
      tagCount: 0,
    };
  },
  methods: {
    getWebInfo() {
      this.$axios.get("/api/web/info").then((res) => {
        this.user.username = res.data.data.userNickName;
        this.user.avatar = res.data.data.userAvatar;
        this.webIsOpen = res.data.data.webIsOpen;
        this.webName = res.data.data.webName;
        this.webDomain = res.data.data.webDomain;
        this.articleCount = res.data.data.articleCount;
        this.sortCount = res.data.data.sortCount;
        this.tagCount = res.data.data.tagCount;
      });
    },
    listRecentArticle() {
      this.$axios.get("/api/article/listRecent").then((res) => {
        this.articleList = res.data.data.records;
      });
    },
    listRecentComment() {
      this.$axios.get("/api/comment/listRecent").then((res) => {
        this.commentList = res.data.data.records;
      });
    },
    listTags() {
      this.$axios.get("/api/tag/list").then((res) => {
        this.tagList = res.data.data.records;
      });
    },
    listSorts() {
      this.$axios.get("/api/sort/list").then((res) => {
        this.sortList = res.data.data.records;
      });
    },
  },
  created() {
    this.getWebInfo();
    this.listRecentArticle();
    this.listRecentComment();
    this.listTags();
    this.listSorts();
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 20) {
        return value.slice(0, 20) + "...";
      }
      return value;
    },
  },
};
</script>

<style lang="less">
.side {
  margin-right: 100px;
  text-align: center;
  margin-bottom: 30px;
}
.descriptions
  .el-descriptions__body
  .el-descriptions__table
  .el-descriptions-row
  .el-descriptions-item__cell {
  text-align: center;
}
.descriptions
  .el-descriptions__body
  .el-descriptions__table
  .el-descriptions-row
  .el-descriptions-item__label {
  font-weight: 1000;
}
.descriptions
  .el-descriptions__body
  .el-descriptions__table
  .el-descriptions-row
  .el-descriptions-item__content {
  font-weight: bold;
  font-size: 30px;
  line-height: 50px;
}
.username {
  font-size: 20px;
  margin-top: 10px;
}
.webname {
  font-size: 25px;
  font-weight: bold;
  margin-top: 10px;
}
.text {
  font-size: 15px;
  text-align: left;
}
.item {
  margin-bottom: 10px;
}
a {
  color: #000;
  text-decoration: none;
}
</style>
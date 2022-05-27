<template>
  <!--评论列表-->
  <div class="comment-body">
    <!--评论表单-->
    <comment-form @parentEvent="toClick" v-on:handleRefresh="refresh"></comment-form>
    <h3 class="ui-dividing-header">Comments | {{ total }} 条评论</h3>
    <h3 v-if="total === 0" class="ui-header">快来抢沙发！</h3>
    <!--评论内容-->
    <div v-for="comment in comments" :key="comment.commentId" class="comment">
      <!--父评论内容--用户名 内容-->
      <span :id="`comment-${comment.commentId}`" class="anchor"></span>
      <div class="content">
        <a class="nickname" rel="external nofollow noopener" target="_blank">{{
          comment.commentNickname
        }}</a>
        <el-tag
          v-if="comment.commentUserId == 1"
          class="label"
          effect="dark"
          size="mini"
          type="info"
          >博主</el-tag
        >
        <span class="date">{{ comment.createTime }}</span>
        <!-- <el-button
          size="mini"
          type="primary"
          @click="setReply(comment.commentId)"
          >回复</el-button
        > -->
        <div class="text" v-html="comment.commentContent"></div>

        <!--  -->

        <!--  -->
      </div>
    </div>

    <el-pagination
      v-show="total != 0"
      background
      class="pagination"
      layout="prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-count="totalPage"
      :total="total"
      @current-change="getComments"
    >
    </el-pagination>
  </div>
</template>

<script>
import CommentForm from "@/components/CommentForm";
export default {
  name: "Comment",
  components: { CommentForm },
  data() {
    return {
      comments: [],
      commentCount: 0,
      // commentSubId: -1,
      articleId: 0,
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    refresh() {
      this.getComments(this.currentPage);
    },
    //设置回复的父亲id
    setReply(id) {
      this.commentSubId = id;
    },
    //设置回复的父亲id
    setChildrenReply(id) {
      this.commentSubId = id;
    },
    //接受子组件信息，将评论表单归位
    toClick(msg) {
      this.commentSubId = "";
    },
    //获取评论
    getComments(currentPage) {
      if (this.$route.params.articleId) {
        this.articleId = this.$route.params.articleId;
      } else {
        alert("error");
        return false;
      }
      
      this.$axios
        .get(
          "/api/comment/listByArticleId?articleId=" +
            this.articleId +
            "&currentPage=" +
            currentPage
        )
        .then((resp) => {
          this.comments = resp.data.data.records;
          this.currentPage = resp.data.data.current;
          this.totalPage = resp.data.data.pages;
          this.pageSize = resp.data.data.size;
          this.total = resp.data.data.total;
          // for (var i in this.comments) {
          //   this.commentCount =
          //     this.commentCount + this.comments[i].replyComments.length;
          // }
        });
    },
  },
  created() {
    this.getComments(this.currentPage);
  },
  watch: {
    $route(to, from) {
      const articleId = to.params.articleId;
      this.articleId = articleId;
      this.getComments(this.currentPage);
    },
  },
};
</script>

<style scoped>
.comment-body {
  padding: 5px 35px 15px 22px;
}
.comment {
  padding-right: 2em !important;
  padding-left: 1em !important;
  margin: 7px 0px 0px;
  padding-top: 7px;
}
.comments {
  padding: 42px 0px 24px 31.5px;
  margin: -28px 0px -10px 17.5px;
  border-left: 1px #ccc solid;
}
.content {
  margin-left: 0px;
  display: inline-block;
  width: auto;
  vertical-align: top;
}
.image-avatar {
  display: inline-block;
  width: 49px;
  vertical-align: top;
}
.label {
  margin-left: 5px;
}
.nickname {
  font-weight: bolder;
  font-size: 14px;
  color: #000;
  text-decoration-line: none;
}
.comment .el-button {
  margin-left: 5px;
  padding: 4px 5px;
}
.text {
  white-space: pre-wrap !important;
  margin: 7px 0px;
  line-height: 1.5;
  font-size: 14px;
}
.date {
  color: gray;
  font-size: 10px;
  margin-left: 5px;
}
.anchor {
  height: 55px;
  margin-top: -55px;
  visibility: hidden;
}
</style>
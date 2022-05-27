<template>
  <div>
    <div class="manage">
      <el-dialog
        :title="showReply ? '回复评论' : '评论详情'"
        :visible.sync="isShow"
        :destroy-on-close="true"
      >
        <el-descriptions>
          <el-descriptions-item label="评论人邮箱">{{
            comment.commentNickname
          }}</el-descriptions-item>

          <el-descriptions-item label="评论人邮箱">{{
            comment.commentEmail
          }}</el-descriptions-item>
          <el-descriptions-item label="评论人IP">{{
            comment.commentIp
          }}</el-descriptions-item>
          <el-descriptions-item label="评论时间">{{
            comment.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="评论内容"
            >{{ comment.commentContent }}
          </el-descriptions-item>
        </el-descriptions>
        <common-form
          v-show="showReply"
          :formLabel="operateFormLabel"
          :form="operateForm"
          :inline="true"
          ref="form"
        >
        </common-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShow = false">返回</el-button>
          <el-button type="primary" @click="confirm" v-show="showReply"
            >确定</el-button
          >
        </div>
      </el-dialog>
      <div class="manage-header">
        <div></div>
        <common-form
          :formLabel="formLabel"
          :form="searchForm"
          :inline="true"
          ref="form"
        >
          <el-button @click="search">搜索</el-button>
        </common-form>
      </div>
    </div>
    <common-table
      v-on:changePage="list"
      v-on:handleReply="reply"
      v-on:handleDetail="detail"
      v-on:handleDelete="deleteById"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :config="config"
      :showBtn="showBtn"
    ></common-table>
  </div>
</template>

<script>
import CommonForm from "@/components/admin/CommonForm";
import CommonTable from "@/components/admin/CommonTable";
export default {
  name: "CommentList",
  components: {
    CommonTable,
    CommonForm,
  },
  data() {
    return {
      articleId: -1,
      showReply: false,
      showBtn: {
        reply: true,
        detail: true,
        delete: true,
      },
      currentPage: 1,
      operateType: "add",
      isShow: false,
      comment: {
        // articleTitle: "",
        commentNickname: "",
        commentEmail: "",
        commentIp: "",
        commentContent: "",
      },
      operateFormLabel: [
        {
          model: "commentContent",
          label: "回复内容：",
          type: "textarea",
        },
      ],
      operateForm: {
        commentContent: "",
        commentSubId: "",
        commentArticleId: "",
      },
      formLabel: [
        {
          model: "keyword",
          label: "",
          type: "input",
        },
      ],
      searchForm: {
        keyword: "",
      },
      tableData: [],
      tableLabel: [
        {
          label: "评论ID",
          prop: "commentId",
          width: "100",
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: "200",
        },
        // {
        //   label: "评论者ID",
        //   prop: "commentUserId",
        //   width: "100",
        // },
        {
          label: "评论者昵称",
          prop: "commentNickname",
          width: "100",
        },
        {
          label: "评论者邮箱",
          prop: "commentEmail",
          width: "200",
        },
        {
          label: "提交ip",
          prop: "commentIp",
          width: "150",
        },
        // {
        //   label: "评论父ID",
        //   prop: "commentSubId",
        //   width: "100",
        // },
        {
          label: "文章ID",
          prop: "commentArticleId",
          width: "100",
        },
        {
          label: "评论内容",
          prop: "commentContent",
          width: "400",
        },
        // {
        //   label: "评论状态",
        //   prop: "commentStatus",
        //   width: "150",
        // },
      ],
      config: {
        page: 1,
        total: 1,
        pageSize: 15,
      },
    };
  },
  methods: {
    list(page) {
      this.$axios
        .get("/api/comment/listAll", {
          params: {
            currentPage: page,
            pageSize: this.config.pageSize,
            keyword: this.searchForm.keyword,
            articleId: this.articleId === -1 ? "" : this.articleId,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((resp) => {
          this.config.currentPage = resp.data.data.current;
          this.config.totalPage = resp.data.data.pages;
          this.config.pageSize = resp.data.data.size;
          this.config.total = resp.data.data.total;
          this.tableData = resp.data.data.records;
        });
    },
    reply(item) {
      this.isShow = true;
      this.showReply = true;
      this.comment = item;
      this.operateForm.commentSubId = item.commentId;
      this.operateForm.commentContent = "@" + item.commentNickname + "： ";
      this.operateForm.commentArticleId = item.commentArticleId;
    },
    detail(item) {
      this.isShow = true;
      this.showReply = false;
      this.comment = item;
    },
    confirm() {
      this.$axios
        .post("/api/comment/reply", this.operateForm, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((resp) => {
          if (resp.data.code === 200) {
            this.isShow = false;
            this.$message.success("回复成功");
            this.list(this.config.currentPage);
          } else {
            this.$message.error(resp.data.msg);
          }
        });
    },
    deleteById(item) {
      this.$axios
        .delete("/api/comment/delete", {
          params: {
            commentId: item.commentId,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((resp) => {
          this.open(resp.data.msg, "success");
          this.list(1);
        });
    },
    search() {
      this.list(1);
    },
    open(msg, type) {
      this.$message({
        message: msg,
        type: type,
      });
    },
  },
  created() {
    if (this.$route.params.type) {
      const type = this.$route.params.type;
      if (type === "listByArticleId" && this.$route.params.id) {
        this.articleId = this.$route.params.id;
      }
    }
    this.list(1);
  },
  watch: {
    $route(to, from) {
      if (to.params.type) {
        const type = to.params.type;
        if (type === "listByArticleId" && to.params.id) {
          this.searchForm.keyword = "";
          this.articleId = to.params.id;
        }
      } else {
        this.articleId = -1;
      }
      this.list(1);
    },
  },
};
</script>

<style lang="less" scoped>
.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
<template>
  <div>
    <div class="manage">
      <el-dialog
        width="80%"
        :title="operateType === 'add' ? '新增文章' : '编辑文章'"
        :visible.sync="isShow"
        :destroy-on-close="true"
      >
        <article-edit
          :articleId="articleId"
          v-on:handleShow="show"
        ></article-edit>
      </el-dialog>
      <div class="manage-header">
        <el-button type="primary" @click="add" icon="el-icon-plus">
          新增
        </el-button>
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
      v-on:handleListComment="listCommentById"
      v-on:handleDetail="detail"
      v-on:handleEdit="edit"
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
import ArticleEdit from "@/views/admin/article/ArticleEdit";
export default {
  name: "ArticleList",
  components: {
    CommonTable,
    CommonForm,
    ArticleEdit,
  },
  data() {
    return {
      listById: -1,
      listType: "",
      articleId: -1,
      showBtn: {
        listComment: true,
        detail: true,
        edit: true,
        delete: true,
      },
      currentPage: 1,
      operateType: "add",
      isShow: false,
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
          label: "文章ID",
          prop: "articleId",
          width: "75",
        },
        {
          label: "文章标题",
          prop: "articleTitle",
          width: "200",
        },
        {
          label: "文章描述",
          prop: "articleDescription",
          width: "250",
        },
        // {
        //   label: "文章内容",
        //   prop: "articleContent",
        //   width: "300",
        // },
        {
          label: "是否置顶",
          prop: "articleTop",
          width: "100",
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: "175",
        },
        {
          label: "修改时间",
          prop: "updateTime",
          width: "175",
        },
        {
          label: "评论数",
          prop: "commentCount",
          width: "75",
        },
      ],
      config: {
        page: 1,
        total: 1,
        pageSize: 15,
      },
    };
  },
  methods: {
    show() {
      this.isShow = false;
    },
    list(page) {
      this.$axios
        .get("/api/article/listAll", {
          params: {
            currentPage: page,
            pageSize: this.config.pageSize,
            query: this.searchForm.keyword,
            type: this.listType,
            id: this.listById === -1 ? "" : this.listById,
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
    listCommentById(item) {
      let route = {
        name: "CommentListByType",
        label: "根据文章检索评论",
        params: {
          type: "listByArticleId",
          id: item.articleId,
        },
      };
      this.$store.commit("selectMenu", route);
      this.$router.push(route);
    },
    detail(item) {
      this.$router.push({
        path: "/article/" + item.articleId,
      });
    },
    edit(item) {
      this.operateType = "edit";
      this.articleId = item.articleId;
      this.isShow = true;
    },
    add() {
      this.operateType = "add";
      this.articleId = -1;
      this.isShow = true;
    },
    deleteById(item) {
      this.$axios
        .delete("/api/article/delete", {
          params: {
            articleId: item.articleId,
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
    if (this.$route.name === "ArticleList") {
      this.searchForm.keyword = "";
      this.listType = "";
      this.listById = -1;
    } else if (
      this.$route.name === "ArticleListBySortId" &&
      this.$route.params.id
    ) {
      this.listById = this.$route.params.id;
      this.listType = "listBySortId";
    } else if (
      this.$route.name === "ArticleListByTagId" &&
      this.$route.params.id
    ) {
      this.listById = this.$route.params.id;
      this.listType = "listByTagId";
    }
    this.list(1);
  },
  watch: {
    isShow(val) {
      if (!val) {
        this.list(1);
      }
    },
    $route(to, from) {
      if (to.name === "ArticleList") {
        this.searchForm.keyword = "";
        this.listType = "";
        this.listById = -1;
      } else if (to.name === "ArticleListBySortId" && to.params.id) {
        this.listById = to.params.id;
        this.listType = "listBySortId";
      } else if (to.name === "ArticleListByTagId" && to.params.id) {
        this.listById = to.params.id;
        this.listType = "listByTagId";
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
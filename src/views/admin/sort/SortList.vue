<template>
  <div>
    <div class="manage">
      <el-dialog
        :title="operateType === 'add' ? '新增分类' : '更新分类'"
        :visible.sync="isShow"
        :destroy-on-close="true"
      >
        <common-form
          :formLabel="operateFormLabel"
          :form="operateForm"
          :inline="true"
          ref="form"
        >
        </common-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShow = false">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
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
      v-on:handleListArticle="listArticleById"
      v-on:handleDetail="detail"
      v-on:handleEdit="edit"
      v-on:handleDelete="deleteById"
      :tableData="tableData"
      :tableLabel="tableLabel"
      :showBtn="showBtn"
      :config="config"
    ></common-table>
  </div>
</template>

<script>
import CommonForm from "@/components/admin/CommonForm";
import CommonTable from "@/components/admin/CommonTable";
export default {
  name: "SortList",
  components: {
    CommonTable,
    CommonForm,
  },
  data() {
    return {
      showBtn: {
        listArticle: true,
        edit: true,
        delete: true,
      },
      currentPage: 1,
      operateType: "add",
      isShow: false,
      operateFormLabel: [
        {
          model: "sortName",
          label: "分类名",
          type: "input",
        },
      ],
      operateForm: {
        sortName: "",
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
          label: "分类ID",
          prop: "sortId",
          width: "200",
        },
        {
          label: "分类名",
          prop: "sortName",
          width: "400",
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
    list(page) {
      this.$axios
        .get("/api/sort/listForEdit", {
          params: {
            currentPage: page,
            pageSize: this.config.pageSize,
            keyword: this.searchForm.keyword,
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
    detail(item) {
      this.$router.push({
        path: "/sort/" + item.sortId,
      });
    },
    edit(item) {
      this.operateType = "edit";
      this.operateForm = item;
      this.isShow = true;
    },
    add() {
      this.operateType = "add";
      this.operateForm = {
        sortName: "",
      };
      this.isShow = true;
    },
    confirm() {
      if (this.operateForm.sortName === "") {
        this.open("请输入分类名", "error");
        return;
      }
      if (this.operateType === "add") {
        this.$axios
          .post("/api/sort/add", this.operateForm, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          })
          .then((resp) => {
            this.open(resp.data.msg, "success");
            this.operateForm.sortName = "";
            this.isShow = false;
            this.list(1);
          });
      } else {
        this.$axios
          .put("/api/sort/edit", this.operateForm, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          })
          .then((resp) => {
            this.open(resp.data.msg, "success");
            this.isShow = false;
            this.list(1);
          });
      }
      this.list(this.config.currentPage);
    },
    deleteById(item) {
      this.$axios
        .delete("/api/sort/delete", {
          params: {
            sortId: item.sortId,
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
    listArticleById(item) {
      let route = {
        name: "ArticleListBySortId",
        label: "根据分类检索文章",
        params: {
          type: "listBySortId",
          id: item.sortId,
        },
      };
      this.$store.commit("selectMenu", route);
      this.$router.push(route);
    },
  },
  created() {
    this.list(1);
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
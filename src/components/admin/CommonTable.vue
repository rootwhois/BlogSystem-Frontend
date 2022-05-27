<template>
  <div class="common-table">
    <el-table :data="tableData" stripe :border="true">
      <el-table-column
        :resizable="true"
        show-overflow-tooltip
        v-for="item in tableLabel"
        :key="item.prop"
        :label="item.label"
        :width="item.width ? item.width : 125"
        align="center"
      >
        <template slot-scope="scope">
          <span
            style="margin-left: 10px"
            v-show="item.prop !== 'commentStatus' && item.prop !== 'articleTop'"
            >{{ scope.row[item.prop] }}</span
          >
          <span
            style="margin-left: 10px"
            v-show="item.prop === 'commentStatus'"
            >{{
              scope.row[item.prop] === 0
                ? "已发布"
                : scope.row[item.prop] === 1
                ? "未审核"
                : "审核未通过"
            }}</span
          >
          <span style="margin-left: 10px" v-show="item.prop === 'articleTop'">{{
            scope.row[item.prop] === 0
              ? "否"
              : scope.row[item.prop] === 1
              ? "是"
              : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="250"
        :resizable="true"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleListArticle(scope.row)"
            v-show="showBtn.listArticle"
            type="success"
            plain
            >管理文章</el-button
          >
          <el-button
            size="mini"
            @click="handleListComment(scope.row)"
            v-show="showBtn.listComment"
            type="success"
            plain
            >管理评论</el-button
          >
          <el-button
            size="mini"
            @click="handleReply(scope.row)"
            v-show="showBtn.reply"
            type="success"
            plain
            >回复</el-button
          >
          <el-button
            size="mini"
            @click="handleDetail(scope.row)"
            v-show="showBtn.detail"
            type="primary"
            plain
            >查看详情</el-button
          >
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
            v-show="showBtn.edit"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            v-show="showBtn.delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center; margin-top: 10px"
      background
      layout="prev, pager, next"
      :current-page="config.currentPage"
      :page-size="config.pageSize"
      :page-count="config.totalPage"
      :total="config.total"
      @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "CommonTable",
  props: {
    tableData: Array,
    tableLabel: Array,
    config: Object,
    showEdit: Boolean,
    showDelete: Boolean,
    showBtn: {
      listArticle: false,
      listComment: false,
      detail: false,
      edit: false,
      delete: false,
      reply: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleListArticle(item) {
      this.$emit("handleListArticle", item);
    },
    handleListComment(item) {
      this.$emit("handleListComment", item);
    },
    handleReply(item) {
      this.$emit("handleReply", item);
    },
    handleDetail(item) {
      this.$emit("handleDetail", item);
    },
    handleEdit(item) {
      this.$emit("handleEdit", item);
    },
    handleDelete(item) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("handleDelete", item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    changePage(currentPage) {
      this.$emit("changePage", currentPage);
    },
  },
};
</script>

<style lang="less" scoped>
.common-table {
  height: calc(100% - 62px);
  background-color: #fff;
  position: relative;
  .pager {
    position: absolute;
    bottom: 0;
    right: 20px;
  }
}
</style>
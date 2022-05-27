<template>
  <div>
    <el-dialog title="日志详情" :visible.sync="isShow" :destroy-on-close="true">
      <el-descriptions>
    <el-descriptions-item label="id">{{history.id}}</el-descriptions-item>
    <el-descriptions-item label="操作者">{{history.operator}}</el-descriptions-item>
    <el-descriptions-item label="请求ip">{{history.operateIp}}</el-descriptions-item>
    <el-descriptions-item label="操作方法">{{history.operateMethod}}</el-descriptions-item>
    <el-descriptions-item label="操作类型">{{history.operateType}}</el-descriptions-item>
    <el-descriptions-item label="请求参数">{{history.params}}</el-descriptions-item>
    <el-descriptions-item label="结果状态">{{history.operateResultStatus}}</el-descriptions-item>
    <el-descriptions-item label="结果参数">{{history.operateResult}}</el-descriptions-item>
    <el-descriptions-item label="记录时间">{{history.createTime}}</el-descriptions-item>
</el-descriptions>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false" plain>关闭</el-button>
      </div>
    </el-dialog>
    <div class="manage">
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
      v-on:handleDetail="detail"
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
  name: "HistoryList",
  components: {
    CommonTable,
    CommonForm,
  },
  data() {
    return {
      history: {},
      isShow: false,
      showBtn: {
        detail: true,
      },
      currentPage: 1,
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
          label: "id",
          prop: "id",
          width: "100",
        },
        {
          label: "操作者",
          prop: "operator",
          width: "100",
        },
        {
          label: "请求ip",
          prop: "operateIp",
          width: "150",
        },
        {
          label: "操作方法",
          prop: "operateMethod",
          width: "100",
        },
        {
          label: "操作类型",
          prop: "operateType",
          width: "150",
        },
        {
          label: "请求参数",
          prop: "params",
          width: "300",
        },
        {
          label: "结果状态",
          prop: "operateResultStatus",
          width: "100",
        },
        {
          label: "结果参数",
          prop: "operateResult",
          width: "300",
        },
        {
          label: "记录时间",
          prop: "createTime",
          width: "150",
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
    detail(item) {
      this.isShow = true;
      this.history = item;
    },
    list(page) {
      this.$axios
        .get("/api/history/list", {
          params: {
            currentPage: page,
            pageSize: this.config.pageSize,
            keyword: this.searchForm.keyword,
          },
          headers: {
            Authorization: this.$store.state.token,
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
    search() {
      this.list(1);
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
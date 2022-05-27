<template>
  <div>
    <common-form
      :formLabel="operateFormLabel"
      :form="operateForm"
      :inline="true"
      ref="form"
    >
      <div slot>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </common-form>
  </div>
</template>

<script>
import CommonForm from "@/components/admin/CommonForm";
export default {
  name: "SortEdit",
  components: {
    CommonForm,
  },
  data() {
    return {
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
    };
  },
  methods: {
    confirm() {
      if (this.operateForm.sortName.trim() === "") {
        this.open("请输入分类名", "error");
        return;
      }
      this.$axios
        .post("/api/sort/add", this.operateForm, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((resp) => {
          this.open(resp.data.msg, "success");
          this.operateForm.sortName = "";
        });
    },
    open(msg, type) {
      this.$message({
        message: msg,
        type: type,
      });
    },
  },
};
</script>

<style lang="less" scopedsa>
</style>
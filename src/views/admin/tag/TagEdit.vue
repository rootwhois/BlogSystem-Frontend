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
  name: "TagEdit",
  components: {
    CommonForm,
  },
  data() {
    return {
      operateFormLabel: [
        {
          model: "tagName",
          label: "标签名",
          type: "input",
        },
      ],
      operateForm: {
        tagName: "",
      },
    };
  },
  methods: {
    confirm() {
      if (this.operateForm.tagName.trim() === "") {
        this.open("请输入标签名", "error");
        return;
      }
      this.$axios
        .post("/api/tag/add", this.operateForm, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((resp) => {
          this.open(resp.data.msg, "success");
          this.operateForm.tagName = "";
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
<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="网站id" prop="webId" style="display: none">
        <el-input v-model="ruleForm.webId" disabled></el-input>
      </el-form-item>
      <el-form-item label="管理员id" prop="webUserId" style="display: none">
        <el-input v-model="ruleForm.webUserId" disabled></el-input>
      </el-form-item>
      <el-form-item label="网站名称" prop="webName">
        <el-input v-model="ruleForm.webName"></el-input>
      </el-form-item>
      <el-form-item label="网站地址" prop="webDomain">
        <el-input v-model="ruleForm.webDomain"></el-input>
      </el-form-item>
      <!-- <el-form-item label="网站是否开放" prop="webIsOpen">
        <el-switch v-model="ruleForm.webIsOpen"></el-switch>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "WebSetting",
  data() {
    return {
      initData: {},
      ruleForm: {
        webId: "",
        webUserId: "",
        webIsOpen: true,
        webDomain: "",
        webName: "",
      },
      rules: {
        webName: [
          { required: true, message: "请输入网站名称", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
        ],
        webDomain: [
          { required: true, message: "请输入网站地址", trigger: "blur" },
          { type: "url", message: "请输入url地址", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .put("/api/web/edit", this.ruleForm, {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            })
            .then((resp) => {
              this.$message({
                message: resp.data.msg,
                type: "success",
              });
              this.getWebInfo();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      
      this.$nextTick(() => {
        this.ruleForm = Object.assign({}, this.initData);
      });
    },
    getWebInfo() {
      this.$axios
        .get("/api/web/webInfo", {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.ruleForm = res.data.data;
          this.$nextTick(() => {
            this.initData = Object.assign({}, this.ruleForm);
          });
        });
    },
  },
  created() {
    this.getWebInfo();
  },
};
</script>

<style lang="less" scoped>
</style>
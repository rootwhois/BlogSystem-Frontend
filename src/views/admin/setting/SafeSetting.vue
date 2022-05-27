<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          v-model="ruleForm.oldPassword"
          type="password"
          auto-complete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input
          type="password"
          v-model="ruleForm.pass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="ruleForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
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
import md5 from 'js-md5'
export default {
  name: "SafeSetting",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value === this.ruleForm.oldPassword) {
        callback(new Error("新密码不能与旧密码相同!"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      initData: {},
      ruleForm: {
        oldPassword: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        oldPassword: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        pass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        checkPass: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .put(
              "/api/admin/updatePassword",
              {
                oldPassword: md5(this.ruleForm.oldPassword),
                newPassword: md5(this.ruleForm.pass),
              },
              {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              }
            )
            .then((resp) => {
              if (resp.data.code === 200) {
                this.$message({
                  message: resp.data.msg + "，即将跳转到登录页面",
                  type: "success",
                });
                localStorage.removeItem("userInfo");
                localStorage.removeItem("token");
                setTimeout(() => {
                  this.$router.push("/admin");
                }, 2000);
              } else {
                this.$message({
                  type: "error",
                  message: resp.data.msg,
                });
              }
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
  },
  created() {
  },
};
</script>

<style lang="less" scoped>
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 40px;
}
</style>
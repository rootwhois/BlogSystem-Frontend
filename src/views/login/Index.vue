<template>
  <div class="login-container">
    <el-main>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm login-page"
        @keyup.enter.native="submitForm('ruleForm')"
      >
        <h3 class="title">个人博客管理系统——后台登录</h3>
        <el-form-item prop="username">
          <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            auto-complete="off"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <!-- <el-checkbox v-model="checked" class="rememberme">记住密码</el-checkbox> -->
        <el-form-item style="width:100%;">
          <el-button
            type="primary"
            style="width:100%;"
            @click="submitForm('ruleForm')"
            :loading="logining"
          >登录</el-button>
          <br />

          <el-button style="width:100%;" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  name: "Login",
  data() {
    return {
      logining: false,
      ruleForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '用户名长度不正确，请检查。', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度不正确，请检查。', trigger: 'blur' }
        ]
      },
      checked: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.logining = true
          this.$axios.post('/api/admin/login', {
            username: this.ruleForm.username,
            password: md5(this.ruleForm.password)
          }).then(response => {
            if (response.data.code == 200) {
              const jwt = response.headers['authorization']
              const data = response.data.data
              this.$store.commit("SET_TOKEN", jwt)
              this.$store.commit("SET_USERINFO", data)
              this.$router.push("/admin")
            } else {
              // this.logining = false
              //   this.$alert('用户名或密码错误！', '提示', {
              //     confirmButtonText: '知道了'
            }
          })
        } else {
          console.log('error submit!');
          return false;
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
</style>

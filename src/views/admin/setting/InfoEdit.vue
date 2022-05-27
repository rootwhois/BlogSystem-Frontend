<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="管理员id" prop="userId" style="display: none">
        <el-input v-model="ruleForm.userId" disabled></el-input>
      </el-form-item>
      <el-form-item label="登录名称" prop="userName">
        <el-input v-model="ruleForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="userNickname">
        <el-input v-model="ruleForm.userNickname"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="userAvatar">
        <section>
          <img v-if="!progressFlag" class="avatar" :src="ruleForm.userAvatar" />
          <div v-show="progressFlag" class="avatar">
            <el-progress
              type="circle"
              :percentage="progressPercent"
            ></el-progress>
          </div>
          <el-upload
            class="img-btn"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadImg"
          >
            <el-button plain round size="mini">更改头像</el-button></el-upload
          >
        </section>
      </el-form-item>
      <el-form-item label="邮箱" prop="userEmail">
        <el-input v-model="ruleForm.userEmail"></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="userBirthday">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="ruleForm.userBirthday"
            style="width: 100%"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-col>
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
export default {
  name: "InfoEdit",
  data() {
    return {
      progressPercent: 0,
      progressFlag: false,
      initData: {},
      ruleForm: {
        userId: "",
        userName: "",
        userNickname: "",
        userAvatar: "",
        userEmail: "",
        userBirthday: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        userNickname: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        userEmail: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱", trigger: "blur" },
        ],
        userBirthday: [
          { required: true, message: "请选择生日", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 上传图片前的过滤
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isGIF = file.type === "image/gif";

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error("上传头像图片只能是 JPG、PNG、GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return (isJPG || isPNG || isGIF) && isLt2M;
    },
    uploadImg(f) {
      console.log(f);
      this.progressFlag = true;
      let formdata = new FormData();
      formdata.append("image", f.file);
      this.$axios({
        url: "/api/upload/uploadPic",
        method: "post",
        data: formdata,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
        onUploadProgress: (progressEvent) => {
          // progressEvent.loaded:已上传文件大小
          // progressEvent.total:被上传文件的总大小
          this.progressPercent =
            (progressEvent.loaded / progressEvent.total) * 100;
        },
      })
        .then((res) => {
          this.ruleForm.userAvatar = res.data.data;
          if (this.progressPercent === 100) {
            this.progressFlag = false;
            this.progressPercent = 0;
          }
        })
        .then((error) => {
          console.log(error);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .put("/api/admin/update", this.ruleForm, {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            })
            .then((resp) => {
              this.$message({
                message: resp.data.msg + '，即将跳转到登录页面',
                type: "success",
              });
              localStorage.removeItem("userInfo");
              localStorage.removeItem("token");
              setTimeout(() => {
                this.$router.push("/admin");
              }, 2000);
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
    getInfo() {
      this.$axios
        .get("/api/admin/info", {
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
    this.getInfo();
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
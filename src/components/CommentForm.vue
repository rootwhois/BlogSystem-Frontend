<template>
  <!-- 评论输入表单 -->
  <div class="form">
    <h3>发表评论</h3>
    <el-form ref="formRef" :model="commentForm" :rules="rules" size="small">
      <el-form-item prop="commentContent">
        <el-input
          v-model="commentForm.commentContent"
          :class="'textarea'"
          :rows="5"
          maxlength="250"
          placeholder="请输入评论的内容..."
          show-word-limit
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item prop="commentNickname">
            <el-input
              v-model="commentForm.commentNickname"
              placeholder="昵称（必填）"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="commentEmail">
            <el-input
              v-model="commentForm.commentEmail"
              placeholder="邮箱（必填）"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="5">
          <el-form-item>
            <!-- 接口节流  -->
            <el-button
              size="medium"
              type="primary"
              v-throttle="[postForm, `click`, 3000]"
              >发表评论</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CommentForm",
  props: {
    commentSubId: {
      type: Number,
      default: -1,
    },
  },
  data() {
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        return callback();
      }
      //返回一个错误提示
      callback(new Error("请输入合法的邮箱"));
    };

    return {
      commentForm: {
        commentArticleId: "",
        commentContent: "",
        commentNickname: "",
        commentEmail: "",
        commentArticleId: 0,
        commentIp: "",
        commentSubId: this.commentSubId,
        // isAdminComment: false,
      },
      rules: {
        commentContent: [
          { required: true, message: "请输入评论的内容", trigger: "blur" },
        ],
        commentNickname: [
          { required: true, message: "请输入你的昵称" },
          { max: 15, message: "昵称不可多于15个字符", trigger: "blur" },
        ],
        commentEmail: [
          { required: true, message: "请输入你的邮箱便于及时收到回复" },
          {
            min: 2,
            max: 30,
            message: "不可多于30个字符、少于2个字符",
            trigger: "blur",
          },
          { validator: checkEmail },
        ],
      },
    };
  },
  methods: {
    //提交评论
    postForm() {
      //console.log(JSON.stringify(this.commentForm))
      //表单校验
      
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$axios
            .post("/api/comment/add", this.commentForm)
            .then((resp) => {
              {
                this.$alert(resp.data.data, "提示", {
                  confirmButtonText: "确定",
                  callback: (action) => {
                    if (resp.data.code == 200) {
                      this.$emit("handleRefresh");
                      this.$refs.formRef.resetFields();
                      this.commentForm.commentArticleId = articleId;
                    }
                  },
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  created() {
    if (this.$route.params.articleId) {
      this.commentForm.commentArticleId = this.$route.params.articleId;
    } else {
      alert("error");
      return false;
    }
  },
  watch: {
    $route(to, from) {
      const articleId = to.params.articleId;
      this.commentForm.commentArticleId = articleId;
    },
  },
};
</script>

<style scoped>
.form h3 {
  margin: 5px;
  font-weight: 500 !important;
}
.form .m-small {
  margin-left: 5px;
  padding: 4px 5px;
}
.el-form .textarea {
  margin-top: 5px;
  margin-bottom: 15px;
}
.el-form textarea {
  padding: 6px 8px;
}
.el-form textarea,
.el-form input {
  color: black;
}
.el-form .el-form-item__label {
  padding-right: 3px;
}
</style>
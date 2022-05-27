<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <el-form-item
        label="文章id"
        prop="article.articleId"
        style="display: none"
      >
        <el-input v-model="ruleForm.article.articleId" disabled></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="article.articleTitle">
        <el-input v-model="ruleForm.article.articleTitle"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="article.articleDescription">
        <el-input
          type="textarea"
          v-model="ruleForm.article.articleDescription"
        ></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="article.articleContent">
        <mavon-editor
          v-model="ruleForm.article.articleContent"
          ref="md"
          @imgAdd="imgAdd"
          @imgDel="imgDel"
          @save="saveMavon"
        />
      </el-form-item>
      <el-form-item label="是否置顶" prop="article.articleTop">
        <el-switch
          v-model="ruleForm.article.articleTop"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item label="分类" prop="articleSorts">
        <el-select
          v-model="ruleForm.articleSorts"
          placeholder="请选择分类"
          multiple
          :multiple-limit="1"
        >
          <el-option
            v-for="item in sorts"
            :key="item.sortId"
            :label="item.sortName"
            :value="item.sortId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="articleTags">
        <el-select
          v-model="ruleForm.articleTags"
          placeholder="请选择标签"
          multiple
        >
          <el-option
            v-for="item in tags"
            :key="item.tagId"
            :label="item.tagName"
            :value="item.tagId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "ArticleEdit",
  props: {
    articleId: {
      type: Number,
    },
    ruleForm: {
      type: Object,
      default: () => {
        return {
          article: {
            articleId: "",
            articleTitle: "",
            articleDescription: "",
            articleContent: "",
            articleTop: 0,
          },
          articleSorts: [],
          articleTags: [],
        };
      },
    },
  },
  data() {
    return {
      initData: {},
      sorts: [],
      tags: [],
      rules: {
        article: {
          articleTitle: [
            { required: true, message: "请输入标题", trigger: "blur" },
            {
              min: 3,
              max: 25,
              message: "长度在 3 到 25 个字符",
              trigger: "blur",
            },
          ],
          articleSorts: [
            { required: true, message: "请选择分类", trigger: "change" },
          ],
          articleTags: [
            {
              type: "array",
              required: true,
              message: "请至少选择一个标签",
              trigger: "change",
            },
          ],
          articleDescription: [
            { required: true, message: "请填写文章描述", trigger: "blur" },
          ],
          articleContent: [
            { required: true, message: "请填写文章内容", trigger: "blur" },
          ],
        },
      },
    };
  },
  methods: {
    handleShow() {
      this.$emit("handleShow");
    },
    saveMavon(value, render) {
      console.log("this is render" + render);
      console.log("this is value" + value);
      console.log(this.$refs.md.d_render);
    },
    // 将图片上传到服务器，返回地址替换到md中
    imgAdd(pos, $file) {
      var formdata = new FormData();
      formdata.append("image", $file);
      this.$axios
        .post("/api/upload/uploadPic", formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((response) => {
          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          if (response.status === 200) {
            var url = response.data.data;
            this.$refs.md.$img2Url(pos, url);
          }
        });
    },
    imgDel(pos) {},
    getData() {
      this.$axios.get("/api/sort/listAll").then((res) => {
        this.sorts = res.data.data;
      });
      this.$axios.get("/api/tag/listAll").then((res) => {
        this.tags = res.data.data;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/api/article/editArticle", this.ruleForm, {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            })
            .then((res) => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: res.data.msg,
                });
                this.ruleForm.article = {
                  articleId: "",
                  articleUserId: "",
                  articleTitle: "",
                  articleDescription: "",
                  articleContent: "",
                  articleTop: 0,
                };
                this.ruleForm.articleSorts = [];
                this.ruleForm.articleTags = [];
                this.handleShow();
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg,
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
        this.ruleForm.article = Object.assign({}, this.initData);
      });
    },
    getArticleInfo(articleId) {
      // 存在articleId，则为编辑，需要回显
      if (articleId) {
        
        this.$axios.get("/api/article/oneForEdit?id=" + articleId, 
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }).then((resp) => {
          this.ruleForm.article = resp.data.data.article;
          this.ruleForm.articleSorts = resp.data.data.articleSorts;
          this.ruleForm.articleTags = resp.data.data.articleTags;
          this.$nextTick(() => {
            this.initData = Object.assign({}, this.ruleForm.article);
          });
        });
      }
    },
  },
  created() {
    this.getData();
    if (this.$route.params.articleId) {
      this.getArticleInfo(this.$route.params.articleId);
    } else if (this.articleId !== -1) {
      this.getArticleInfo(this.articleId);
    }
  },
  watch: {
    articleId(newVal, oldVal) {
      if (newVal !== -1) {
        this.getArticleInfo(newVal);
      } else {
        this.ruleForm.article = Object.assign({});
        this.initData = Object.assign({});
      }
    },
    $route(to, from) {
      if (to.name === "ArticleEdit") {
        if (this.$route.params.articleId) {
          this.getArticleInfo(this.$route.params.articleId);
        } else if (this.articleId) {
          this.getArticleInfo(this.articleId);
        }
      } else if (to.name === "ArticleAdd") {
        this.ruleForm.article = Object.assign({});
        this.initData = Object.assign({});
      }
    },
  },
};
</script>

<style scoped>
</style>
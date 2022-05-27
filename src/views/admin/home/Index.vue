<template>
  <div>
    <el-row class="home" :gutter="20">
      <el-col :span="9" style="margin-top: 20px">
        <el-card shadow="hover" class="info">
          <div class="user">
            <img :src="userInfo.userAvatar" class="avatar" />
            <div class="userinfo">
              <h3 class="name">
                {{ userInfo.userNickname }}
                <span class="mini">({{ userInfo.userName }})</span>
              </h3>
              <p class="email">{{ userInfo.userEmail }}</p>
            </div>
          </div>
          <div class="login-info">
            <p>上次登录时间：{{ lastLoginTime }}</p>
            <p>上次登录IP：{{ lastLoginIp }}</p>
          </div>
        </el-card>
        <div class="num">
          <el-card
            shadow="hover"
            v-for="item in countData"
            :key="item.name"
            :body-style="{ padding: 0 }"
          >
            <i
              class="icon"
              :class="`el-icon-${item.icon}`"
              :style="{ background: item.color }"
            ></i>
            <div class="detail">
              <p class="num">{{ item.value }}</p>
              <p class="txt">{{ item.name }}</p>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="15">
        <el-card style="margin-top: 20px; height: 450px" shadow="hover">
          <h3 style="text-align: center">近期评论</h3>
          <el-table :data="commentData" height="350">
            <el-table-column
              v-for="(val, key) in commentLabel"
              :key="key"
              :prop="key"
              :label="val"
            >
            </el-table-column>
          </el-table>
        </el-card>
        <el-card style="margin-top: 20px; height: 400px" shadow="hover">
          <h3 style="text-align: center">日志信息</h3>
          <el-table :data="historyData" height="300">
            <el-table-column
              v-for="(val, key) in historyLabel"
              :key="key"
              :prop="key"
              :label="val"
            >
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "AdminHome",
  data() {
    return {
      commentData: [],
      commentLabel: {
        createTime: "时间",
        commentNickname: "评论者昵称",
        commentContent: "评论内容",
      },
      historyData: [],
      historyLabel: {
        createTime: "时间",
        operator: "操作者昵称",
        operateType: "操作类型",
      },
      lastLoginTime: "",
      lastLoginIp: "",
      countData: [
        {
          name: "文章数",
          value: 0,
          icon: "document",
          color: "#2ec7c9",
        },
        {
          name: "分类数",
          value: 0,
          icon: "folder",
          color: "#ffb980",
        },
        {
          name: "标签数",
          value: 0,
          icon: "collection-tag",
          color: "#5ab1ef",
        },
        {
          name: "评论数",
          value: 0,
          icon: "chat-line-round",
          color: "#d87a80",
        },
      ],
    };
  },
  methods: {
    getData() {
      this.$axios
        .get("/api/history/listSuccess", {
          params: {},
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.historyData = res.data.data.records;
        });
    },
    getCommentData() {
      this.$axios
        .get("/api/comment/listAll", {
          params: {},
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.commentData = res.data.data.records;
        });
    },
    getInfo() {
      this.$axios.get("/api/web/info").then((res) => {
        this.countData[0].value = res.data.data.articleCount;
        this.countData[1].value = res.data.data.sortCount;
        this.countData[2].value = res.data.data.tagCount;
        this.countData[3].value = res.data.data.commentCount;
      });
    },
    getLastLoginInfo() {
      this.$axios
        .get("/api/history/lastLogin", {
          params: {
            userName: this.$store.state.userInfo.userName,
          },
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.lastLoginTime = res.data.data.lastLoginTime;
          this.lastLoginIp = res.data.data.lastLoginIp;
        });
    },
  },
  created() {
    this.userInfo = this.$store.state.userInfo;
    this.getData();
    this.getInfo();
    this.getLastLoginInfo();
    this.getCommentData();
  },
  watch: {
    $route() {
      this.getData();
      this.getInfo();
      this.getLastLoginInfo();
      this.getCommentData();
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  .user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-right: 40px;
    }
    &info {
      .name {
        font-size: 32px;
        margin-bottom: 10px;
      }
      .email {
        color: #999999;
      }
    }
  }
  .login-info {
    p {
      font-size: 14px;
      color: #999999;
      span {
        color: #666666;
        margin-left: 60px;
      }
    }
  }
  .num {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-card {
      width: 48%;
      margin-bottom: 20px;
    }
    .icon {
      font-size: 30px;
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      color: #fff;
    }
    .detail {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 10px;
      .num {
        align-self: center;
        font-size: 30px;
        margin-bottom: 10px;
      }
      .txt {
        font-size: 14px;
        text-align: center;
        color: #999999;
      }
    }
  }
  .graph {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .el-card {
      width: 48%;
    }
  }
}
.info {
  margin-bottom: 20px;
}
.mini {
  font-size: 20px;
  color: #ccc;
}
</style>
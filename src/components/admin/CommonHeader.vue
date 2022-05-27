<template>
  <header>
    <div class="l-content">
      <span
        v-show="isCollapse"
        class="el-icon-s-unfold icon hover"
        @click="handleMenu"
      ></span>
      <span
        v-show="!isCollapse"
        class="el-icon-s-fold icon hover"
        @click="handleMenu"
      ></span>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="item in breadcrumb"
          :key="item.path"
          >{{item.label}}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown @command="handleCommand">
        <span>
          <el-avatar :size="40" :src="userInfo.userAvatar"></el-avatar>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="returnMain">回到首页</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "CommonHeader",
  data() {
    return {
      isCollapse: false,
      userInfo: {},
    };
  },
  methods: {
    handleMenu() {
      this.$store.commit("collapseMenu");
      this.isCollapse = !this.isCollapse;
    },
    returnMain() {
      this.$router.push("/");
    },
    logout() {
      this.$axios
        .get("/api/admin/logout", {
          params: {},
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          this.$store.commit("REMOVE_INFO");
          this.$router.push("/login");
        });
    },
    handleCommand(command) {
      if (command === "logout") {
        this.logout();
      } else if (command === "returnMain") {
        this.returnMain();
      }
    },
  },
  computed: {
    ...mapState({
      breadcrumb: (state) => state.tab.breadcrumb,
    }),
  },
  created() {
    this.userInfo = this.$store.state.userInfo;
  },
};
</script>

<style lang="less" scoped>
header {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
.l-content {
  display: flex;
  align-items: center;
  .icon {
    margin-right: 20px;
  }
}
.hover {
  cursor: pointer;
}
</style>
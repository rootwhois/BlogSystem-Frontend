<template>
  <el-container style="height: 100%">
    <!-- 侧边栏 -->
    <el-aside width="auto">
      <common-aside></common-aside>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <common-header></common-header>
      </el-header>
      <common-tag></common-tag>
      <!-- 主体 -->
      <el-main class="container">
        <router-view></router-view>
        <el-backtop target=".container">
          <div
            style="
               {
                height: 100%;
                width: 100%;
                background-color: #f2f5f6;
                box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
                text-align: center;
                line-height: 40px;
                color: #1989fa;
              }
            "
          >
            UP
          </div>
        </el-backtop>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonAside from "@/components/admin/CommonAside";
import CommonHeader from "@/components/admin/CommonHeader";
import CommonTag from "@/components/admin/CommonTag";
export default {
  name: "AdminIndex",
  components: {
    CommonAside,
    CommonHeader,
    CommonTag,
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100vh; //核心
  overflow-x: hidden; //核心
}
.el-header {
  background-color: #fff;
}
.el-container {
  height: 100%;
}
.el-main {
  border-top: 2px solid #bfcbd9;
}
</style>
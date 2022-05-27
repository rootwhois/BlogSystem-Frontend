<template>
  <div style="height: 100%">
    <el-menu
      default-active="首页"
      class="el-menu-vertical-demo"
      background-color="#2f4156"
      active-text-color="#4091ff"
      text-color="#bfcbd9"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      :unique-opened="true"
    >
      <h3>{{ isCollapse ? "后台" : "个人博客管理系统" }}</h3>
      <el-menu-item
        @click="clickMenu(item)"
        v-for="item in noChildren"
        :key="item.label"
        :index="item.label"
      >
        <i :class="'el-icon-' + item.icon"></i>
        <span slot="title">{{ item.label }}</span>
      </el-menu-item>
      <el-submenu
        v-for="item in hasChildren"
        :key="item.label"
        :index="item.label"
      >
        <template slot="title">
          <i :class="'el-icon-' + item.icon"></i>
          <span slot="title">{{ item.label }}</span>
        </template>
        <el-menu-item-group
          v-for="subItem in item.children"
          :key="subItem.label"
        >
          <el-menu-item :index="subItem.label" @click="clickMenu(subItem)">{{
            subItem.label
          }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "CommonAside",
  data() {
    return {
      menu: [
        {
          name: "AdminHome",
          label: "首页",
          icon: "s-home",
        },
        {
          label: "文章管理",
          icon: "document",
          children: [
            {
              label: "新建文章",
              name: "ArticleAdd",
            },
            {
              label: "文章列表",
              name: "ArticleList",
            },
          ],
        },
        {
          label: "分类管理",
          icon: "folder",
          children: [
            {
              label: "新建分类",
              name: "SortAdd",
            },
            {
              label: "分类列表",
              name: "SortList",
            },
          ],
        },
        {
          label: "标签管理",
          icon: "collection-tag",
          children: [
            {
              label: "新建标签",
              name: "TagAdd",
            },
            {
              label: "标签列表",
              name: "TagList",
            },
          ],
        },
        {
          label: "评论管理",
          icon: "chat-line-round",
          children: [
            {
              label: "评论列表",
              name: "CommentList",
            },
          ],
        },
        {
          label: "系统管理",
          icon: "setting",
          children: [
            {
              label: "个人信息设置",
              name: "InfoSetting",
              icon: "setting",
            },
            {
              label: "安全信息设置",
              name: "SafeSetting",
              icon: "setting",
            },
            {
              label: "网站信息设置",
              name: "WebSetting",
              icon: "setting",
            },
            {
              label: "网站日志信息",
              name: "HistoryList",
              icon: "order",
            },
          ],
        },
      ],
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    clickMenu(item) {
      this.$router.push({
        name: item.name,
      });
      this.$store.commit("selectMenu", item);
    },
  },
  computed: {
    noChildren() {
      return this.menu.filter((item) => {
        return !item.children;
      });
    },
    hasChildren() {
      return this.menu.filter((item) => {
        return item.children;
      });
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse;
    },
  },
};
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu {
  height: 100%;
  border: none;
  h3 {
    text-align: center;
    color: #fff;
    line-height: 48px;
  }
}
</style>

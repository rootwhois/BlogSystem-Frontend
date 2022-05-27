<template>
  <div class="tabs">
    <el-tag
      v-for="(item, index) in tabsList"
      :key="item.name"
      size="medium"
      :closable="item.name !== 'AdminHome'"
      :effect="$route.name === item.name ? 'dark' : 'light'"
      @click="changeMenu(item)"
      @close="handleClose(item, index)"
    >
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "CommonTag",
  data() {
    return {};
  },
  methods: {
    changeMenu(item) {
      this.$router.push(item);
      this.$store.commit("changeMenu", item);
    },
    handleClose(item, index) {
      const length = this.tabsList.length - 1;
      this.close(item);
      if (item.name !== this.$route.name) {
        return;
      }
      if (index === length) {
        this.changeMenu(this.tabsList[length - 1]);
      } else {
        this.changeMenu(this.tabsList[index]);
      }
    },
    ...mapMutations({
      close: "closeTag",
    }),
  },
  computed: {
    ...mapState({
      tabsList: (state) => state.tab.tabsList,
    }),
  },
};
</script>

<style lang="less" scoped>
.tabs {
  padding-left: 20px;
  .el-tag {
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>
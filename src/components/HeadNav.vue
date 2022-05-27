<template>
  <div>
    <div class="m-content">
      <div class="m-action">
        <span>
          <el-link @click="handleSwitchRouter('Home')">主页</el-link>
        </span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span>
          <el-link @click="handleSwitchRouter('Sort')">分类</el-link>
        </span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span>
          <el-link @click="handleSwitchRouter('Tag')">标签</el-link>
        </span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span>
          <el-link @click="handleSwitchRouter('AdminHome')">后台管理</el-link>
        </span>
      </div>

      <el-autocomplete
        class="m-search"
        v-model="query"
        :fetch-suggestions="debounceQuery"
        placeholder="请输入内容"
        popper-class="m-search-item"
        suffix-icon="el-icon-search"
        @select="handleSelect"
      >
        <i slot="suffix" class="search icon el-input__icon"></i>
        <template slot-scope="{ item }">
          <div class="title">{{ item.articleTitle }}</div>
          <span class="content">{{ item.articleContent }}</span>
        </template>
      </el-autocomplete>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeadNav",
  data() {
    return {
      query: "",
      result: [],
    };
  },
  methods: {
    handleSwitchRouter(item) {
      this.$emit("handleSwitchRouter", item);
    },
    debounceQuery(query, callback) {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(
        () => this.querySearchAsync(query, callback),
        500
      );
    },
    querySearchAsync(query, callback) {
      if (
        query == null ||
        query.trim() === "" ||
        query.indexOf("%") !== -1 ||
        query.indexOf("_") !== -1 ||
        query.indexOf("[") !== -1 ||
        query.indexOf("#") !== -1 ||
        query.indexOf("*") !== -1
      ) {
        callback([{ articleTitle: "请输入搜索内容" }]);
        return;
      } else if (query.trim().length < 2) {
        callback([{ articleTitle: "请输入至少两个字符" }]);
        return;
      } else if (query.trim().length > 20) {
        callback([{ articleTitle: "搜索内容过长，请重新输入" }]);
        return;
      }

      
      this.$axios
        .get("/api/article/list?query=" + query)
        .then((res) => {
          this.result = res.data.data.records;
          if (this.result.length === 0) {
            this.result.push({ articleTitle: "无相关搜索结果" });
          }
          callback(this.result);
        })
        .catch(() => {
          this.msgError("请求失败");
        });
    },
    handleSelect(item) {
      if (item.articleId) {
        this.$router.push(`/article/${item.articleId}`);
      }
    },
  },
  created() {},
};
</script>

<style>
.m-content {
  margin-right: 50px;
  text-align: center;
}
.m-action {
  margin: 10px;
}
.m-action .el-link--inner {
  font-size: 25px;
}
.el-dropdown-link {
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.dropdown-link {
  font-size: 25px;
  font-weight: 500;
}
.m-search {
  width: 500px;
}
</style>
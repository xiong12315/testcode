<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意: 只允许为第三级分类设置参数！" type="warning" :closable="false"> </el-alert>
      <el-row class="cateselect">
        <el-col>
          <span>请选择商品：</span>
          <el-cascader v-model="cateValue" :options="cateList" :props="cateProp" @change="cateSelectKeys"></el-cascader>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      cateProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      cateValue: ''
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      let { data: res } = await this.$http.get('categories');
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败');
      }
      this.cateList = res.data;
    },
    cateSelectKeys() {
      console.log(this.cateValue);
      if (this.cateValue.length !== 3) {
        return (this.cateValue = []);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.cateselect {
  margin: 20px 0;
}
</style>

<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="注意: 只允许为第三级分类设置参数！" type="warning" :closable="false"> </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cateselect">
        <el-col>
          <span>请选择商品：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader v-model="cateValue" :options="cateList" :props="cateProp" @change="cateSelectKeys" clearable></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-row>
        <template>
          <el-tabs v-model="activeName" @tab-click="tabHandleClick">
            <!-- 添加动态参数的面板 -->
            <el-tab-pane label="动态参数" name="first">
              <el-button type="primary" :disabled="btnDisabled">添加参数</el-button>
            </el-tab-pane>
            <!-- 添加静态属性的面板 -->
            <el-tab-pane label="静态属性" name="second">
              <el-button type="primary" :disabled="btnDisabled">添加属性</el-button>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //商品分类列表
      cateList: [],
      //级联选择框的配置对象
      cateProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //级联选择框选中的数组
      cateValue: '',
      activeName: 'second'
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取所有的商品分类列表
    async getCateList() {
      let { data: res } = await this.$http.get('categories');
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败');
      }
      this.cateList = res.data;
    },
    //级联选择框选择项变化会触发这个函数
    cateSelectKeys() {
      console.log(this.cateValue);
      if (this.cateValue.length !== 3) {
        this.cateValue = [];
        return;
      }
      //证明选中的是三级分类
      console.log(this.cateValue);
    },
    tabHandleClick() {
      console.log(this.activeName);
    }
  },
  computed: {
    btnDisabled: function() {
      if (this.cateValue.length !== 3) {
        return true;
      }
      return false;
    }
  }
};
</script>
<style lang="scss" scoped>
.cateselect {
  margin: 20px 0;
}
</style>

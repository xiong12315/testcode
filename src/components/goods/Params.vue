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
            <el-tab-pane label="动态参数" name="many">
              <el-button type="primary" :disabled="btnDisabled">添加参数</el-button>
            </el-tab-pane>
            <!-- 添加静态属性的面板 -->
            <el-tab-pane label="静态属性" name="only">
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
      //激活的tab框
      activeName: 'many'
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
      this.getParamsDate();
    },
    tabHandleClick() {
      console.log(this.activeName);
      this.getParamsDate();
    },
    //不管是切换tab还是cascader切换都能触发数据获取
    async getParamsDate() {
      if (this.cateValue.length !== 3) {
        this.cateValue = [];
        return;
      }
      //证明选中的是三级分类
      console.log(this.cateValue);
      //选中三级分类就获取数据
      let { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } });
      console.log(this.activeName);
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败');
      }
      console.log(res.data);
    }
  },
  computed: {
    //定义的计算属性，按钮是否显示，只有已经选了三级分类才显示
    btnDisabled: function() {
      if (this.cateValue.length !== 3) {
        return true;
      }
      return false;
    },
    cateId: function() {
      if (this.cateValue.length === 3) {
        return this.cateValue[2];
      }
      return null;
    }
  }
};
</script>
<style lang="scss" scoped>
.cateselect {
  margin: 20px 0;
}
</style>

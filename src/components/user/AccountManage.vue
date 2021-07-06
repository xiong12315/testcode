<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Index/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>账号列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div>
        <!-- 搜索框区域 -->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary">添加用户</el-button>
          </el-col>
        </el-row>
        <!-- 用户表格区域 -->
        <el-table :data="userlist" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="姓名" prop="nickname"></el-table-column>
          <el-table-column label="角色" prop="show_name"></el-table-column>
          <el-table-column label="手机号码" prop="mobile"></el-table-column>
          <el-table-column label="公司" prop="company_name"></el-table-column>
          <!-- 自定义插槽区域 -->
          <el-table-column label="状态">
            <template v-slot="scope">
              <el-switch v-model="scope.row.is_active"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryinfo: {
        offset: 1,
        limit: 10
      },
      totle: 0,
      userlist: []
    };
  },
  created() {
    this.getUserlist();
  },
  methods: {
    async getUserlist() {
      await this.$http.get('/adminuser/list', { params: this.queryinfo }).then(res => {
        if (res.data.code !== 0) {
          return this.$message.error('获取错误');
        }
        //通过foreach将is_active转换为布尔值
        res.data.data.results.forEach(item => {
          if (item.is_active != 0) {
            item.is_active = true;
          } else {
            item.is_active = false;
          }
          this.userlist = res.data.data.results;
          this.totle = res.data.data.count;
        });
      });
    },
    //监听pagesize改变的事件
    handleSizeChange(newsize) {
      console.log(newsize);
    }
  }
};
</script>
<style lang="scss" scoped></style>

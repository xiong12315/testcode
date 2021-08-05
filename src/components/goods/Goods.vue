<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" clearable v-model="queryinfo.query" @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-row>
        <el-col>
          <el-table :data="goodslist" style="width: 100%" border stripe>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
            <el-table-column prop="goods_price" label="商品价格" width="100px"> </el-table-column>
            <el-table-column prop="goods_weight" label="商品重量" width="70px"> </el-table-column>
            <el-table-column prop="add_time" label="创建时间" width="180px">
              <template slot-scope="scope">
                {{ scope.row.add_time | dateformat }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="removeById(scope.row.goods_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="sizetotal"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodslist: [],
      sizetotal: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      let { data: res } = await this.$http.get('goods', { params: this.queryinfo });
      if (res.meta.status !== 200) {
        this.$message.error('失败');
      }
      console.log(res);
      this.goodslist = res.data.goods;
      this.sizetotal = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newSize) {
      this.queryinfo.pagenum = newSize;
      this.getGoodsList();
    },
    async removeById(row) {
      let confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (confirmResult !== 'confirm') {
        return this.$message.error('取消');
      }
      let { data: res } = await this.$http.delete(`goods/${row}`);
      if (res.meta.status !== 200) {
        return this.$message.error('错误');
      }
      this.$message.success('成功');
      this.getGoodsList();
    },
    goAddPage() {
      this.$router.push('/goods/add');
    }
  }
};
</script>
<style lang="scss" scoped></style>

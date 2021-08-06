<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" style="width: 100%" border stripe align="center">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100px"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="120px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay === 1" size="mini">已付款</el-tag>
            <el-tag type="danger" v-else size="mini">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="70px"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateformat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="success" icon="el-icon-location-outline" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      let { data: res } = await this.$http.get('orders', { params: this.queryInfo });
      if (res.meta.status !== 200) {
        return this.$message.error('错误');
      }
      this.orderList = res.data.goods;
      this.total = res.data.total;
      console.log(this.orderList);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getOrderList();
    }
  }
};
</script>
<style lang="scss" scoped></style>

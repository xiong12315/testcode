<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分列</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" class="addcatebtn" @click="addcate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-row>
        <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index border :show-row-hover="false">
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
            <i class="el-icon-error" v-else style="color:red"></i>
          </template>
          <template slot="order" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
          </template>
          <template slot="opt">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </tree-table>
      </el-row>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageNumChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="catetotal"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="cateDialogVisible" width="50%">
      <el-form ref="form" :model="addCateForm" label-width="80px" :rules="caterules">
        <el-form-item label="分类">
          <el-input v-model="addCateForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cateDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //商品数据列表，默认是空
      cateList: [],
      //总的数据条数
      catetotal: 0,
      //为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        //插槽列
        {
          label: '是否有效',
          //表示，将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          //表示，将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          //表示，将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'opt'
        }
      ],
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //控制添加按钮的显示与隐藏
      cateDialogVisible: false,
      //表单数据
      addCateForm: {
        name: ''
      },
      caterules: {
        name: [
          { required: true, message: '请输入分类', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      let { data: res } = await this.$http.get('categories', { params: this.queryInfo });
      if (res.meta.status !== 200) {
        return this.$message.error('获取错误');
      }
      // console.log(res);
      this.cateList = res.data.result;
      this.catetotal = res.data.total;
    },
    pageSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getCateList();
    },
    pageNumChange(newnum) {
      this.queryInfo.pagenum = newnum;
      this.getCateList();
    },
    //添加分类按钮
    addcate() {
      this.cateDialogVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.addcatebtn {
  margin-bottom: 20px;
}
</style>

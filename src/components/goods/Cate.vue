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
    <el-dialog title="添加分类" :visible.sync="cateDialogVisible" width="50%" @close="addCateDialogClosed">
      <el-form ref="addCateFormRef" :model="addCateForm" label-width="80px" :rules="caterules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="cateParentValue" :options="cateParentList" :props="cateParentProp" @change="cateHandleChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateCommit">确 定</el-button>
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
      //父级分类列表
      cateParentList: [],
      cateParentValue: [],
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
      //表单分类的数据对象
      addCateForm: {
        //将要添加的分类名称
        cat_name: '',
        //父级分类的id
        cat_pid: 0,
        //分类的等级，默认添加的一级分类
        cat_level: 0
      },
      caterules: {
        cat_name: [
          { required: true, message: '请输入分类', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      cateParentProp: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
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
      //现获取父级数据
      this.getParentList();
      // 再打开对话框
      this.cateDialogVisible = true;
    },
    //父级分类列表获取
    async getParentList() {
      let { data: res } = await this.$http.get('categories', { params: { type: 2 } });
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败');
      }
      this.cateParentList = res.data;
    },
    //监听数据的改变并获得数据
    cateHandleChange() {
      // console.log(this.cateParentValue);
      if (this.cateParentValue.length > 0) {
        this.addCateForm.cat_pid = this.cateParentValue[this.cateParentValue.length - 1];
        this.addCateForm.cat_level = this.cateParentValue.length;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    //点击按钮添加分类
    addCateCommit() {
      // console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        let { data: res } = await this.$http.post('categories', this.addCateForm);
        if (res.meta.status !== 201) {
          return this.$message.error('失败');
        }
        this.$message.success('成功');
        this.getCateList();
        this.cateDialogVisible = false;
      });
    },
    //监听表单的关闭并重置数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.cateParentValue = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      console.log(this.addCateForm);
    }
  }
};
</script>
<style lang="scss" scoped>
.addcatebtn {
  margin-bottom: 20px;
}
</style>

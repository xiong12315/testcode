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
              <el-button type="primary" :disabled="btnDisabled" @click="showAddDialog">添加参数</el-button>
              <el-table :data="manyTableData" style="width: 100%" border>
                <!-- 添加的展开行 -->
                <el-table-column type="expand">
                  <!-- 循环渲染Tag标签 -->
                  <template slot-scope="scope">
                    <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index, scope.row)">{{ item }}</el-tag>
                    <!-- 输入的文本框 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <!-- 添加的按钮 -->
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                    <el-button type="warning" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 添加静态属性的面板 -->
            <el-tab-pane label="静态属性" name="only">
              <el-button type="primary" :disabled="btnDisabled" @click="showAddDialog">添加属性</el-button>
              <el-table :data="onlyTableData" style="width: 100%" border>
                <el-table-column type="expand">
                  <!-- 循环渲染Tag标签 -->
                  <template slot-scope="scope">
                    <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index, scope.row)">{{ item }}</el-tag>
                    <!-- 输入的文本框 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <!-- 添加的按钮 -->
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                    <el-button type="warning" icon="el-icon-delete" @click="removeParams">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-row>
    </el-card>
    <el-dialog :title="'添加' + this.addDialog" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加参数对话框 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addDialogFormRef" label-width="150px">
        <el-form-item :label="'添加' + addDialog" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateData">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'修改' + this.editDialog" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 修改参数对话框 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editDialogFormRef" label-width="150px">
        <el-form-item :label="'修改' + editDialog" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateData">确 定</el-button>
      </span>
    </el-dialog>
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
      activeName: 'many',
      //动态参数的数据
      manyTableData: [],
      //静态属性的数据
      onlyTableData: [],
      //控制添加对话框的显示与隐藏
      addDialogVisible: false,
      //控制修改对话框的显示与隐藏
      editDialogVisible: false,
      //添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      editForm: {
        attr_name: ''
      },
      //添加表单的验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入添加名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入修改名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      }
      //文本框的显示与隐藏，这2个数据应该为自己的不是全部绑定
      // inputVisible: false,
      //文本框输入的内容
      // inputValue: ''
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
    //tab框变化会触发这个函数
    tabHandleClick() {
      // console.log(this.activeName);
      this.getParamsDate();
    },
    //不管是切换tab还是cascader切换都能触发数据获取
    async getParamsDate() {
      if (this.cateValue.length !== 3) {
        this.cateValue = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      //证明选中的是三级分类
      console.log(this.cateValue);
      //选中三级分类就获取数据
      let { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } });
      // console.log(this.activeName);
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败');
      }

      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? (item.attr_vals = item.attr_vals.split(',')) : [];
        //每个单独定义个input的信息，通过scope单独控制
        item.inputVisible = false;
        item.inputValue = '';
      });
      console.log(res.data);
      if (this.activeName === 'many') {
        this.manyTableData = res.data;
      }
      if (this.activeName === 'only') {
        this.onlyTableData = res.data;
      }
      // console.log(this.manyTableData);
    },
    //点击按钮展示添加对话框
    showAddDialog() {
      this.addDialogVisible = true;
    },
    //点击按钮展示修改对话框,并加载修改数据
    async showEditDialog(attrId) {
      let { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.activeName } });
      if (res.meta.status !== 200) {
        return this.$message.error('错误');
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    //监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addDialogFormRef.resetFields();
    },
    //监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editDialogFormRef.resetFields();
    },
    //添加确定后发起数据请求
    addCateData() {
      this.$refs.addDialogFormRef.validate(async valid => {
        if (!valid) return;
        let { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        });
        if (res.meta.status !== 201) {
          return this.$message.error('错误');
        }
        this.$message.success('成功');
        this.getParamsDate();
        this.addDialogVisible = false;
      });
    },
    //点击按钮，修改参数信息
    editCateData() {
      this.$refs.editDialogFormRef.validate(async valid => {
        if (!valid) return;
        let { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName });
        if (res.meta.status !== 200) {
          return this.$message.error('错误');
        }
        this.$message.success('成功');
        this.getParamsDate();
        this.editDialogVisible = false;
      });
    },
    //删除参数
    async removeParams(attrId) {
      let confirmResult = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      console.log(confirmResult);
      if (confirmResult !== 'confirm') {
        this.$message.info('已经取消');
      }
      if (confirmResult === 'confirm') {
        let { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`);
        if (res.meta.status !== 200) {
          this.$message.error('错误');
        }
        this.$message.success('成功');
        this.getParamsDate();
        this.editDialogVisible = false;
      }
    },
    //点击按钮展现文本框,通过scope.row传入来控制输入框的单独显示
    showInput(row) {
      row.inputVisible = true;
      //让文本框自动获得焦点
      //$nextTick方法的作用，当页面上元素被重新渲染之后，才会制定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //文本失去焦点，或者摁下Enter都会触发
    handleInputConfirm(row) {
      //trim
      console.log(row);
      if (row.inputValue.trim().length === 0) {
        row.inputValue = '';
        row.inputVisible = false;
        return;
      }
      //如果没有return就证明有内容，需要做后续的处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = '';
      row.inputVisible = false;
      this.commitData(row);
    },
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.commitData(row);
    },
    async commitData(row) {
      let { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(',') });
      if (res.meta.status !== 200) {
        this.$message.error('错误');
      }
      this.$message.success('成功');
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
    // 分类id
    cateId: function() {
      if (this.cateValue.length === 3) {
        return this.cateValue[2];
      }
      return null;
    },
    addDialog: function() {
      if (this.activeName === 'many') {
        return '动态参数';
      }
      return '静态属性';
    },
    editDialog: function() {
      if (this.activeName === 'many') {
        return '动态参数';
      }
      return '静态属性';
    }
  }
};
</script>
<style lang="scss" scoped>
.cateselect {
  margin: 20px 0;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag {
  width: 120px;
}
</style>

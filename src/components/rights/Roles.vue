<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/Index/Welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="RoleList" stripe border style="width: 100%">
        <!-- 展开列区域 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
              <!-- 渲染是一级权限 -->
              <el-col :span="5">
                <el-tag closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染是二级三级权限 -->
              <el-col :span="19">
                <el-row :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable>{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限直接就el-tag循环 -->
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="removeRoleById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- pre是可以格式化树形结构 -->
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改权限" :visible.sync="setDialogVisible" width="50%">
      <!-- 树形控件，添加一个show-checkbox就可以选择 -->
      <el-tree :data="RightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //角色列表数据
      RoleList: [],
      //是否展现设置权限的开关
      setDialogVisible: false,
      //获取的权限列表
      RightList: [],
      //树形控件的数据，其中children绑定父子嵌套的属性，label绑定是展现的名字
      treeProps: {
        children: 'children',
        label: 'authName'
      }
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    //获取角色列表
    async getRoleList() {
      let { data: res } = await this.$http.get('roles');
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色错误');
      }
      this.RoleList = res.data;
    },
    //根据id删除对应的权限
    async removeRoleById(role, rightid) {
      let confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      //这里$confirm如果确定是会返回一个confirm字符串，如果取消了就没有字符串返回
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除');
      }
      let { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightid}`);
      if (res.meta.status != 200) {
        return this.$message.error('删除失败');
      }
      //通过数据双向绑定，role对象的数据改变了
      role.children = res.data;
    },
    //展示角色所有的权限
    async showSetRightDialog() {
      let { data: res } = await this.$http.get('rights/tree');
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败');
      }
      //获取到的权限数据保存到data数据中
      this.RightList = res.data;
      //打开权限对话框
      this.setDialogVisible = true;
    }
    //通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
  }
};
</script>
<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>

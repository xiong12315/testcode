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
            <!-- 绑定clearable属性能清空对话框 -->
            <el-input placeholder="请输入内容" v-model="queryinfo.username" clearable @clear="getUserlist">
              <el-button slot="append" icon="el-icon-search" @click="getUserlist"></el-button>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
        <!-- 用户表格区域 -->
        <el-table :data="userlist" border stripe>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="姓名" prop="nickname"></el-table-column>
          <el-table-column label="角色" prop="show_name"></el-table-column>
          <el-table-column label="手机号码" prop="mobile"></el-table-column>
          <el-table-column label="公司" prop="company_name"></el-table-column>
          <!-- 自定义插槽区域 -->
          <el-table-column label="状态">
            <template v-slot="scope">
              <el-switch v-model="scope.row.is_active" @change="userstatechange(scope.row)"> </el-switch>
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
          :page-sizes="[1, 3, 5, 10]"
          :page-size="queryinfo.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="addForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass">
          <el-input v-model="addForm.checkpass"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="addForm.role" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.show_name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogcommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regPhone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regPhone.test(value)) {
        return cb();
      }
      cb(new Error('请输入正确的手机号'));
    };
    //验证再次输入的密码
    var checkpassword = (rule, value, cb) => {
      if (value !== this.addForm.password) {
        cb(new Error('两次输入密码不一致!'));
      } else {
        cb();
      }
    };
    return {
      // 获取用户列表的参数对象
      queryinfo: {
        // 当前的offset，页数要进行换算
        offset: 0,
        // 当前的每页显示多少数据，一个默认值并动态绑定
        limit: 10,
        username: ''
      },
      total: 0,
      userlist: [],
      currentPage4: 1,
      // 显示对话框的隐藏和显示，一个布尔值
      addDialogVisible: false,
      //角色列表，从local中获取公司的角色列表
      roleList: [],
      // 添加用户表单数据

      addForm: {
        nickname: '',
        username: '',
        is_active: true,
        password: '',
        role: '',
        permissions: JSON.stringify([{ permission_id: 120, permission_name: '主页', group: '主页' }]),
        mobile: '',
        checkpass: ''
      },
      //添加用户的规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        checkpass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: checkpassword, trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getUserlist();
  },
  mounted() {
    this.roleList = JSON.parse(sessionStorage.getItem('company_roles'));
    // console.log(this.roleList);
  },
  methods: {
    //得到用户列表函数，多处可以调用
    async getUserlist() {
      await this.$http.get('/adminuser/list', { params: this.queryinfo }).then(res => {
        if (res.data.code != 0) {
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
          this.total = res.data.data.count;
        });
      });
    },
    //监听pagesize改变的事件
    handleSizeChange(newsize) {
      // console.log(newsize);
      this.queryinfo.limit = newsize;
      this.getUserlist();
    },
    //监听页码值的改变并返回offset
    handleCurrentChange(newpage) {
      // console.log(newpage);
      let offset = this.queryinfo.limit * newpage - this.queryinfo.limit;
      this.queryinfo.offset = offset;
      if (newpage === 1) {
        this.queryinfo.offset = 0;
      }
      this.getUserlist();
    },
    //监听switch的开关状态的改变
    async userstatechange(userinfo) {
      // console.log(userinfo);
      let data1 = {}; //post请求需要发送json，空的也可以
      if (userinfo.is_active == true) {
        const res = await this.$http.post(`adminuser/enable/${userinfo.pk}`, data1);
        if (res.status !== 200) {
          userinfo.is_active = !userinfo.is_active;
          return this.$message.error('更新用户状态失败');
        }
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '启用成功'
          });
        }
      } else {
        const res = await this.$http.post(`adminuser/disable/${userinfo.pk}`, data1);
        if (res.status !== 200) {
          userinfo.is_active = !userinfo.is_active;
          return this.$message.error('更新用户状态失败');
        }
        if (res.data.code == 0) {
          this.$message({
            type: 'success',
            message: '停用成功'
          });
        }
      }
    },
    //监听添加用户对话框关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //提交按钮后进行validate判断，过了才能发起请求
    addDialogcommit() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return;
        //可以发起添加的请求
        let res = this.$http.post('adminuser/add', this.addForm);
        console.log(res);
        if (res.code !== 0) return this.$message.error('添加失败');
        this.$message.success('用户添加成功');
        //完成隐藏对话框
        this.addDialogVisible = false;
        //刷新用户列表
        this.getUserlist();
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>

<template>
  <div>
    <el-container class="home_container">
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div>
          <img src="../assets/img1.png" class="title_img" />
        </div>
        <div class="toggle-button" @click="changeCollapse">
          III
        </div>
        <el-menu background-color="#4e73df" text-color="#fff" active-text-color="#ffd04b" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="$route.path"
          ><!-- $route.path 当前路由对象的路径 -->
          <!-- 一级菜单,动态数据绑定中要用字符串，所以要item.id+''-->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板 区域-->
            <template slot="title">
              <!-- 图标 -->
              <img :src="item.img" style="width: 20px;height: 20px;margin-right: 9px" v-if="item.level === 1" />
              <!-- 文本 -->
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subitem.url" v-for="subitem in item.childNode" :key="subitem.id">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ subitem.name }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header height="70px">
          <div>
            <span>XXX后台管理系统</span>
          </div>
          <el-dropdown trigger="click" @command="handleCommand" class="div2">
            <span class="el-dropdown-link">
              <span>Mr.SB</span>
              <img src="../assets/img1.png" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="pro">个人信息</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      //是否折叠
      isCollapse: false
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    handleCommand(command) {
      if (command == 'logout') {
        sessionStorage.clear();
        this.$router.push('/login');
      }
    },
    //获取菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('me');
      // console.log(res)
      if (res.code !== 0) return this.$message.error(res.data.detail);
      this.menulist = res.data.menus;
      // console.log(this.menulist)
    },
    changeCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>
<style lang="scss" scoped>
.home_container {
  height: 100vh;
}
.el-aside {
  background-color: #4e73df;
  .el-menu {
    border-right-width: 0px;
  }
}
.title_img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
.toggle-button {
  background: #7e63df;
  line-height: 30px;
  font-size: 15px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-header {
  background-color: #ffffff;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > .div2 {
    display: flex;
    span {
      font-size: 20px;
      display: flex;
      align-items: center;
    }
    img {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      margin-left: 15px;
      display: flex;
      align-items: center;
    }
  }
}
.el-main {
  background-color: #f8f9fc;
}
</style>
